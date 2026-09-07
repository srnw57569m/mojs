const { ModeratorPrivilege, DesignerPrivilege } = require("./Promotion")
const Moderation = require("../Player/Moderation")
const Privilege = require("./Privilege")
const Users = require("./Users")
const Voice = require("./Voice")

class RoomApi {
    constructor(ctx, utils) {
        this.users = new Users(ctx, utils)
        this.moderation = new Moderation(ctx, utils)
        this.voice = new Voice(ctx, utils)
        this.privilege = new Privilege(ctx, utils)
        this.moderator = new ModeratorPrivilege(ctx, utils)
        this.designer = new DesignerPrivilege(ctx, utils)
    }
}

module.exports = RoomApi