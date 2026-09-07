class BaseHandler {
    static type = null

    constructor(ctx) {
        this.logger = ctx.logger
        this.state = ctx.state
        this.await = ctx.await
    }

    /**
     * optional override
     */ 
    async beforeHandle(raw, ...args) { }

    async handle(raw, emit) {
        throw new Error(`${this.constructor.name} must implement handle()`)
    }

    /**
     * optional override
     */ 
    async afterHandle(raw, ...args) { }

    /**
     * do not override!! (will get cancer if you did)
     */
    async execute(raw, emit) {
        await this.beforeHandle(raw, emit)
        await this.handle(raw, emit)
        await this.afterHandle(raw, emit)
    }
}

module.exports = BaseHandler