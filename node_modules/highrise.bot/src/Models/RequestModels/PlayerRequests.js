class ModerateRoomRequest {
    constructor(user_id, moderation_action, action_length) {
        this._type = 'ModerateRoomRequest'
        this.user_id = user_id
        this.moderation_action = moderation_action
        this.action_length = action_length
    }
}

class GetUserOutfitRequest {
    constructor(user_id) {
        this._type = "GetUserOutfitRequest"
        this.user_id = user_id
    }
}

class FloorHitRequest {
    constructor(x, y, z, facing) {
        this._type = "FloorHitRequest"
        this.destination = {
            x,
            y,
            z,
            facing
        }
    }
}

class AnchorHitRequest {
    constructor(entity_id, anchor_ix) {
        this._type = "AnchorHitRequest"
        this.anchor = {
            entity_id,
            anchor_ix
        }
    }
}

class TeleportRequest {
    constructor(user_id, x, y, z, facing) {
        this._type = "TeleportRequest"
        this.user_id = user_id
        this.destination = {
            x,
            y,
            z,
            facing
        }
    }
}

class EmoteRequest {
    constructor(emote_id, target_user_id) {
        this._type = 'EmoteRequest'
        this.emote_id = emote_id
        this.target_user_id = target_user_id
    }
}

class MoveUserToRoomRequest {
    constructor(user_id, room_id) {
        this._type = "MoveUserToRoomRequest"
        this.user_id = user_id
        this.room_id = room_id
    }
}

class ReactionRequest {
    constructor(user_id, reaction) {
        this._type = "ReactionRequest"
        this.target_user_id = user_id
        this.reaction = reaction
    }
}

class TipUserRequest {
    constructor(user_id, gold_bar) {
        this._type = "TipUserRequest"
        this.user_id = user_id
        this.gold_bar = gold_bar
    }
}

module.exports = {
    ModerateRoomRequest,
    GetUserOutfitRequest,
    FloorHitRequest,
    AnchorHitRequest,
    TeleportRequest,
    EmoteRequest,
    MoveUserToRoomRequest,
    ReactionRequest,
    TipUserRequest
}