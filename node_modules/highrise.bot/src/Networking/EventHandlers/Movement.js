const BaseHandler = require("../../Base/BaseHandler");
const { Position, AnchorPosition } = require("../../Models/EventModels");
const { User } = require("../../Models/EventModelComponents");

class MovementHandler extends BaseHandler {
    static type = "UserMovedEvent"

    handle(data, emit) {
        const user = new User(data.user.id, data.user.username)
        
        if ("x" in data.position) {
            const position = new Position(data)
            this.await.processAwaiter(this.constructor.type, user, position, null)
            emit("Movement", user, position, null)
        } else {
            const anchor = new AnchorPosition(data)
            this.await.processAwaiter(this.constructor.type, user, null, anchor)
            emit("Movement", user, null, anchor)
        }
    }
}

module.exports = MovementHandler