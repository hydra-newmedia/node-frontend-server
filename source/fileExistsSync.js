/**
 * Created by chotz on 14.01.16.
 */
var fs = require('fs');

module.exports = fs.existsSync || function existsSync(filePath) {
        try {
            fs.statSync(filePath);
        } catch (err) {
            if (err.code == 'ENOENT') return false;
        }
        return true;
    };
