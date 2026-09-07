/**
 * Core response model for all Highrise API interactions.
 * Provides a standardized structure for handling success, errors, and system diagnostics.
 */
declare class BaseResponse {
    /**
     * Indicates whether the request was processed successfully.
     */
    ok: boolean;

    /**
     * The technical error message if the request failed; null if successful.
     */
    error: string | null;

    /**
     * Determines if the response indicates a failure state.
     * @returns True if an error is present, false otherwise.
     */
    hasError(): boolean;
}

export { BaseResponse };
export default BaseResponse;