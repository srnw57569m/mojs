const { sortOrderTypes } = require("../../Constants/WebApiConstants")
const { GrabsResponse, GrabResponse } = require("../../Models/ResponseModels/WebApi/GrabsResponses")

class GrabsEndpoint {
    #validator
    #client

    constructor(ctx, client) {
        this.#client = client
        this.#validator = ctx.validator
    }

    async list(params = {}) {
        try {
            let queryParams = {}
            if (params.limit) {
                this.#validator.positive(params.limit, 'params.limit')
                queryParams.limit = params.limit
            }
            if (params.sortOrder) {
                this.#validator
                    .string(params.sortOrder, "params.sortOrder")
                    .oneOf(params.sortOrder, sortOrderTypes, "params.sortOrder")
                queryParams.sort_order = params.sortOrder
            }

            if (params.title) {
                this.#validator.string(params.title, "params.title")
                queryParams.title = params.title
            }

            if (params.startsAfter) {
                this.#validator.string(params.startsAfter, "params.startsAfter")
                queryParams.starts_after = params.startsAfter
            }
            if (params.endsBefore) {
                this.#validator.string(params.endsBefore, "params.endsBefore")
                queryParams.ends_before = params.endsBefore
            }

            const result = await this.#client.get('/grabs', queryParams)
            const nextCaller = (lastId) => this.list({ ...params, startsAfter: lastId });
            return new GrabsResponse(result, nextCaller)
        } catch (error) {
            let apiError = error?.response?.data
            return new GrabsResponse({ error: apiError ? new Error(apiError) : error })
        }
    }

    async get(grabId) {
        try {
            this.#validator
                .required(grabId, "grabId")
                .string(grabId, "grabId")

            const result = await this.#client.get(`/grabs/${grabId}`)
            return new GrabResponse(result)
        } catch (error) {
            let apiError = error?.response?.data
            return new GrabResponse({ error: apiError ? new Error(apiError) : error })
        }
    }
}

module.exports = GrabsEndpoint