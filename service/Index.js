
module.exports = {
    test: function(params, app) {
        return {
            input: params,
            config: app.env
        };
    }
};