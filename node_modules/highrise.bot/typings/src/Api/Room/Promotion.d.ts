import AcknowledgmentResponse from "highrise.bot/typings/src/ResponseModels/AcknowledgmentResponse";

/**
* Handles in-room privilege related requests such as promotion a player to moderator or designer in-room.
*/
declare class ModeratorPrivilege {
    /**
     * Grant moderator privilege to a user
     * @param userId - The ID of the user to grant moderator to
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.room.privilege.moderator.add(userId)
     * if (result.ok) console.log("Moderator granted")
     * ```
     */
    add(userId: string): Promise<AcknowledgmentResponse>;

    /**
     * Remove moderator privilege from a user
     * @param userId - The ID of the user to remove moderator from
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.room.privilege.moderator.remove(userId)
     * if (result.ok) console.log("Moderator removed")
     * ```
     */
    remove(userId: string): Promise<AcknowledgmentResponse>;
}

declare class DesignerPrivilege {
    /**
     * Grant designer privilege to a user
     * @param userId - The ID of the user to grant designer to
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.room.privilege.designer.add(userId)
     * if (result.ok) console.log("Designer granted")
     * ```
     */
    add(userId: string): Promise<AcknowledgmentResponse>;

    /**
     * Remove designer privilege from a user
     * @param userId - The ID of the user to remove designer from
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * const result = await bot.room.privilege.designer.remove(userId)
     * if (result.ok) console.log("Designer removed")
     * ```
     */
    remove(userId: string): Promise<AcknowledgmentResponse>;
}

export { ModeratorPrivilege, DesignerPrivilege }