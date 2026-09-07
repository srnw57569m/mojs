const BaseRequest = require("../../Base/BaseRequest");
const { ChannelRequest } = require("../../Models/RequestModels/ChannelRequests");
const AcknowledgmentResponse = require("../../Models/ResponseModels/AcknowledgmentResponse");

class ChannelApi extends BaseRequest {
    async send(message, tags = null) {
        try {
            this.validator
                .required(message, "message")
                .string(message, "message")
                
            if (tags) {
                this.validator.nonEmptyArray(tags, 'tags')
            }

            await this.request(new ChannelRequest(message, tags))
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }
}

module.exports = ChannelApi