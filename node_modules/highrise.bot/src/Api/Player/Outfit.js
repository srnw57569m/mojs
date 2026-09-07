const BaseRequest = require("../../Base/BaseRequest");
const { GetUserOutfitResponse } = require("../../Models/ResponseModels/PlayerResponses");
const { GetUserOutfitRequest } = require("../../Models/RequestModels/PlayerRequests");

class Outfit extends BaseRequest {
    async get(userId) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")

            const result = await this.request(new GetUserOutfitRequest(userId))
            return new GetUserOutfitResponse(result.data)
        } catch (error) {
            return new GetUserOutfitResponse({ error })
        }
    }
}

module.exports = Outfit