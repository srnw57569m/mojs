import { GetInventoryResponse } from "highrise.bot/typings/src/ResponseModels/InventoryResponses";
import Outfit from "./Outfit";
import Wallet from "./Wallet";
import { BoostBuy, ItemBuy } from "./Buying";

/**
 * Handles bot Inventory-related requests such as outfit management, 
 * wallet status, and shop purchases.
 */
declare class InventoryApi {
    /**
     * Handles bot outfit-related requests such as getting the bot outfit or setting a new one.
     */
    outfit: Outfit;

    /**
     * Handles bot wallet requests such as checking gold or boost token balances.
     */
    wallet: Wallet;

    /**
     * Handles purchasing items directly from the Highrise Shop.
     */
    item: ItemBuy;

    /**
     * Handles purchasing room boosts to increase room visibility.
     */
    boost: BoostBuy;

    /**
     * Get the bot's full clothing inventory.
     * @returns A promise that resolves to an {@link GetInventoryResponse} containing clothing items and count.
     * @example
     * ```javascript
     * const result = await bot.inventory.get();
     * if (result.hasError()) console.log(result.error);
     * console.log(`Total items: ${result.count}`);
     * result.inventory.forEach(item => console.log(item.id));
     * ```
     */
    get(): Promise<GetInventoryResponse>;
}

export default InventoryApi