const BaseHandler = require("../../Base/BaseHandler");
const { Message } = require("../../Models/EventModels");
const { User } = require("../../Models/EventModelComponents");

class ChatHandler extends BaseHandler {  
    static type = "ChatEvent"

    handle(data, emit) {
        if (data.user.id === this.state.get('metadata').botId) return

        const user = new User(data.user.id, data.user.username)
        const message = new Message(data)

        this.await.processAwaiter(this.constructor.type, user, message)
        if (data.whisper) {
            emit('Whisper', user, message)
        } else {
            emit('Chat', user, message)
        }
    }
}

module.exports = ChatHandler