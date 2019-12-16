
class AppError extends Error
{
    constructor(message = '', code = 0) {
        super(message);
        this.code = code;
    }
}

module.exports = AppError;