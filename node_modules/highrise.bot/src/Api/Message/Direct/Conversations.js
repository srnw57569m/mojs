const { GetConversationsResponse } = require("../../../Models/ResponseModels/DirectResponses");
const { GetConversationsRequest, LeaveConversationRequest } = require("../../../Models/RequestModels/DirectRequests");
const AcknowledgmentResponse = require("../../../Models/ResponseModels/AcknowledgmentResponse");
const BaseRequest = require("../../../Base/BaseRequest");

class Conversations extends BaseRequest {
    async list(lastId = null, notJoined = false) {
        try {
            if (lastId) this.validator.string(lastId, "lastId");
            this.validator.boolean(notJoined, "notJoined");

            const result = await this.request(new GetConversationsRequest(lastId, notJoined))
            const nextCaller = (newLastId) => this.list(newLastId, notJoined);

            return new GetConversationsResponse(result.data, nextCaller);
        } catch (error) {
            return new GetConversationsResponse({ error })
        }
    }

    async leave(convId) {
        try {
            this.validator
                .required(convId, "convId")
                .string(convId, "convId")

            await this.request(new LeaveConversationRequest(convId))
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }
}

module.exports = Conversations