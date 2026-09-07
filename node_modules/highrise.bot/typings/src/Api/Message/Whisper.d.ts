import AcknowledgmentResponse from "highrise.bot/typings/src/ResponseModels/AcknowledgmentResponse";

/**
 * Handles bot-to-user whisper chat requests.
 */
declare class WhisperApi {
    /**
     * Send a message to a user in room, Messages longer than `256 characters` are handled internally
     * @param message - The message to send to the Highrise room
     * @param userId - user's id of the player you want to whisper
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * // Send a simple message
     * const result = await bot.whisper.send("userId", "Hello everyone!");
     * if (result.ok) {
     *   console.log(`whisper sent successfully`);
     * }
     * 
     * // Send a welcome message
     * const result = await bot.whisper.send("userId", "Welcome to the room! 🎉");
     * 
     * // Send a command announcement
     * const result = await bot.whisper.send("userId", "Type !help for available commands");
     * ```
     */
    send(message: string, userId: string): Promise<AcknowledgmentResponse>;
}

export default WhisperApi