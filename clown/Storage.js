const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');

class Storage extends EventEmitter
{
    constructor() {
        super();
        this.data = {};
    }

    set(name, value, expireAt = null) {
        this.data[name] = {value : value, expireAt : expireAt};
    }

    get(name, defaultVal = null) {
        if (_.has(this.data, name)) {
            if (Date.now() / 1000 <= this.data[name].expireAt) {
                return this.data[name].value;
            } else {
                delete this.data[name];
            }

            if (this.data[name].expireAt === null) {
                return this.data[name].value;
            }
        }
        return defaultVal;
    }
}

module.exports = Storage;