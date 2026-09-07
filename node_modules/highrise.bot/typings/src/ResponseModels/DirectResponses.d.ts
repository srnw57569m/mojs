import BaseResponse from "highrise.bot/typings/src/Base/BaseResponse";

/** Details of the most recent message in a thread */
interface MessageSummary {
    messageId: string;
    conversationId: string;
    createdAt: Date;
    content: string;
    senderId: string;
    category: string;
}

/** Represents a conversation object */
interface Conversation {
    id: string;
    joined: boolean;
    unreadMessages: number;
    lastMessage: MessageSummary | null;
    muted: boolean;
    memberIds: string[];
    name: string | null;
    ownerId: string;
}

/** 
 * Response model for fetching multiple conversations.
 * Supports automated pagination via the .next() method.
 */
declare class GetConversationsResponse extends BaseResponse {
    /** The list of fetched conversations */
    conversations: Conversation[];

    /** Number of conversations available but not joined */
    notJoined: number;

    /** Shortcut to the latest message found in the first conversation */
    recentMessage: MessageSummary | null;

    /** The ID of the final conversation in this batch, used for pagination */
    lastId: string | null;

    /** 
     * Fetches the next page of conversations using the same filters (e.g., notJoined).
     * Returns null if the current page has fewer than 20 items, indicating no more data.
     */
    next(): Promise<GetConversationsResponse> | null;
}

/**
 * Response model for fetching messages within a conversation.
 * Supports automated pagination via the .next() method.
 */
declare class GetMessagesResponse extends BaseResponse {
    /** The list of messages in the current batch */
    messages: MessageSummary[];

    /** Shortcut to the first (most recent) message in this batch */
    recentMessage: MessageSummary | null;

    /** The ID of the oldest message in this batch, used as a cursor for the next page */
    lastId: string | null;

    /** 
     * Fetches the next (older) batch of messages for this conversation.
     * Returns null if the current page has fewer than 20 items, indicating no more data.
     */
    next(): Promise<GetMessagesResponse> | null;
}

export { GetConversationsResponse, GetMessagesResponse, MessageSummary, Conversation }