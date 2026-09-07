import { GetWalletResponse } from "../../ResponseModels/InventoryResponses";

/**
* Handles bot wallet request such as getting the bot wallet.
*/
declare class Wallet {
    /**
     * Get the bot wallet
     * @returns A promise that resolves to an {@link GetWalletResponse} containing wallet data
     * @example
     * ```javascript
     * const wallet = await bot.inventory.wallet.get()
     * if (wallet.hasError()) console.log(wallet.error)
     * console.log(wallet.gold)
     * console.log(wallet.boostToken)
     * console.log(wallet.voiceToken)
     * ```
     */
    get(): Promise<GetWalletResponse>
}

export default Wallet