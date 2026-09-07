class HandlerRegistry {
    constructor() {
        this.handlers = new Map()
    }

    register(HandlerClass, ctx, ...args) {
        if (!HandlerClass.type) {
            throw new Error(`${HandlerClass.name} is missing a static type`)
        }

        this.handlers.set(HandlerClass.type, new HandlerClass(ctx, ...args))
        return this
    }

    async dispatch(type, data, emit, logger) {
        const handler = this.handlers.get(type)
        if (!handler) {
            logger.warn("MessageHandler", `unhandled event type: ${type}`)
            return
        }

        try {
            await handler.execute(data, emit)
        } catch (error) {
            logger.error(`HandlerRegistry: "${type}"`, error.message, error.stack)
        }
    }
}

module.exports = HandlerRegistry