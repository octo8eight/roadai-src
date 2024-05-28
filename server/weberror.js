
// Error class with status and message
class WebError extends Error {
    constructor(status, message, ...args) {
        super(status, message, ...args);
        this.status = status;
        this.message = message;
    }
}

module.exports = { WebError };