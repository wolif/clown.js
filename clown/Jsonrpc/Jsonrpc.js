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

    //important method, don't rename
    respond(requestBody, request, response) {
        response.setHeader('content-type', 'application/json');

        let result = null;
        let req = {};

        try {
            req = Wrapper.unpack(requestBody);
        } catch (err) {
            this.emit('error', err);
            return Wrapper.pack(Result.failed(_.has(req, 'id') ? req.id : null, err.message, err.code));
        }

        const self = this;
        if (_.isArray(req)) {
            result = [];
            req.forEach(jsonrpcReq => {
                result.push(self.invokeMethod(jsonrpcReq));
            });
        } else {
            result = this.invokeMethod(req);
        }

        return Wrapper.pack(result);
    }

    invokeMethod(jsonrpcReq) {
        try {
            const method = (typeof this.loader === 'function' ? this.loader(jsonrpcReq.method) : null);
            if (typeof method !== 'function') {
                throw new Error(errors.METHOD_NOT_FOUND.message, errors.METHOD_NOT_FOUND.code);
            }
            this.emit('server.beforeMethodExec', method, jsonrpcReq.params);
            const res = method(...jsonrpcReq.params);
            this.emit('server.afterMethodExec', method, res);
            return Result.success(res, jsonrpcReq.id);
        } catch (err) {
            this.emit('error', err);
            return Result.failed(jsonrpcReq.id, err.message, err.code);
        }
    }
}

module.exports = Jsonrpc;