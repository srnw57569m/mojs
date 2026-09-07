const { sortOrderTypes } = require("../../Constants/WebApiConstants")
const { PostsResponse, PostResponse } = require("../../Models/ResponseModels/WebApi/PostsResponses")

class PostsEndpoint {
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

            if (params.authorId) {
                this.#validator.string(params.authorId, "params.authorId")
                queryParams.author_id = params.authorId
            }

            if (params.startsAfter) {
                this.#validator.string(params.startsAfter, "params.startsAfter")
                queryParams.starts_after = params.startsAfter
            }
            if (params.endsBefore) {
                this.#validator.string(params.endsBefore, "params.endsBefore")
                queryParams.ends_before = params.endsBefore
            }

            const result = await this.#client.get('/posts', queryParams)
            const nextCaller = (lastId) => this.list({ ...params, startsAfter: lastId });
            return new PostsResponse(result, nextCaller)
        } catch (error) {
            let apiError = error?.response?.data
            return new PostsResponse({ error: apiError ? new Error(apiError) : error })
        }
    }

    async get(postId) {
        try {
            this.#validator
                .required(postId, "postId")
                .string(postId, "postId")

            const result = await this.#client.get(`/posts/${postId}`)
            return new PostResponse(result)
        } catch (error) {
            let apiError = error?.response?.data
            return new PostResponse({ error: apiError ? new Error(apiError) : error })
        }
    }
}

module.exports = PostsEndpoint