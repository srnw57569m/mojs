class ChannelRequest {
    constructor(message, tags) {
        this._type = 'ChannelRequest'
        this.message = message
        this.tags = tags
    }
}

module.exports = { ChannelRequest }