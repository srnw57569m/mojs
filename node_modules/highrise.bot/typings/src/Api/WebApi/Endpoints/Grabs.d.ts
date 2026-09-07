import { GrabResponse, GrabsResponse } from "../../../ResponseModels/WebApi/GrabsResponses"

interface ListGrabsParams {
    /** Maximum number of grabs to return */
    limit?: number
    /** Order of results (e.g. `"asc"` | `"desc"`) */
    sortOrder?: string
    /** Filter grabs by title */
    title?: string
    /** Return grabs starting after this grabId */
    startsAfter?: string
    /** Return grabs ending before this grabId */
    endsBefore?: string
}

/** Represents the Highrise WebApi `/grabs` endpoint */
declare class GrabsEndpoint {
    /**
     * Retrieve a list of grabs from the WebApi.
     * @param params WebApi filtering options.
     * @note expect some errors like getting `500 Internal Server` error.

     * @returns A promise that resolves to a {@link GrabsResponse} containing the grabs data and pagination method.
     */
    list(params?: ListGrabsParams): Promise<GrabsResponse>

    /**
     * Retrieve a single grab from the WebApi.
     * @param grabId The unique identifier of the grab.
     * @note expect some errors like getting `500 Internal Server` error.

     * @returns A promise that resolves to a {@link GrabResponse} containing the grab data.
     */
    get(grabId: string): Promise<GrabResponse>
}

export default GrabsEndpoint