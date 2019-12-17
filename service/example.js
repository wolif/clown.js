const AppError = require('../clown/AppError');
const app = require('../public');
const moment = require('moment');

module.exports = {
    test: function(params) {
        // throw new AppError();
        const date = Date.now();
        return {
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            input: params,
            config: app.env,
            headers: app.request.headers
        };
    },
    
    // params [app, request, response] can be omitted
    test1: function(params) {
        return {
            input: params
        };
    }
};