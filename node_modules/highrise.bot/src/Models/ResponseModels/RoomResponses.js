const { Position } = require("../../Models/EventModels")
const { User } = require("../../Models/EventModelComponents")
const BaseResponse = require("../../Base/BaseResponse")

class GetRoomUsersResponse extends BaseResponse {
    build(data) {
        this.users = data.content.map(([user, position]) => ({
            user: new User(user.id, user.username),
            position: new Position({ position })
        }))
    }

    find(identifier) {
        return this.users.find(u =>
            u.user.id === identifier ||
            u.user.username.toLowerCase() === identifier.toLowerCase()
        ) || null
    }

    has(identifier) {
        return this.users.some(u =>
            u.user.id === identifier ||
            u.user.username.toLowerCase() === identifier.toLowerCase()
        )
    }

    username(userId) {
        return this.users.find(u => u.user.id === userId)?.user.username || null
    }

    userId(username) {
        return this.users.find(u => u.user.username.toLowerCase() === username.toLowerCase())?.user.id || null
    }

    position(identifier) {
        const user = this.users.find(u =>
            u.user.id === identifier ||
            u.user.username.toLowerCase() === identifier.toLowerCase()
        )
        return user?.position || null
    }

    count() {
        return this.users.length
    }
}

class CheckVoiceChatResponse extends BaseResponse {
    build(data) {
        this.secondsLeft = data.seconds_left
        this.speakers = data.auto_speakers
    }
}

class GetRoomPrivilegeResponse extends BaseResponse {
    build(data) {
        this.moderator = data.content.moderator
        this.designer = data.content.designer
    }
}

module.exports = {
    GetRoomUsersResponse,
    CheckVoiceChatResponse,
    GetRoomPrivilegeResponse
}