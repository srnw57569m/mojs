import AcknowledgmentResponse from "highrise.bot/typings/src/ResponseModels/AcknowledgmentResponse";

/**
* Handles in-room player moderation-related requests such as ban, kick, mute.
*/
declare class Moderation {
    /**
     * Kick a user from the room
     * @param userId - The ID of the user to kick
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.room.moderation.kick(userId)
     * if (result.ok) {
     *   console.log("User kicked successfully")
     * }
     * ```
     */
    kick(userId: string): Promise<AcknowledgmentResponse>;

    /**
     * Mute a user in the room for a specified duration
     * @param userId - The ID of the user to mute
     * @param duration - The duration of the mute in seconds
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.room.moderation.mute(userId, 60)
     * if (result.ok) {
     *   console.log("User muted for 60 seconds")
     * }
     * ```
     */
    mute(userId: string, duration: number): Promise<AcknowledgmentResponse>;

    /**
     * Ban a user from the room for a specified duration
     * @param userId - The ID of the user to ban
     * @param duration - The duration of the ban in seconds
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.room.moderation.ban(userId, 3600)
     * if (result.ok) {
     *   console.log("User banned for 1 hour")
     * }
     * ```
     */
    ban(userId: string, duration: number): Promise<AcknowledgmentResponse>;

    /**
     * Unmute a previously muted user
     * @param userId - The ID of the user to unmute
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.room.moderation.unmute(userId)
     * if (result.ok) {
     *   console.log("User unmuted successfully")
     * }
     * ```
     */
    unmute(userId: string): Promise<AcknowledgmentResponse>;

    /**
     * Unban a previously banned user (require bot created by room owner)
     * @param userId - The ID of the user to unban
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.room.moderation.unban(userId)
     * if (result.ok) {
     *   console.log("User unbanned successfully")
     * }
     * ```
     */
    unban(userId: string): Promise<AcknowledgmentResponse>;
}

export { Moderation }
export default Moderation