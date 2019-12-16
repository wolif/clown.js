const errors = require('./errorCode');

class Result
{
    constructor() {
        this.result = {};
    }

    success(data = null, id = null) {
        return {
            jsonrpc : '2.0',
            result : data,
            id : id
        };
    }

    failed(id = null, message = errors.INTERNAL_ERROR.message, code = errors.INTERNAL_ERROR.code) {
        return {
            jsonrpc : '2.0',
            error : {
                code : code,
                message : message
            },
            id : id
        };
    }
}

module.exports = new Result();