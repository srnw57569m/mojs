const BaseHandler = require("../../Base/BaseHandler");
const { Sender, Receiver, Item } = require("../../Models/EventModelComponents");

class TipHandler extends BaseHandler {
    static type = "TipReactionEvent"

    handle(data, emit) {
        const sender = new Sender(data.sender.id, data.sender.username)
        const receiver = new Receiver(data.receiver.id, data.receiver.username)
        const item = new Item(data)

        this.await.processAwaiter(this.constructor.type, sender, receiver, item)
        emit("Tip", sender, receiver, item)
    }
}

module.exports = TipHandler