// 获取当前打开页面的单词
const { configReload, autoRefresh } = require('./config');
const fs = require('fs/promises');
const { Logger } = require('./utils/logger');
const fse = require('fs-extra');
const createSimpleGit = require('simple-git');
const simpleGit = require('simple-git');
const semver = require('semver');
const Storage = require('./storage');
const { Uri } = require('vscode');


class RemoteGitRepository {

    constructor(context, data) {
        this.rootPath = context.globalStoragePath + '/repository';
        this.dbFile = this.rootPath + '/huile8-mastered-list.txt';
        this.branch = data.branch || 'master';
        this.remoteUrl = data.url || '';
        this.git = createSimpleGit();
        Logger.info('git repository path:', this.rootPath);


        this.createLocalRepository();

        // 监听配置改变
        context.subscriptions.push(configReload);
    }

    async getVersion() { // {{{
        if (this._version) {
            return this._version;
        }

        const raw = await this.git.raw('--version');
        const match = /(\d+\.\d+\.\d+)/.exec(raw);
        this._version = match ? match[1] : '2.0.0';

        return this._version;
    }

    async exists(file) {
        try {
            await fs.access(file);
            return true;
        }
        catch {
            return false;
        }
    }

    async createFileIfNotExists(filePath, content) {
        try {
            await fs.access(filePath);
            // console.log('文件已存在，忽略创建');
        } catch (error) {
            await fs.writeFile(filePath, content);
            // console.log('文件创建成功');
        }
    }

    async initRepo() { // {{{
        Logger.info('creating git at', this.rootPath);

        if (semver.gte(await this.getVersion(), '2.28.0')) {
            await this.git.init({
                '--initial-branch': this.branch,
            });
        }
        else {
            await this.git.init();

            await this.git.checkoutLocalBranch(this.branch);
        }

        this.createFileIfNotExists(this.dbFile, '');

    }

    //check and Init git repository
    async createLocalRepository(remove) {
        try {
            if (remove) {
                await fse.remove(this.rootPath);
            }

            await fs.mkdir(this.rootPath, { recursive: true });

            await this.git.cwd(this.rootPath);

            await this.initRepo();

            Logger.info('adding new remote:', this.remoteUrl);
            await this.git.addRemote('origin', this.remoteUrl);

            Logger.info('fetch from remote');

            await this.git.fetch();

            

            const branches = await this.git.branch({
                '--all': null,
            });

            if (branches.all.includes(`remotes/origin/${this.branch}`)) {
                Logger.info('pull from remote');

                await this.git.pull('origin', this.branch);

                Logger.info('pull done');
            }

            return true;
        } catch (error) {
            Logger.error(error);

            return false;
        }
    }

};

module.exports = {
    RemoteGitRepository
};

