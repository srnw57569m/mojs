const UserResponse = require("../../Models/ResponseModels/WebApi/UsersResponses")

class UsersEndpoint {
    #validator
    #client

    constructor(ctx, client) {
        this.#client = client
        this.#validator = ctx.validator
    }

    async get(identifier) {
        try {
            this.#validator
                .required(identifier, "identifier")
                .string(identifier, "identifier")

            const res = await this.#client.get(`/users/${identifier}`)
            return new UserResponse(res.user)
        } catch (error) {
            let apiError = error?.response?.data
            return new UserResponse({ error: apiError ? new Error(apiError) : error })
        }
    }
}

module.exports = UsersEndpoint