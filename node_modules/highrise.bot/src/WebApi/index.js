const HttpClient = require("../Networking/Core/HttpClient");
const GrabsEndpoint = require("./Endpoints/Grabs");
const ItemsEndpoint = require("./Endpoints/Items");
const PostsEndpoint = require("./Endpoints/Posts");
const RoomsEndpoint = require("./Endpoints/Rooms");
const UsersEndpoint = require("./Endpoints/Users");

class WebApi {
    #client

    constructor(ctx) {
        this.#client = new HttpClient({
            baseURL: "https://webapi.highrise.game"
        })

        this.users = new UsersEndpoint(ctx, this.#client)
        this.rooms = new RoomsEndpoint(ctx, this.#client)
        this.posts = new PostsEndpoint(ctx, this.#client)
        this.items = new ItemsEndpoint(ctx, this.#client)
        this.grabs = new GrabsEndpoint(ctx, this.#client)
    }
}

module.exports = WebApi