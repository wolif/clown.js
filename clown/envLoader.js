
const fs = require('fs');

module.exports = {
    data: {},
    load: function (file) {
        if (!fs.existsSync(file)) {
            throw new Error(`file ${file} not found`);
        }
        let data = {};
        fs.readFileSync(file, 'utf8').toString().split(/\r|\n|\r\n/).forEach(function (val, idx) {
            const matches = val.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (matches !== null) {
                data[matches[1].trim()] = (matches[2] || '').trim();
            }
        });
        this.data = data;
    },
    get: function(name = null, defaultVal = null) {
        if (name === null) {
            return this.data;
        }

        if (this.data[name] !== undefined) {
            return this.data[name];
        }
        return defaultVal;
    }
};