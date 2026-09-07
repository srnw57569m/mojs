const BaseResponse = require("../../../Base/BaseResponse");

class UserResponse extends BaseResponse {
    build(data) {
        this.id = data.user_id
        this.username = data.username
        this.outfit = data.outfit.map(({ parts, colors, ...rest }) => rest)
        this.bio = data.bio

        this.joinedAt = new Date(data.joined_at)
        this.lastOnlineIn = data.last_online_in 
            ? new Date(data.last_online_in) 
            : data.last_online_in

        this.followers = data.num_followers
        this.following = data.num_following
        this.friends = data.num_friends

        this.activeRoom = data.active_room
            ? {
                id: data.active_room.id,
                name: data.active_room.display_name
            }
            : null

        this.countryCode = data.country_code
        this.crew = data.crew
        this.voiceEnabled = data.voice_enabled
        this.discordId = data.discord_id

        this.iconUrl = data.icon_url
        this.avatarUrl = data.avatar_url
        this.avatarSvg = data.avatar_svg
    }
}

module.exports = UserResponse