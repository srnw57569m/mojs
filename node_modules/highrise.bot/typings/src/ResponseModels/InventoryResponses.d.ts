import { OutfitItem } from "highrise.bot/typings/interfaces";
import BaseResponse from "highrise.bot/typings/src/Base/BaseResponse";
import { GetUserOutfitResponse } from "highrise.bot/typings/src/ResponseModels/PlayerResponses";

/**
 * Handles purchasing items directly from the Highrise store.
 */
class GetBotOutfitResponse extends GetUserOutfitResponse { }

    /**
 * Highrise api response for getting the bot clothing inventory
 */
class GetInventoryResponse extends BaseResponse {
    /**
     * Bot clothing inventory
     */
    inventory: OutfitItem[]

    /** amount of items in the inventory */
    count: number
}

/**
 * Highrise api response for getting the bot wallet
 */
class GetWalletResponse extends BaseResponse {
    /** Gold amount currently in the bot's wallet */
    gold: number

    /** Boost token amount currently in the bot's wallet */
    boostToken: number

    /** Voice tokent currently in the bot's wallet */
    voiceToken: number
}

/**
 * Response returned after an item purchase attempt.
 */
declare class BuyItemResponse extends BaseResponse {
    /**
     * The raw outcome of the transaction
     */
    result: BuyingResult;

    /**
     * True if the purchase was successful
     * @example
     * const result = await bot.inventory.item.buy(itemId)
     * if (result.success) console.log("Item purchased!")
     */
    success: boolean;

    /**
     * True if the purchase failed due to insufficient funds
     * @example
     * const result = await bot.inventory.item.buy(itemId)
     * if (result.insufficientFunds) console.log("Not enough gold")
     */
    insufficientFunds: boolean;
}

/**
 * Response returned after a room boost purchase attempt.
 */
declare class BuyRoomBoostResponse extends BaseResponse {
    /**
     * The raw outcome of the boost transaction
     */
    result: BuyingResult;

    /**
     * True if the boost purchase was successful
     * @example
     * const result = await bot.inventory.boost.buy()
     * if (result.success) console.log("Room boosted!")
     */
    success: boolean;

    /**
     * True if the boost purchase failed due to insufficient funds
     * @example
     * const result = await bot.inventory.boost.buy()
     * if (result.insufficientFunds) console.log("Not enough tokens")
     */
    insufficientFunds: boolean;
}

export { 
    GetBotOutfitResponse, 
    GetWalletResponse,
    GetInventoryResponse,
    BuyItemResponse,
    BuyRoomBoostResponse
 }