const BaseResponse = require("../../../Base/BaseResponse");

class RoomResponse extends BaseResponse {
    build(data) {
        this.id = data.room_id
        this.name = data.disp_name
        this.createdAt = new Date(data.created_at)
        this.accessPolicy = data.access_policy
        this.category = data.category
        this.ownerId = data.owner_id
        this.locale = data.locale
        this.isHome = data.is_home_room
        this.playersOnline = data.num_connected
        this.moderatorIds = data.moderator_ids
        this.designerIds = data.designer_ids
        this.description = data.description
        this.crewId = data.crew_id
        this.thumbnailUrl = data.thumbnail_url
        this.bannerUrl = data.banner_url
    }
}

class RoomsResponse extends BaseResponse {
    build(data, listNext) {
        this.rooms = data.rooms.map((room) => ({
            id: room.room_id,
            name: room.disp_name,
            description: room.description,
            category: room.category,
            createdAt: new Date(room.created_at),
            accessPolicy: room.access_policy,
            ownerId: room.owner_id,
            locale: room.locale,
            isHome: room.is_home_room,
            designerIds: room.designer_ids,
            moderatorIds: room.moderator_ids
        }))

        this.total = data.total

        this.firstId = data.first_id ? data.first_id : null
        this.lastId = data.last_id ? data.last_id : null

        if (this.lastId) {
            this.next = async () => await listNext(this.lastId);
        } else {
            this.next = null;
        }
    }
}

module.exports = {
    RoomResponse,
    RoomsResponse
}