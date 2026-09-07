const BaseRequest = require("../../Base/BaseRequest");
const { CheckVoiceChatRequest, InviteSpeakerRequest, RemoveSpeakerRequest } = require("../../Models/RequestModels/RoomRequests");
const { CheckVoiceChatResponse } = require("../../Models/ResponseModels/RoomResponses");
const AcknowledgmentResponse = require("../../Models/ResponseModels/AcknowledgmentResponse");

class Voice extends BaseRequest {
    async check() {
        try {
            const result = await this.request(new CheckVoiceChatRequest())
            return new CheckVoiceChatResponse(result.data)
        } catch (error) {
            return new CheckVoiceChatResponse({ error })
        }
    }

    async invite(userId) {
        try {
            this.validator
                .required(userId, 'userId')
                .string(userId, 'userId')

            await this.request(new InviteSpeakerRequest(userId))
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async remove(userId) {
        try {
            this.validator
                .required(userId, 'userId')
                .string(userId, 'userId')

            await this.request(new RemoveSpeakerRequest(userId))
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }
}

module.exports = Voice