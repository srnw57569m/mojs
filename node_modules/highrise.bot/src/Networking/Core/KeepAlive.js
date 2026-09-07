const { KeepaliveRequest } = require("../../Models/RequestModels/WebsocketRequests");

class KeepAliveHandler {
    constructor(ctx) {
        this.sender = ctx.sender
        this.intervalId = null
        this.bufferKeepalive = Buffer.from(JSON.stringify(new KeepaliveRequest()))
    }

    start() {
        this.intervalId = setInterval(() => {
            this.sender.raw_request(this.bufferKeepalive)
        }, 15 * 1000);
    }

    stop() {
        clearInterval(this.intervalId)
    }
}

module.exports = KeepAliveHandler