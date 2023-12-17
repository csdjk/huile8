const fs = require('fs');

class Storage {

    constructor(dbPath) {

        this.dbFile = dbPath;
        this.masteredList = new Set();

        if (fs.existsSync(this.dbFile)) {
            const json = fs.readFileSync(this.dbFile).toString();
            json.split('\n').forEach(word => {
                word = word.trim();
                if (word != '')
                    this.masteredList.add(word.trim());
            });
        }
    }

    saveToFile() {
        const list = Array.from(this.masteredList).map(word => {
            return word;
        });
        fs.writeFileSync(this.dbFile, list.join('\n'));
    }

    hasMastered(item) {
        return this.masteredList.has(item);
    }

    addMastered(item) {
        this.masteredList.add(item);
        this.saveToFile();
    }

    removeMastered(item) {
        this.masteredList.delete(item);
        this.saveToFile();
    }

    getMasteredList() {
        return Array.from(this.masteredList);
    }
}

module.exports = Storage;