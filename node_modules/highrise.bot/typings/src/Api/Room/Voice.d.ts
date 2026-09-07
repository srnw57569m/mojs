import AcknowledgmentResponse from "highrise.bot/typings/src/ResponseModels/AcknowledgmentResponse";
import { CheckVoiceChatResponse } from "highrise.bot/typings/src/ResponseModels/RoomResponses";

/**
* Handles in-room voice related requests such as check for player voice or invite a player to voice in-room.
*/
declare class Voice {
    /**
     * Check the current voice chat status in the room
     * @returns A promise that resolves to an {@link CheckVoiceChatResponse} containing voice chat status and active speakers
     * @example
     * ```javascript
     * const voice = await bot.room.voice.check()
     * if (voice.hasError()) {
     *   console.log(voice.error)
     * }
     * console.log(voice.users)
     * console.log(voice.seconds_left)
     * ```
     */
    check(): Promise<CheckVoiceChatResponse>;

    /**
     * Invite a user to speak in the voice chat
     * @param userId - The ID of the user to invite as a speaker
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.room.voice.invite(userId)
     * if (result.ok) {
     *   console.log("User invited to speak")
     * }
     * ```
     */
    invite(userId: string): Promise<AcknowledgmentResponse>;

    /**
     * Remove a user from speaking in the voice chat
     * @param userId - The ID of the user to remove as a speaker
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.room.voice.remove(userId)
     * if (result.ok) {
     *   console.log("User removed from speakers")
     * }
     * ```
     */
    remove(userId: string): Promise<AcknowledgmentResponse>;
}

export { Voice }
export default Voice