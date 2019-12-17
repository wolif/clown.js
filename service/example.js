const AppError = require('../clown/AppError');
const app = require('../public');

module.exports = {
    test: function(params) {
        // throw new AppError();
        return {
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