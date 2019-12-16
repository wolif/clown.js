const EventEmitter = require("events").EventEmitter;
const AppError = require('../AppError');
const _ = require('lodash');
const errors = require('./errorCode');

class Wrapper extends EventEmitter
{
    constructor() {
        super();
    }

    checkElements(req) {
        if (!_.has(req, 'jsonrpc')) {
            req.jsonrpc = '2.0';
        }
        if (!_.has(req, 'method') || req.method === '') {
            throw new AppError(errors.INVALID_REQUEST.message, errors.INVALID_REQUEST.code);
        }
        if (!_.has(req, 'params') || !_.isArray(req.params)) {
            throw new AppError(errors.INVALID_REQUEST.message, errors.INVALID_REQUEST.code);
        }
    }

    unpack(reqText) {
        let ret = {};
        try {
            ret = JSON.parse(reqText);
        } catch (error) {
            throw new AppError(errors.PARSE_ERROR.message, errors.PARSE_ERROR.code);
        }
        if (_.isArray(ret)) {
            ret.forEach(req => {
                this.checkElements(req);
            });
        } else {
            this.checkElements(ret);
        }
        return ret;
    }

    pack(resp) {
        return JSON.stringify(resp);
    }
}

module.exports = new Wrapper();