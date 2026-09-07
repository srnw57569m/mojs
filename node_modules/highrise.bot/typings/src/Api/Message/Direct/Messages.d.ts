import { GetMessagesResponse } from "../../../ResponseModels/DirectResponses";

/**
 * Handles message-related operations within a specific conversation.
 */
declare class Messages {
    /**
     * Fetches a list of messages from a specific conversation.
     * @param convId The unique identifier of the conversation.
     * @param lastMessageId Optional cursor for pagination to fetch messages older than this ID.
     * @returns A promise that resolves to an {@link GetMessagesResponse} containing the messages and pagination helper.
     * @example
     * ```javascript
     * // Fetch the first 20 messages of a chat
     * const response = await sdk.direct.messages.list("conv_123");
     * if (response.ok) {
     *   console.log(`Loaded ${response.messages.length} messages`);
     * // Use the built-in next() to get the previous 20 messages
     * if (response.next) {
     *   const olderMessages = await response.next();
     *   console.log("Loaded older history", olderMessages.messages);
     *  }
     * }
     * ```
     */
    list(convId: string, lastMessageId?: string): Promise<GetMessagesResponse>;
}

export = Messages;