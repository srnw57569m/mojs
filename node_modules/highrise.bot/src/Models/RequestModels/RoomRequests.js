class GetRoomUsersRequest {
    constructor() {
        this._type = "GetRoomUsersRequest"
    }
}

class GetRoomPrivilegeRequest {
    constructor(user_id) {
        this._type = "GetRoomPrivilegeRequest"
        this.user_id = user_id
    }
}

class CheckVoiceChatRequest {
    constructor() {
        this._type = "CheckVoiceChatRequest"
    }
}

class InviteSpeakerRequest {
    constructor(user_id) {
        this._type = "InviteSpeakerRequest"
        this.user_id = user_id
    }
}

class RemoveSpeakerRequest {
    constructor(user_id) {
        this._type = "RemoveSpeakerRequest"
        this.user_id = user_id
    }
}

class ChangeRoomPrivilegeRequest {
    constructor(user_id, permissions) {
        this._type = "ChangeRoomPrivilegeRequest"
        this.user_id = user_id
        this.permissions = permissions
    }
}

module.exports = { 
    GetRoomUsersRequest,
    CheckVoiceChatRequest,
    InviteSpeakerRequest,
    RemoveSpeakerRequest,
    GetRoomPrivilegeRequest,
    ChangeRoomPrivilegeRequest
}