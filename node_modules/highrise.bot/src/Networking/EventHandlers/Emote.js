const BaseHandler = require("../../Base/BaseHandler");
const { Emote } = require("../../Models/EventModels");

class EmoteHandler extends BaseHandler {
    static type = "EmoteEvent"

    handle(data, emit) {
        const emote = new Emote(data)

        emit('Emote', emote.user, emote.emoteId, emote.receiver)
    }
}

module.exports = EmoteHandler