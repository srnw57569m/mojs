const BaseRequest = require("../../../Base/BaseRequest")
const { SendMessageRequest, SendInviteRequest } = require("../../../Models/RequestModels/DirectRequests")
const AcknowledgmentResponse = require("../../../Models/ResponseModels/AcknowledgmentResponse")

class Actions extends BaseRequest {

    async send(convId, message) {
        try {
            this.validator
                .required(convId, "convId")
                .string(convId, "convId")
                .required(message, "message")
                .string(message, "message")


            if (message.length > 2000) {
                let failed = 0
                const parts = this.utils.splitMessages(message, 2000)
                for (const part of parts) {
                    try {
                        await this.request(new SendMessageRequest(convId, part))
                    } catch {
                        failed++
                    }
                }

                if (failed) this.logger.warn(`Direct`, `${failed}/${parts.length} message parts failed to send`)

                if (failed === parts.length) {
                    return new AcknowledgmentResponse({ error: new Error('All message parts failed to send in bot.direct.send()') })
                }

                return new AcknowledgmentResponse()
            }

            await this.request(new SendMessageRequest(convId, message))
            return new AcknowledgmentResponse()

        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async broadcast(userIds, message) {
        try {
            this.validator
                .required(userIds, "userIds")
                .nonEmptyArray(userIds, "userIds")
                .required(message, "message")
                .string(message, "message")

            await this.request(new SendMessageRequest(userIds, message, true))
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async inviteRoom(convId, roomId) {
        try {
            this.validator
                .required(convId, "convId")
                .string(convId, "convId")
                .required(roomId, "roomId")
                .string(roomId, "roomId")

            await this.request(new SendInviteRequest(convId, roomId))
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async inviteWorld(convId, worldId) {
        try {
            this.validator
                .required(convId, "convId")
                .string(convId, "convId")
                .required(worldId, "worldId")
                .string(worldId, "worldId")

            await this.request(new SendInviteRequest(convId, null, worldId))
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async broadcastInvite(userIds, inviteDetails) {
        try {
            this.validator
                .required(userIds, "userIds")
                .nonEmptyArray(userIds, "userIds")
                .required(inviteDetails, "inviteDetails")
                .object(inviteDetails, "inviteDetails")

            const { roomId, worldId } = inviteDetails;

            if (worldId && roomId) {
                throw new Error(`Provide either roomId or worldId, but not both.`);
            }

            if (worldId) this.validator.string(worldId, "worldId");
            if (roomId) this.validator.string(roomId, "roomId");

            await this.request(new SendInviteRequest(userIds, roomId, worldId, true));
            return new AcknowledgmentResponse();
        } catch (error) {
            return new AcknowledgmentResponse({ error });
        }
    }
}

module.exports = Actions