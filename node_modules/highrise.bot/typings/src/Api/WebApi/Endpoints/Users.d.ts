import UsersResponse from "../../../ResponseModels/WebApi/UsersResponses";

/** Represents the Highrise WebApi `/users` endpoint */
declare class UsersEndpoint {
    /**
     * Fetches data for a specific user from the WebApi
     * @param identifier The user's ID or username
     * @returns A promise that resolves to a {@link UsersResponse} containing the user's data
     */
    get(identifier: string): Promise<UsersResponse>
}

export default UsersEndpoint