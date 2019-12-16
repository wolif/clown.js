const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');
const Wrapper = require('./Wrapper');
const Result = require('./Result');
const errors = require('./errorCode');

class Jsonrpc extends EventEmitter
{
    constructor(app, loader = null) {
        super();
        this.app = app;
        this.setLoader(loader);
    }

    setLoader(loader) {
        this.loader = loader;
    }

    //important method, can't rename
    respond(requestBody, request, response) {
        let result = null;
        let req = {};
        try {
            req = Wrapper.unpack(requestBody);
        } catch (err) {
            this.emit('error', err);
            return Result.failed(_.has(req, 'id') ? req.id : null, err.message, err.code);
        }

        const self = this;
        if (_.isArray(req)) {
            result = [];
            req.forEach(oneReq => {
                result.push(self.invokeMethod(oneReq, request, response));
            });
        } else {
            result = this.invokeMethod(req, request, response);
        }

        response.setHeader('content-type', 'application/json');
        return Wrapper.pack(result);
    }

    invokeMethod(jsonReq, request, response) {
        try {
            const method = (typeof this.loader === 'function' ? this.loader(jsonReq.method) : null);
            if (typeof method !== 'function') {
                throw new Error(errors.METHOD_NOT_FOUND.message, errors.METHOD_NOT_FOUND.code);
            }
            this.emit('server.beforeMethodExec', method, jsonReq.params);
            const res = method(jsonReq.params, this.app, request, response);
            this.emit('server.afterMethodExec', method, res);
            return Result.success(res, jsonReq.id);
        } catch (err) {
            this.emit('error', err);
            return Result.failed(jsonReq.id, err.message, err.code);
        }
    }
}

module.exports = Jsonrpc;