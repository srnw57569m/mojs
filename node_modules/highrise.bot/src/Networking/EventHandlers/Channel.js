const BaseHandler = require("../../Base/BaseHandler");
const { HiddenChannel } = require("../../Models/EventModels");

class ChannelHandler extends BaseHandler {
    static type = "ChannelEvent"
    
    handle(data, emit) {
        const channel = new HiddenChannel(data)

        emit("Channel", channel.sender_id, channel.message, channel.tags)
    }
}

module.exports = ChannelHandler