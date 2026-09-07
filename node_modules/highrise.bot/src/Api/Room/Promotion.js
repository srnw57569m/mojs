const BaseRequest = require("../../Base/BaseRequest");
const AcknowledgmentResponse = require("../../Models/ResponseModels/AcknowledgmentResponse");
const { ChangeRoomPrivilegeRequest } = require("../../Models/RequestModels/RoomRequests");

class PrivilegeBase extends BaseRequest {
    #type

    constructor(ctx, utils, type) {
        super(ctx, utils)
        this.#type = type
    }

    async add(userId) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")

            await this.request(new ChangeRoomPrivilegeRequest(userId, { [this.#type]: true }))
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async remove(userId) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")

            await this.request(new ChangeRoomPrivilegeRequest(userId, { [this.#type]: false }))
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }
}

class ModeratorPrivilege extends PrivilegeBase {
    constructor(ctx, utils) {
        super(ctx, utils, 'moderator')
    }
}

class DesignerPrivilege extends PrivilegeBase {
    constructor(ctx, utils) {
        super(ctx, utils, 'designer')
    }
}

module.exports = { DesignerPrivilege, ModeratorPrivilege }