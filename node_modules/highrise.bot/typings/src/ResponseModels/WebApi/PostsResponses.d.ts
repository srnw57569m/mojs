import BaseResponse from "../../Base/BaseResponse";

interface PostInventoryItem {
    item_id: string,
    active_palette: number,
    account_bound: boolean
}

interface PostInventory {
    items: PostInventoryItem[]
}

interface PostBody {
    /** Post body text, which only will be available when the post type is `"text"`*/
    text: string | null
    /** Post body inventory items, which only will be available when the post type is `"text"` or `"look"`*/
    inventory: PostInventory
}

interface Post {
    /** Unique identifier of the post */
    postId: string
    /** Unique identifier of the author */
    authorId: string
    /** UTC timestamp of when the post was created */
    createdAt: Date
    /** Url of the media in the post */
    mediaUrl: string | null
    /** Post type (e.g. `"look"`, `"text"`, `"photo"`, `"video"`) */
    type: "look" | "text" | "photo" | "video"
    /** Post visibility on the user profile */
    visibility: "public"
    /** Post comments number */
    comments: number
    /** Post likes number */
    likes: number
    /** Post reposts number */
    reposts: number
    /** Body data if the post was a `"look"` type */
    body: PostBody | null
    /** Post caption */
    caption: string | null
    /** I have no idea what it contains, so it's an array :) */
    featuredUserIds: unknown[]
}

interface Comment {
    /** Unique identifier of the comment */
    id: string
    /** Content of the comment */
    content: string
    /** Unique identifier of the post the comment belongs to */
    postId: string
    /** Unique identifier of the comment author */
    authorId: string
    /** Username of the comment author */
    authorName: string
    /** Number of likes on the comment */
    likes: number
}

declare class PostResponse extends BaseResponse {
    /** Unique identifier of the post */
    postId: string
    /** Unique identifier of the author */
    authorId: string
    /** UTC timestamp of when the post was created */
    createdAt: Date
    /** Url of the media in the post */
    mediaUrl: string | null
    /** Post type (e.g. `"look"`, `"text"`, `"photo"`, `"video"`) */
    type: "look" | "text" | "photo" | "video"
    /** Post visibility on the user profile */
    visibility: "public"
    /** Post comments number */
    comments: number
    /** Post likes number */
    likes: number
    /** Post reposts number */
    reposts: number
    /** Body data if the post was a `"look"` or `"text"` type */
    body: PostBody | null
    /** Post caption */
    caption: string | null
    /** I have no idea what it contains, so it's an array :) */
    featuredUserIds: unknown[]
    /** Post comments */
    commentsList: Comment[]
}

declare class PostsResponse extends BaseResponse {
    /** List of posts returned by WebApi */
    posts: Post[]

    /** Total posts in Highrise or user profile if returned by using the `autherId` option */
    total: number

    /** First Id in `posts` property */
    firstId: string | null

    /** Last Id in `posts` property */
    lastId: string | null

    /**  Fetches the next batch of posts. */
    next(): Promise<PostsResponse> | null
}

export {
    PostsResponse,
    PostResponse,
    Post
}