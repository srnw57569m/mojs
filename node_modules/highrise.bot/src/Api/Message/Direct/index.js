const Actions = require("./Actions");
const Conversations = require("./Conversations");
const Messages = require("./Messages");

class DirectApi {
    #actions

    constructor(ctx, utils) {
        this.#actions = new Actions(ctx, utils)
        this.conversations = new Conversations(ctx, utils)
        this.messages = new Messages(ctx, utils)
    }

    async send(convId, message) {
        return this.#actions.send(convId, message)
    }

    async broadcast(userIds, message) {
        return this.#actions.broadcast(userIds, message)
    }

    async broadcastInvite(userIds, inviteDetails) {
        return this.#actions.broadcastInvite(userIds, inviteDetails)
    }

    async inviteRoom(convId, roomId) {
        return this.#actions.inviteRoom(convId, roomId)
    }

    async inviteWorld(convId, worldId) {
        return this.#actions.inviteWorld(convId, worldId)
    }
}

module.exports = DirectApi