const { sortOrderTypes } = require("../../Constants/WebApiConstants");
const { RoomResponse, RoomsResponse } = require("../../Models/ResponseModels/WebApi/RoomsResponses")

class RoomsEndpoint {
    #validator
    #client

    constructor(ctx, client) {
        this.#client = client
        this.#validator = ctx.validator
    }

    async get(roomId) {
        try {
            this.#validator
                .required(roomId, "roomId")
                .string(roomId, "roomId")

            const result = await this.#client.get(`/rooms/${roomId}`)
            return new RoomResponse(result.room)
        } catch (error) {
            let apiError = error?.response?.data
            return new RoomResponse({ error: apiError ? new Error(apiError) : error })
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

            if (params.roomName) {
                this.#validator.string(params.roomName, "params.roomName")
                queryParams.room_name = params.roomName
            }

            if (params.ownerId) {
                this.#validator.string(params.ownerId, "params.ownerId")
                queryParams.owner_id = params.ownerId
            }

            if (params.startsAfter) {
                this.#validator.string(params.startsAfter, "params.startsAfter")
                queryParams.starts_after = params.startsAfter
            }
            if (params.endsBefore) {
                this.#validator.string(params.endsBefore, "params.endsBefore")
                queryParams.ends_before = params.endsBefore
            }

            const result = await this.#client.get("/rooms", queryParams)
            const nextCaller = (lastId) => this.list({ ...params, startsAfter: lastId });
            return new RoomsResponse(result, nextCaller)
        } catch (error) {
            let apiError = error?.response?.data
            return new RoomsResponse({ error: apiError ? new Error(apiError) : error })
        }
    }

    async byOwnerId(ownerId, limit) {
        return await this.list({ ownerId, limit })
    }

    async byRoomName(roomName, limit) {
        return await this.list({ roomName, limit })
    }
}

module.exports = RoomsEndpoint