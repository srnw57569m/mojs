import { PostResponse, PostsResponse } from "../../../ResponseModels/WebApi/PostsResponses";

interface GetPostsParams {
    /** Maximum number of posts to return */
    limit?: number;
    /** Order of results (e.g. `"asc"` | `"desc"`) */
    sortOrder?: "asc" | "desc"
    /** Filter posts by author ID */
    authorId?: string;
    /** Return posts created after this postId (pagination) */
    startsAfter?: string;
    /** Return posts created before this postId (pagination) */
    endsBefore?: string;
}

/** Represents the Highrise WebApi `/posts` endpoint */
declare class PostsEndpoint {
    /**
     * Fetches a filtered list of posts from the WebApi.
     * @param params WebApi filtering options.
     * @note expect some errors like getting `Unable to fetch posts.` error.
     * 
     * @returns A promise that resolves to a {@link PostsResponse} containing the posts data and pagination method.
     */
    list(params: GetPostsParams): Promise<PostsResponse>

    /**
     * Fetches data for a specific post from the WebApi
     * @param postId The post ID to fetch
     * @note expect some errors like getting `500 Internal Server` error.
     * @returns A promise that resolves to a {@link PostResponse} containing the post's data
     * @example
     * ```javascript
     * const res = await bot.webapi.posts.get("postId")
     * console.log(res)
     * ```
     */
    get(postId: string): Promise<PostResponse>
}

export default PostsEndpoint