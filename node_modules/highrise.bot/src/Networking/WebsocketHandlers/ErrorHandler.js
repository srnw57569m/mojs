const { ErrorMessages } = require('../../Constants/ErrorConstants')

class ErrorHandler {
    constructor(ctx) {
        this.logger = ctx.logger
    }

    handle(error) {
        const message = this.#resolveMessage(error)
        this.logger.error("Websocket", message)
    }

    #resolveMessage(error) {
        switch (error.code) {
            case 'ECONNREFUSED':
                return ErrorMessages.CONNECTION.FAILED
            case 'ECONNRESET':
                return ErrorMessages.CONNECTION.LOST
            case 'ETIMEDOUT':
                return ErrorMessages.CONNECTION.TIMEOUT
            default:
                return error.message
        }
    }
}

module.exports = ErrorHandler