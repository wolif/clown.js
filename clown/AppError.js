
class AppError extends Error
{
    constructor(message = 'server error!', code = 32601) {
        super(message);
        this.code = code;
    }
}

module.exports = AppError;