import { RoomResponse, RoomsResponse } from "../../../ResponseModels/WebApi/RoomsResponses";

interface GetRoomsParams {
    /** Maximum number of rooms to return */
    limit?: number;
    /** Order of results (e.g. `"asc"` | `"desc"`) */
    sortOrder?: "asc" | "desc"
    /** Filter rooms by name */
    roomName?: string;
    /** Filter rooms by owner ID */
    ownerId?: string;
    /** Return rooms created after this roomId (pagination) */
    startsAfter?: string;
    /** Return rooms created before this roomId (pagination) */
    endsBefore?: string;
}

/** Represents the Highrise WebApi `/rooms` endpoint */
declare class RoomsEndpoint {
    /**
     * Fetches data for a specific room from the WebApi
     * @param roomId The room ID to fetch
     * @returns A promise that resolves to a {@link RoomResponse} containing the room's data
     * @example
     * ```javascript
     * const res = await bot.webapi.rooms.get(bot.credential.roomId)
     * console.log(res)
     * ```
     */
    get(roomId: string): Promise<RoomResponse>

    /**
     * Fetches a filtered list of rooms from the WebApi.
     * 
     * @param params WebApi filtering options. Defaults to 20 rooms in descending order if not provided.
     * @returns A promise that resolves to a {@link RoomsResponse} containing the rooms data and pagination method.
     * @example
     * ```javascript
     * // no parameters passed, returns 20 rooms in descending order
     * const res = await bot.webapi.rooms.list()
     * console.log(res)
     * ```
     * @example
     * ```javascript
     * // only return 5 rooms
     * const res = await bot.webapi.rooms.list({ limit: 5 })
     * console.log(res)
     * ```
     */
    list(params: GetRoomsParams): Promise<RoomsResponse>

}

export default RoomsEndpoint