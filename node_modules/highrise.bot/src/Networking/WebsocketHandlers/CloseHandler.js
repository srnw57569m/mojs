class CloseHandler {
    constructor(ctx, keepaliveHandler, reconnect) {
        this.logger = ctx.logger
        this.state = ctx.state
        this.sender = ctx.sender
        this.reconnect = reconnect
        this.keepaliveHandler = keepaliveHandler
    }

    handle(code, reason) {
        const info = this.state.get("metadata")
        const reasonStr = reason?.toString() || "null"
        const attempts = this.state.get("attempts") ?? 0

        this.logger.warn("Closing...",
            `code: ${code}`,
            `reason: ${reasonStr}`,
            ...(info ? [`connection Id: ${info.connection.id}`] : [])
        )

        this.keepaliveHandler.stop()

        if (this.state.get('doNotReconnect')) {
            this.logger.error('Connection', 'Server requested no reconnect, stopping')
            return
        }

        this.state.set("status", "Offline")

        const delay = Math.min(5000 * 2 ** attempts, 60000) + Math.random() * 1000
        this.state.set("attempts", attempts + 1)

        this.logger.info("Reconnecting...", `${(delay / 1000).toFixed(1)} seconds delay\n`)
        setTimeout(() => this.reconnect(), delay)
    }
}

module.exports = CloseHandler