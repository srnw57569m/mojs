import BaseResponse from "highrise.bot/typings/src/Base/BaseResponse";
import { OutfitItem, TipResult } from "highrise.bot/typings/interfaces";

/**
 * Highrise api response for getting a specific user outfit
 */
declare class GetUserOutfitResponse extends BaseResponse {
    /**
     * List of outfit items the user is wearing
     */
    outfit: OutfitItem[];

    /**
     * Number of items in the outfit
     */
    count: number;

    /**
     * Check if the user is wearing this item
     * @param itemId ID of the item to check
     * @example
     * ```javascript
     * const outfit = await bot.player.outfit.get(userId)
     * outfit.has('hair_front-n_malenew05')
     * ```
     */
    has(itemId: string): boolean

    /**
     * Return an item that match the passed itemId
     * @param itemId ID of the to be found
     * @example
     * ```javascript
     * const outfit = await bot.player.outfit.get(userId)
     * const hair = outfit.find('hair_front-n_malenew05')
     * ```
     */
    find(itemId: string): OutfitItem
}

/**
 * Custom highrise api response for split tip user
 */
declare class SplitTipUserResponse extends BaseResponse {
    /** Total gold bars will be sent */
    total: number

    /** Success gold bars that got sent */
    success: number

    /** Gold bars that failed to be sent */
    failed: number
}

/**
 * Highrise api response for tip user
 */
class TipUserResponse extends BaseResponse {
    /** The outcome of the tip transaction. */
    result: TipResult
}

export {
    GetUserOutfitResponse,
    SplitTipUserResponse,
    TipUserResponse
}