const fs = require('fs').promises;

async function exists(file) {
    try {
        await fs.access(file);
        return true;
    }
    catch (error) {
        return false;
    }
}

module.exports = { exists };