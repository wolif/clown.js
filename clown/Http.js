const http = require('http');
const EventEmitter = require('events').EventEmitter;

class Http extends EventEmitter
{
    constructor(application) {
        super();
        this.app = application;
    }

    listen (listener = null) {
        const self = this;
        const server = http.createServer(function(request, response) {
            self.app.request = request;
            self.app.response = response;

            let requestBody = '';
            request.on('data', function (chunk) {
                requestBody += chunk;
            });

            request.on('end', function () {
                self.emit('data', requestBody);
                const res = self.app.protocol.respond(requestBody, request, response);
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
        server.listen(this.app.env.port || 80, this.app.env.host || '127.0.0.1', listener);
    }
}

module.exports = Http;