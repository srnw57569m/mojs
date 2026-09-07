const BaseRequest = require("../../Base/BaseRequest");
const { GetRoomPrivilegeRequest } = require("../../Models/RequestModels/RoomRequests");
const { GetRoomPrivilegeResponse } = require("../../Models/ResponseModels/RoomResponses");

class Privilege extends BaseRequest {
    async get(userId) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")

            const result = await this.request(new GetRoomPrivilegeRequest(userId))
            return new GetRoomPrivilegeResponse(result.data)
        } catch (error) {
            return new GetRoomPrivilegeResponse({ error })
        }
    }

    async isModerator(userId) {
        const result = await this.get(userId)
        if (result.hasError()) return { value: false, error: result.error }

        return { value: result.moderator === true, error: null }
    }

    async isDesigner(userId) {
        const result = await this.get(userId)
        if (result.hasError()) return { value: false, error: result.error }
        
        return { value: result.designer === true, error: null }
    }
}

module.exports = Privilege