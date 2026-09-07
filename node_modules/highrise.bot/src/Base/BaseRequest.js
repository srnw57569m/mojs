class BaseRequest {
    
    constructor(ctx, utils) {
        this.ctx = ctx
        this.logger = ctx.logger
        this.state = ctx.state
        this.validator = ctx.validator
        this.sender = ctx.sender
        this.utils = utils
    }

    request(RequestModel) {
        return this.sender.request(RequestModel)
    }
}

module.exports = BaseRequest