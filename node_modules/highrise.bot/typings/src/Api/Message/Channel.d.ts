import AcknowledgmentResponse from "highrise.bot/typings/src/ResponseModels/AcknowledgmentResponse";

/**
 * Handles bot-to-bots in-room chat requests.
 */
declare class ChannelApi {
    /**
     * Send a message to the Highrise hidden chat (visible to all bots in the room except sender bot)
     * @param message - The message to send to the Highrise hidden chat
     * @param tags - An array of strings usally used to filter out messages or can be used for anything
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * // Send a simple announcement
     * const result = await bot.channel.send("Player 1 wins", ['announcement']);
     * if (result.ok) {
     *   console.log(`Message sent successfully`);
     * }
     * 
     * // listen to the message from other bots
     * bot.on("Channel", (botId, message, tags) => {
     *   if (tags.includes('announcement')) {
     *      console.log(`New announcement from ${botId}: ${message}`)
     *   } else {
     *      console.log(`[${botId}]: sent ${message} with tags ${tags}`)
     *   }
     * })
     * ```
     * 
     * @note message can be used as stringified JSON data
     */
    send(message: string, tags: string[]): Promise<AcknowledgmentResponse>;
}

export default ChannelApi