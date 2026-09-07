const BaseHandler = require("../../Base/BaseHandler");
const { User } = require("../../Models/EventModelComponents");

class UserLeftHandler extends BaseHandler {
    static type = "UserLeftEvent"

    handle(data, emit) {
        const user = new User(data.user.id, data.user.username)

        emit("UserLeft", user)
    }
}

module.exports = UserLeftHandler