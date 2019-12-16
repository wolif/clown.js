const EventEmitter = require('events').EventEmitter;
const http = require('http');
const ENV = require('./envLoader');

class Application extends EventEmitter
{
    constructor (envFile = '.env') {
        super();
        ENV.load(envFile);
        this.env = ENV.get();
    }

    setProtocol(protocol) {
        this.protocol = protocol;
        return this;
    }

    setup (name, component) {
        if (typeof component === 'function') {
            this[name] = component(this);
        } else {
            this[name] = component;
        }
        this.emit('setup', name, component);
        return this;
    }

    run (listener = null) {
        const self = this;
        const server = http.createServer(function(request, response) {
            let requestBody = '';
            request.on('data', function (chunk) {
                requestBody += chunk;
            });

            request.on('end', function () {
                self.emit('data', requestBody);
                const res = self.protocol.respond(requestBody, request, response, self);
                response.setHeader('content-length', res.length ? res.length : 0);
                response.end(res);
            });

        });
        server.on('close', function () {
            self.emit('close');
        });
        server.on('error', function () {
            self.emit('error', self);
        });

        //running http server
        server.listen(this.env.port || 80, this.env.host || '127.0.0.1', listener);
    }

}

module.exports = Application;