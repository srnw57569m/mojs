import { GetUserOutfitResponse } from "highrise.bot/typings/src/ResponseModels/PlayerResponses";

/**
* Handles player outfit-related requests such as getting a player outfit data.
*/
declare class Outfit {
    /**
     * Get the outfit of a user
     * @param userId - The ID of the user to get the outfit for
     * @returns A promise that resolves to an {@link GetUserOutfitResponse} containing outfit items and count
     * @example
     * ```javascript
     * const outfit = await bot.player.outfit.get(userId)
     * if (outfit.hasError()) console.log(outfit.error)
     * console.log(outfit.outfit)
     * console.log(outfit.count)
     * ```
     */
    get(userId: string): Promise<GetUserOutfitResponse>;
}

export { Outfit }
export default Outfit