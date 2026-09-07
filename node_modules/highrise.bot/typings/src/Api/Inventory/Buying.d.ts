import { BuyItemResponse, BuyRoomBoostResponse } from "highrise.bot/typings/src/ResponseModels/InventoryResponses";

/**
 * Handles purchasing items directly from the Highrise store.
 */
declare class ItemBuy {
    /**
     * Purchases a shop item using the bot's gold.
     * @param itemId - The unique string ID of the item.
     * @returns A promise that resolves to a {@link BuyItemResponse}.
     * @example
     * ```javascript
     * const response = await bot.inventory.item.buy("shirt-f_marchingband");
     * if (response.hasError()) return console.log(response.error);
     * if (response.insufficientFunds) return console.log("Not enough gold");
     * console.log(response.result);
     * ```
     */
    buy(itemId: string): Promise<BuyItemResponse>;
}

/**
 * Handles purchasing room boosts to increase room visibility.
 */
declare class BoostBuy {
    /**
     * Buys a room boost using the bot's wallet.
     * @param amount - Number of boosts to purchase. Defaults to 1.
     * @returns A promise that resolves to a {@link BuyRoomBoostResponse}.
     * @example
     * ```javascript
     * const response = await bot.inventory.boost.buy(5);
     * if (response.hasError()) return console.log(response.error);
     * if (response.insufficientFunds) return console.log("Not enough gold");
     * console.log(response.result);
     * ```
     */
    buy(amount?: number): Promise<BuyRoomBoostResponse>;
}

export { BoostBuy, ItemBuy }