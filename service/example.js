const AppError = require('../clown/AppError');

module.exports = {
    test: function(params, app, request, response) {
        throw new AppError();
        return {
            input: params,
            config: app.env
        };
    },
    
    // params [app, request, response] can be omitted
    test1: function(params) {
        return {
            input: params
        };
    }
};