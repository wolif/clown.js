const EventEmitter = require('events').EventEmitter;
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

    setTransport(transport) {
        this.transport = transport;
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
        this.transport.listen(listener);
    }

}

module.exports = Application;