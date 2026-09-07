import AcknowledgmentResponse from "highrise.bot/typings/src/ResponseModels/AcknowledgmentResponse";
import { Conversations } from "./Conversations";
import Messages from "./Messages";

/**
* Handles inbox-related requests.
*/
declare class DirectApi {

    /**
     * Handles conversation-related requests such as fetching the inbox.
     */
    conversations: Conversations

    /**
     * Handles message-related operations within a specific conversation.
     */
    messages: Messages

    /**
     * Send a direct message to a specific user using the convId
     * @param convId - The conversation ID to send the message in
     * @param message - The direct message to send
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.direct.send(convId, "Your item has been delivered!");
     * if (result.ok) {
     *   console.log(`Direct message sent successfully`);
     * }
     * 
     * if (result.hasError()) {
     *   console.log(`something went wrong: ${result.error}`)
     * }
     * ```
     */
    send(convId: string, message: string): Promise<AcknowledgmentResponse>;

    /**
     * Broadcast a direct message to multiple users using an array of IDs
     * @param user_Ids - Array of IDs to send the message to (1-100 users)
     * @param message - The direct message to send
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.direct.broadcast(
     *   ['user_id_1', 'user_id_2'],
     *   "Your item has been delivered!"
     * );
     * 
     * if (result.hasError()) {
     *   console.log(`something went wrong: ${result.error}`)
     * }
     * ```
     */
    broadcast(userIds: string[], message: string): Promise<AcknowledgmentResponse>;

    /**
     * Invite a user to a specific room.
     * @param convId - The conversation ID to send the invite in.
     * @param roomId - The unique identifier of the room.
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.direct.inviteRoom(convId, "64b7f...");
     * if (result.ok) {
     * console.log("Room invite sent!");
     * }
     * ```
     */
    inviteRoom(convId: string, roomId: string): Promise<AcknowledgmentResponse>;

    /**
     * Invite a user to a specific 3d world.
     * @param convId - The conversation ID to send the invite in.
     * @param worldId - The unique identifier of the world.
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.direct.inviteWorld(convId, "world_id_here");
     * if (result.hasError()) {
     * console.error(`Invite failed: ${result.error}`);
     * }
     * ```
     */
    inviteWorld(convId: string, worldId: string): Promise<AcknowledgmentResponse>;

    /**
     * broadcast invites to multiple users for a room or a world.
     * @param userIds - Array of user IDs to receive the invite.
     * @param inviteDetails - Object containing either `roomId` or `worldId`.
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.direct.bulkInvite(
     * ['user_id_1', 'user_id_2'], 
     * { roomId: "64b7f..." }
     * );
     * if (result.ok) {
     * console.log("Bulk invites processed successfully.");
     * }
     * ```
     */
    broadcastInvite(
        userIds: string[],
        inviteDetails: { roomId?: string; worldId?: string }
    ): Promise<AcknowledgmentResponse>;
}

export default DirectApi 