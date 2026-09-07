class BaseMessageRequest {
    constructor(recipient, isBulk = false) {
        this._type = isBulk ? "SendBulkMessageRequest" : "SendMessageRequest";

        if (isBulk) {
            this.user_ids = recipient;
        } else {
            this.conversation_id = recipient;
        }

        this.content = '';
    }
}

class SendMessageRequest extends BaseMessageRequest {
    constructor(recipient, content, isBulk = false) {
        super(recipient, isBulk);
        this.type = 'text';
        this.content = content;
    }
}

class SendInviteRequest extends BaseMessageRequest {
    constructor(recipient, room_id, world_id, isBulk = false) {
        super(recipient, isBulk);
        this.type = 'invite';
        this.room_id = room_id || null;
        this.world_id = world_id || null;
    }
}

// This will stay commented until they let the bots use them
//
// class SendMediaRequest extends BaseMessageRequest {
//     constructor(recipient, media_id, isBulk = false) {
//         super(recipient, isBulk);
//         this.type = 'media';
//         this.media_id = media_id || null;
//     }
// }

class GetConversationsRequest {
    constructor(last_id, not_joined) {
        this._type = "GetConversationsRequest"
        this.last_id = last_id
        this.not_joined = not_joined
    }
}

class LeaveConversationRequest {
    constructor(conversation_id) {
        this._type = "LeaveConversationRequest"
        this.conversation_id = conversation_id
    }
}

class GetMessagesRequest {
    constructor(conversation_id, last_message_id) {
        this._type = "GetMessagesRequest"
        this.conversation_id = conversation_id
        this.last_message_id = last_message_id
    }
}

module.exports = { 
    SendMessageRequest, 
    SendInviteRequest, 
    GetConversationsRequest,
    LeaveConversationRequest,
    GetMessagesRequest
};