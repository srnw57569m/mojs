const { ModerateRoomRequest } = require("../../Models/RequestModels/PlayerRequests");
const AcknowledgmentResponse = require("../../Models/ResponseModels/AcknowledgmentResponse");
const BaseRequest = require("../../Base/BaseRequest");

class Moderation extends BaseRequest {
    async #performAction(targetId, type, duration = null) {
        try {
            await this.request(new ModerateRoomRequest(targetId, type, duration))
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async kick(userId) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")

            return await this.#performAction(userId, "kick")
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async mute(userId, duration) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")
                .required(duration, "duration")
                .positive(duration, "duration")
                .range(duration, 60, Infinity, "duration")

            return await this.#performAction(userId, "mute", duration)
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async ban(userId, duration) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")
                .required(duration, "duration")
                .positive(duration, "duration")

            return await this.#performAction(userId, "ban", duration)
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async unmute(userId) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")

            return await this.#performAction(userId, "mute", 1)
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async unban(userId) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")

            return await this.#performAction(userId, "unban")
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }
}

module.exports = Moderation