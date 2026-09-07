const Moderation = require("./Moderation");
const Actions = require("./Actions");
const Outfit = require("./Outfit");

class PlayerApi {
    #actions
    constructor(ctx, utils) {
        this.outfit = new Outfit(ctx)
        this.moderation = new Moderation(ctx)
        this.#actions = new Actions(ctx, utils)
    }

    async walk(x, y, z, facing) {
        return await this.#actions.walk(x, y, z, facing)
    }

    async sit(entity_id, anchor_ix) {
        return await this.#actions.sit(entity_id, anchor_ix)
    }

    async teleport(user_id, x, y, z, facing) {
        return await this.#actions.teleport(user_id, x, y, z, facing)
    }

    async emote(emoteId, userId) {
        return await this.#actions.emote(emoteId, userId)
    }

    async transport(userId, roomId) {
        return await this.#actions.transport(userId, roomId)
    }

    async react(userId, reaction) {
        return await this.#actions.react(userId, reaction)
    }

    async tip(userId, gold_bar) {
        return await this.#actions.tip(userId, gold_bar)
    }

    async splitTip(userId, amount, delay) {
        return await this.#actions.splitTip(userId, amount, delay)
    }
}

module.exports = PlayerApi