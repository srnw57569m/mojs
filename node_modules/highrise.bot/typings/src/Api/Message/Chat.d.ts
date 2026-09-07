import AcknowledgmentResponse from "highrise.bot/typings/src/ResponseModels/AcknowledgmentResponse";

/**
 * Handles in-room chat requests.
 */
declare class ChatApi {
    /**
     * Send a message to the Highrise room (visible to all users in the room), Messages longer than `256 characters` are handled internally
     * @param message - The message to send to the Highrise room
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * // Send a simple message
     * const result = await bot.message.send("Hello everyone!");
     * if (result.ok) {
     *   console.log(`Message sent successfully`);
     * }
     * 
     * // Send a welcome message
     * const result = await bot.message.send("Welcome to the room! 🎉");
     * 
     * // Send a command announcement
     * const result = await bot.message.send("Type !help for available commands");
     * ```
     */
    send(message: string): Promise<AcknowledgmentResponse>;
}

export default ChatApi