const ChannelApi = require("./Message/Channel");
const WhisperApi = require("./Message/Whisper");
const DirectApi = require("./Message/Direct");
const ChatApi = require("./Message/Chat");

const InventoryApi = require("./Inventory");
const PlayerApi = require("./Player");
const UtilsApi = require("./Utils");
const WebApi = require("../WebApi");
const RoomApi = require("./Room");
const Roles = require("../Tools/Roles");

class BotApi {
    constructor(ctx) {
        this.webapi = new WebApi(ctx)
        this.utils = new UtilsApi(ctx, this.webapi)

        this.message = new ChatApi(ctx, this.utils)
        this.whisper = new WhisperApi(ctx, this.utils)
        this.direct = new DirectApi(ctx, this.utils)
        this.channel = new ChannelApi(ctx, this.utils)
        this.room = new RoomApi(ctx, this.utils)
        this.player = new PlayerApi(ctx, this.utils)
        this.inventory = new InventoryApi(ctx, this.utils)

        this.roles = new Roles(ctx, this.webapi)
    }
}

module.exports = BotApi