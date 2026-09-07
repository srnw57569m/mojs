const { GetRoomUsersResponse } = require("../../Models/ResponseModels/RoomResponses")
const { GetRoomUsersRequest } = require("../../Models/RequestModels/RoomRequests");
const BaseRequest = require("../../Base/BaseRequest")

class Users extends BaseRequest {
    async get() {
        try {
            const result = await this.request(new GetRoomUsersRequest())
            return new GetRoomUsersResponse(result.data)
        } catch (error) {
            return new GetRoomUsersResponse({ error })
        }
    }

    async username(userId) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")

            const result = await this.get()
            return result.username(userId)
        } catch (error) {
            return new GetRoomUsersResponse({ error })
        }
    }

    async userId(username) {
        try {
            this.validator
                .required(username, "username")
                .string(username, "username")

            const result = await this.get()
            return result.userId(username)
        } catch (error) {
            return new GetRoomUsersResponse({ error })
        }
    }

    async position(identifier) {
        try {
            this.validator
                .required(identifier, "identifier")
                .string(identifier, "identifier")

            const result = await this.get()
            return result.position(identifier)
        } catch (error) {
            return new GetRoomUsersResponse({ error })
        }
    }

    async find(identifier) {
        try {
            this.validator
                .required(identifier, "identifier")
                .string(identifier, "identifier")

            const result = await this.get()
            return result.find(identifier)
        } catch (error) {
            return new GetRoomUsersResponse({ error })
        }
    }

    async has(identifier) {
        try {
            this.validator
                .required(identifier, "identifier")
                .string(identifier, "identifier")

            const result = await this.get()
            return result.has(identifier)
        } catch (error) {
            return new GetRoomUsersResponse({ error })
        }
    }

    async count() {
        try {
            const result = await this.get()
            return result.count()
        } catch (error) {
            return 0
        }
    }
}

module.exports = Users