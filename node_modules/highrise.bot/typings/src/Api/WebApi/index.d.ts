import GrabsEndpoint from "./Endpoints/Grabs"
import ItemsEndpoint from "./Endpoints/Items"
import PostsEndpoint from "./Endpoints/Posts"
import RoomsEndpoint from "./Endpoints/Rooms"
import UsersEndpoint from "./Endpoints/Users"

/**
 * Client for interacting with the Highrise WebApi
 * @see https://create.highrise.game/learn/web-api/general/overview
 */
declare class WebApi {
    /** Represents the Highrise WebApi `/users` endpoint */
    users: UsersEndpoint

    /** Represents the Highrise WebApi `/rooms` endpoint */
    rooms: RoomsEndpoint

    /** Represents the Highrise WebApi `/posts` endpoint */
    posts: PostsEndpoint

    /** Represents the Highrise WebApi `/items` endpoint */
    items: ItemsEndpoint

    /** Represents the Highrise WebApi `/grabs` endpoint */
    grabs: GrabsEndpoint
}

export default WebApi