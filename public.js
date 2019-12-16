const Application = require('./clown/Application');
const Jsonrpc = require('./clown/Jsonrpc/Jsonrpc');
const fs = require('fs');
const _ = require('lodash');

let app = new Application('./.env');

const jsonrpc = new Jsonrpc(app, (inputMethod) => {
    const [service, method] = inputMethod.split('.');
    if (fs.existsSync(`./service/${service}.js`)) {
        const o = require(`./service/${service}`);
        if (_.has(o, method) && typeof o[method] === 'function') {
            return o[method];
        }
    }
    return null;
});
jsonrpc.on('error', err => {
    console.log(err);
});

app.setProtocol(jsonrpc).run();
