const BaseResponse = require("../../Base/BaseResponse");

class GetConversationsResponse extends BaseResponse {
    build(data, listNext) {
        this.conversations = (data.conversations || []).map((conv) => ({
            id: conv.id,
            joined: conv.did_joined,
            unreadMessages: conv.unread_count,
            lastMessage: conv.last_message ? {
                messageId: conv.last_message.message_id,
                conversationId: conv.last_message.conversation_id,
                createdAt: new Date(conv.last_message.createdAt + "Z"),
                content: conv.last_message.content,
                senderId: conv.last_message.sender_id,
                category: conv.last_message.category,
            } : null,
            muted: conv.muted,
            memberIds: conv.member_ids,
            name: conv.name,
            ownerId: conv.owner_id
        }));

        this.notJoined = data.not_joined || 0;

        if (this.conversations.length > 0) {
            this.recentMessage = this.conversations[0].lastMessage;
            this.lastId = this.conversations[this.conversations.length - 1].id;
        } else {
            this.recentMessage = null;
            this.lastId = null;
        }

        const pageSize = 20;
        const hasMore = this.conversations.length === pageSize;

        if (hasMore && this.lastId) {
            this.next = async () => await listNext(this.lastId);
        } else {
            this.next = null;
        }
    }
}

class GetMessagesResponse extends BaseResponse {
    build(data, listNext) {
        this.messages = (data.messages || []).map((msg) => ({
            messageId: msg.message_id,
            conversationId: msg.conversation_id,
            createdAt: new Date(msg.createdAt + "Z"),
            content: msg.content,
            senderId: msg.sender_id,
            category: msg.category,
        }))

        if (this.messages.length > 0) {
            this.recentMessage = this.messages[0]
            this.lastId = this.messages[this.messages.length - 1].messageId
        } else {
            this.recentMessage = null
            this.lastId = null
        }

        const pageSize = 20;
        const hasMore = this.messages.length === pageSize;

        if (hasMore && this.lastId) {
            this.next = async () => await listNext(this.lastId);
        } else {
            this.next = null;
        }
    }
}

module.exports = { GetConversationsResponse, GetMessagesResponse };