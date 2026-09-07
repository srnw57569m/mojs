const { sortOrderTypes } = require("../../Constants/WebApiConstants")
const { ItemsSearchResponse, ItemResponse, ItemsResponse } = require("../../Models/ResponseModels/WebApi/ItemsResponses")

class ItemsEndpoint {
    #validator
    #client

    constructor(ctx, client) {
        this.#client = client
        this.#validator = ctx.validator
    }

    async search(itemName, limit, skip = 0) {
        try {
            let queryParams = {}
            this.#validator
                .required(itemName, "itemName")
                .string(itemName, "itemName")
            queryParams.query = itemName

            if (limit) {
                this.#validator
                    .nonNegative(limit, "limit")
                queryParams.limit = limit
            }

            if (skip) {
                this.#validator
                    .nonNegative(skip, "skip")
                queryParams.skip = skip
            }

            const result = await this.#client.get("/items/search", queryParams)
            const nextCaller = (toSkip) => this.search(itemName, limit, toSkip + skip);

            return new ItemsSearchResponse(result, nextCaller)
        } catch (error) {
            let apiError = error?.response?.data
            return new ItemsSearchResponse({ error: apiError ? new Error(apiError) : error })
        }
    }

    async get(itemId) {
        try {
            this.#validator
                .required(itemId, 'itemId')
                .string(itemId, "itemId")

            const result = await this.#client.get(`/items/${itemId}`)
            return new ItemResponse(result)
        } catch (error) {
            let apiError = error?.response?.data
            return new ItemResponse({ error: apiError ? new Error(apiError) : error })
        }
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

            if (params.itemName) {
                this.#validator.string(params.itemName, "params.itemName")
                queryParams.item_name = params.itemName
            }

            if (params.category) {
                this.#validator.string(params.category, "params.category")
                queryParams.category = params.category
            }


            if (params.rarity) {
                this.#validator.string(params.rarity, "params.rarity")
                queryParams.rarity = params.rarity
            }

            if (params.startsAfter) {
                this.#validator.string(params.startsAfter, "params.startsAfter")
                queryParams.starts_after = params.startsAfter
            }
            if (params.endsBefore) {
                this.#validator.string(params.endsBefore, "params.endsBefore")
                queryParams.ends_before = params.endsBefore
            }

            const result = await this.#client.get("/items", queryParams)
            const nextCaller = (lastId) => this.list({ ...params, startsAfter: lastId });

            return new ItemsResponse(result, nextCaller)
        } catch (error) {
            let apiError = error?.response?.data
            return new ItemsResponse({ error: apiError ? new Error(apiError) : error })
        }
    }
}

module.exports = ItemsEndpoint