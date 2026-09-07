class OpenHandler {
    constructor(ctx, keepaliveHandler) {
        this.logger = ctx.logger
        this.state = ctx.state
        this.sender = ctx.sender
        this.keepaliveHandler = keepaliveHandler
    }

    async handle() {
        this.logger.info('Connection', "Connected to Highrise Bot Server")
        this.keepaliveHandler.start()

        this.state.set("connectTime", Date.now())
        this.state.set("status", "Online")
    }
}

module.exports = OpenHandler