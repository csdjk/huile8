const vscode = require('vscode');
const window = vscode.window;

const channel = window.createOutputChannel('huile8');

const Logger = {
	error(...args) {
		channel.appendLine(`[error] ${args.join(' ')}`);

		// const config = vscode.workspace.getConfiguration('syncSettings');
		// const showErrorAlert = config.get('showErrorAlert') || true;

		// if (showErrorAlert) {
		// 	window.showErrorMessage(`Sync Settings: ${args.join(' ')}`);
		// }
	},
	info(...args) {
		channel.appendLine(`[info] ${args.join(' ')}`);
	},
	show() {
		channel.show();
	},
};

module.exports = {
	Logger,
};