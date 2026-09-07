const BaseRequest = require("../../../Base/BaseRequest");
const { GetMessagesRequest } = require("../../../Models/RequestModels/DirectRequests");
const { GetMessagesResponse } = require("../../../Models/ResponseModels/DirectResponses");

class Messages extends BaseRequest {
    async list(convId, lastMessageId = null) {
        try {
            this.validator
                .required(convId, "convId")
                .string(convId, "convId")
            if (lastMessageId) this.validator.string(lastMessageId, "lastMessageId");

            const result = await this.request(new GetMessagesRequest(convId, lastMessageId))
            const nextCaller = (lastMessageId) => this.list(convId, lastMessageId);

            return new GetMessagesResponse(result.data, nextCaller);
        } catch (error) {
            return new GetMessagesResponse({ error })
        }
    }
}

module.exports = Messages