const _ = require('lodash');
const EventEmitter = require('events').EventEmitter;

class Storage extends EventEmitter
{
    constructor() {
        super();
        this.data = {};
    }

    set(name, value, expireAt = null) {
        if (expireAt === null) {
            expireAt = Date.now() + (86400000 * 365);
        }
        this.data[name] = {value : value, expireAt : expireAt};
    }

    get(name, defaultVal = null) {
        if (_.has(this.data, name) && Date.now() <= this.data[name].expireAt) {
            return this.data[name].value;
        }
        return defaultVal;
    }
}

module.exports = Storage;