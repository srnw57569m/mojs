import AcknowledgmentResponse from "highrise.bot/typings/src/ResponseModels/AcknowledgmentResponse";
import { SplitTipUserResponse, TipUserResponse } from "highrise.bot/typings/src/ResponseModels/PlayerResponses";
import { Facing, Goldbars, Reactions } from "highrise.bot/typings/interfaces";
import Moderation from "highrise.bot/typings/src/Api/Player/Moderation";
import Outfit from "highrise.bot/typings/src/Api/Player/Outfit";

/**
* Handles player-related requests such as teleporting, tipping, transfer.
*/
declare class PlayerApi {

    /**
     * Moderate users in the room (kick, mute, ban, unmute, unban)
     */
    moderation: Moderation;

    /**
     * Outfit api to fetch players outfit
     */
    outfit: Outfit;

    /**
     * Walk the bot to specified coordinates with optional facing direction.
     * This method validates coordinates (non-negative) and facing direction before sending.
     * @param x The x coordinate to walk to (must be >= 0)
     * @param y The y coordinate to walk to (must be >= 0)
     * @param z The z coordinate to walk to (must be >= 0)
     * @param facing The direction the bot should face (default: 'FrontRight')
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * If validation or the request fails, the response will contain an error.
     * @example
     * ```javascript
     * const result = await bot.player.walk(10, 0, 5, 'FrontLeft');
     * if (result.error) {
     *   console.error("Walk failed:", result.error.message);
     * }
     * ```
     */
    walk(x: number, y: number, z: number, facing?: Facing): Promise<AcknowledgmentResponse>;

    /**
     * Sit the bot on an anchor position
     * @param entity_id The entity ID to sit on
     * @param anchor_ix The anchor index to sit on (default: 0)
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.player.sit("entity_id")
     * if (result.ok) console.log("Sitting")
     * 
     * const result = await bot.player.sit("entity_id", 1)
     * if (result.ok) console.log("Sitting on anchor 1")
     * ```
     */
    sit(entity_id: string, anchor_ix?: number): Promise<AcknowledgmentResponse>;

    /**
     * Teleport a user to a position in the room
     * @param userId The ID of the user to teleport
     * @param x The x coordinate
     * @param y The y coordinate
     * @param z The z coordinate
     * @param facing The direction the user faces (default: "FrontRight")
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.player.teleport(userId, 5, 0, 5)
     * if (result.ok) console.log("User teleported")
     * 
     * const result = await bot.player.teleport(userId, 5, 0, 5, "FrontLeft")
     * if (result.ok) console.log("User teleported facing left")
     * ```
     */
    teleport(
        userId: string,
        x: number,
        y: number,
        z: number,
        facing?: Facing
    ): Promise<AcknowledgmentResponse>;

    /**
     * Send an emote to a user in the room
     * @param emoteId The ID of the emote to send
     * @param userId The ID of the user to send the emote to. If not provided, the bot's own ID will be used
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * // Send emote to a specific user
     * const result = await bot.player.emote("dance-macarena", userId)
     * if (result.ok) console.log("Emote sent")
     * 
     * // Send emote to the bot itself
     * const result = await bot.player.emote("dance-macarena")
     * if (result.ok) console.log("Bot is dancing")
     * ```
     */
    emote(emoteId: string, userId?: string): Promise<AcknowledgmentResponse>;

    /**
     * Transport a user to a different room
     * @param userId The ID of the user to transport
     * @param roomId The ID of the room to transport the user to
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.player.transport(userId, roomId)
     * if (result.ok) console.log("User transported")
     * ```
     */
    transport(userId: string, roomId: string): Promise<AcknowledgmentResponse>;

    /**
     * Send a reaction to a user in the room
     * @param userId The ID of the user to react to
     * @param reaction The reaction to send (default: `heart`)
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.player.react(userId, "clap")
     * if (result.ok) console.log("Reaction sent")
     * ```
     */
    react(userId: string, reaction?: Reactions): Promise<AcknowledgmentResponse>;

    /**
     * Tip a user with gold bars
     * @param userId The ID of the user to tip
     * @param amount The amount of gold bars to tip (default: 1)
     * @returns A promise that resolves to an {@link TipUserResponse} result containing tip result.
     * @example
     * ```javascript
     * // Tip with 1 gold bar (default)
     * const response = await bot.player.tip(userId)
     * if (response.result === "success") console.log("Tipped 1 gold bar")
     * 
     * // Tip with 100 gold bars
     * const response = await bot.player.tip(userId, 100)
     * if (response.result === "success") console.log("Tipped 100 gold bars")
     * ```
     */
    tip(userId: string, amount?: Goldbars): Promise<TipUserResponse>;

    /**
     * Split a large tip amount into valid gold bar denominations and send them sequentially
     * @param userId The user ID to send the split tips to
     * @param amount Total amount to tip (will be split into valid denominations), (default: 1)
     * @param delay Delay between each tip in milliseconds (default: 300ms)
     * @returns A promise that resolves to an {@link SplitTipUserResponse} result with split tipping details or error
     * @example
     * ```javascript
     * // Tip 150 gold will be split into 100 + 50
     * const result = await bot.player.splitTip(userId 150);
     * if (result.ok) {
     *   console.log(`Successfully sent ${result.total} individual tips`);
     * }
     * 
     * // Tip 555 with custom delay between tips (500 + 50 + 5)
     * await bot.player.splitTip(userId 555, 500); // 500 ms delay
     * 
     * // Tip 10,550 with default delay of 300 ms (10,000 + 500 + 50)
     * await bot.player.splitTip(userId 10550);
     * ```
     */
    splitTip(userId: string, amount?: number, delay?: number): Promise<SplitTipUserResponse>;
}

export default PlayerApi