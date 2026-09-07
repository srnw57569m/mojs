import { GetConversationsResponse } from "highrise.bot/typings/src/ResponseModels/DirectResponses";
import AcknowledgmentResponse from "highrise.bot/typings/src/ResponseModels/AcknowledgmentResponse";

/**
 * Handles conversation-related requests such as fetching the inbox.
 */
export class Conversations {
    /**
     * Retrieves a list of conversations from the bot inbox.
     * @param lastId - Last id to fetch the next 20 conversations (pagination cursor).
     * @param notJoined - Whether to include conversations the bot has not yet joined (default: false).
     * @returns A promise that resolves to an {@link GetConversationsResponse} containing the list of inbox and pagination metadata.
     * @example
     * ```javascript
     * const inbox = await bot.direct.conversations.list();
     * if (inbox.ok) {
     * console.log(`Found ${inbox.conversations.length} chats.`);
     * }
     * ```
     */
    list(lastId?: string | null, notJoined?: boolean): Promise<GetConversationsResponse>;

    /**
     * Leave a conversation using conversation id
     * @param convId - Conversation ID to leave from
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.direct.conversations.leave(convId);
     * if (result.ok) {
     *   console.log(`Left conversation: ${result.left.conversation_id}`);
     * } else {
     *   console.error('Failed to leave conversation');
     * }
     * ```
     */
    leave(convId: string): Promise<AcknowledgmentResponse>
}