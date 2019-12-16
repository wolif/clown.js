module.exports = {
    PARSE_ERROR     : {code:32700, message:'invalid json, syntax error!'},
    INVALID_REQUEST : {code:32600, message:'invalid request object with the sent json!'},
    METHOD_NOT_FOUND: {code:32601, message:'method not found!'},
    INVALID_PARAMS  : {code:32602, message:'invalid params!'},
    INTERNAL_ERROR  : {code:32603, message:'server internal error!'},
    SERVER_ERROR    : {code:32000, message:'server error!'}
};