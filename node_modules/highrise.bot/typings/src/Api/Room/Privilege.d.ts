import { GetRoomPrivilegeResponse } from "highrise.bot/typings/src/ResponseModels/RoomResponses";

/**
* Handles in-room privilege related requests such as check for player privileges in-room.
*/
declare class Privilege {
    /**
     * Get the room privileges of a user
     * @param userId - The ID of the user to get privileges for
     * @returns A promise that resolves to an {@link GetRoomPrivilegeResponse} containing privilege data
     * @example
     * ```javascript
     * const privilege = await bot.room.privilege.get(userId)
     * if (privilege.hasError()) console.log(privilege.error)
     * console.log(privilege.moderator)
     * console.log(privilege.designer)
     * ```
     */
    get(userId: string): Promise<GetRoomPrivilegeResponse>;

    /**
     * Check if a user is a moderator in the room
     * @param userId - The ID of the user to check
     * @returns object contain value set to true if the user is a moderator, false otherwise (contain error property on error, null otherwise)
     * @example
     * ```javascript
     * const isMod = await bot.room.privilege.isModerator(userId)
     * if (isMod.error) console.log(`something went wrong: ${isMod.error}`)
     * if (isMod.value) console.log("User is a moderator")
     * ```
     */
    isModerator(userId: string): Promise<{ value: boolean, error: string | null }>;

    /**
     * Check if a user is a designer in the room
     * @param userId - The ID of the user to check
     * @example
     * ```javascript
     * const isDes = await bot.room.privilege.isDesigner(userId)
     * if (isDes.error) console.log(`something went wrong: ${isDes.error}`)
     * if (isDes.value) console.log("User is a designer")
     * ```
     */
    isDesigner(userId: string): Promise<{ value: boolean, error: string | null }>;
}

export { Privilege }
export default Privilege