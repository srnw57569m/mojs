const BaseHandler = require("../../Base/BaseHandler");
const { Voice } = require("../../Models/EventModels");

// lonely bitch (server-side deprecated)
class VoiceHandler extends BaseHandler {
    static type = "VoiceEvent"

    handle(data, emit) {
        const voice = new Voice(data)

        emit("Voice", voice.users, voice.seconds_left, voice.ended)
    }
}

module.exports = VoiceHandler