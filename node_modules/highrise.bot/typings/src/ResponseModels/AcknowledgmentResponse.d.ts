/** 
 * Response model for non-return highrise methods containing status and diagnostic info.
 * This is typically used for "fire-and-forget" actions where only a success confirmation is needed.
 */
declare class AcknowledgmentResponse {
    /** Indicates if the request was processed successfully by the server.
     * @type {boolean}
     */
    ok: boolean

    /** The technical error message returned by the websocket or the build process.
     * Is null if the request was successful.
     * @type {string | null}
     */
    error: string | null


    /** Helper method to determine if the response contains an error.
     * @returns {boolean} True if an error is present.
     */
    hasError: () => boolean
}

export default AcknowledgmentResponse