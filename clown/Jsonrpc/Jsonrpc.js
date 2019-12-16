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

    respond(requestBody, request, response) {
        let result = null;
        let req = {};
        try {
            req = Wrapper.decode(requestBody);
        } catch (err) {
            this.emit('error', err);
            return Result.failed(_.has(req, 'id') ? req.id : null, err.message, err.code);
        }

        const self = this;
        if (_.isArray(req)) {
            result = [];
            req.forEach(request => {
                result.push(self.run(request));
            });
        } else {
            result = this.run(req);
        }

        response.setHeader('content-type', 'application/json');
        return JSON.stringify(result);
    }

    run(request) {
        try {
            const method = (typeof this.loader === 'function' ? this.loader(request.method) : null);
            if (typeof method !== 'function') {
                throw new Error(errors.METHOD_NOT_FOUND.message, errors.METHOD_NOT_FOUND.code);
            }
            this.emit('server.beforeMethodExec', method, request.params);
            const res = method(request.params, this.app);
            this.emit('server.afterMethodExec', method, res);
            return Result.success(res, request.id);
        } catch (err) {
            this.emit('error', err);
            return Result.failed(request.id, err.message, err.code);
        }
    }
}

module.exports = Jsonrpc;