import { GetBotOutfitResponse } from "highrise.bot/typings/src/ResponseModels/InventoryResponses"
import { OutfitItem } from "highrise.bot/typings/interfaces";
import AcknowledgmentResponse from "highrise.bot/typings/src/ResponseModels/AcknowledgmentResponse";

/**
* Handles bot outfit-related requests such as getting the bot outfit or setting new one.
*/
declare class Outfit {
    /**
     * Get the outfit of the bot
     * @returns A promise that resolves to an {@link GetBotOutfitResponse} containing outfit items and count
     * @example
     * ```javascript
     * const result = await bot.inventory.outfit.get()
     * if (result.hasError()) console.log(result.error)
     * console.log(result.outfit)
     * console.log(result.count)
     * ```
     */
    get(): Promise<GetBotOutfitResponse>;

    /**
     * Removes an item from the bot's current outfit.
     * @param itemId - the item Id to be removed.
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * // Remove an item
     * const response = await bot.inventory.outfit.remove("shirt-f_marchingband");
     * if (response.ok) {
     *   console.log("Item removed successfully");
     * }
     * ```
     */
    remove(itemId: string): Promise<AcknowledgmentResponse>;

    /**
     * Updates the provided item Id color.
     * @param itemId - The item Id to change it color
     * @param colorIndex - Color index to be changed to.
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * // Change color of the body
     * const response = await bot.inventory.outfit.color("body-flesh", 6);
     * if (response.ok) {
     *   console.log("color changed successfully");
     * }
     * ```
     */
    color(itemId: string, colorIndex: number): Promise<AcknowledgmentResponse>;

    /**
     * Adds an item to the bot's outfit.
     * @param outfitItem - The item to add.
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result.
     * @example
     * ```javascript
     * const newItem = new OutfitItem("shirt-f_marchingband");
     * const response = await bot.inventory.outfit.add(newItem);
     * if (!response.hasError()) {
     *   console.log("Item added successfully");
     * }
     * ```
     */
    add(outfitItem: OutfitItem): Promise<AcknowledgmentResponse>;

    /**
     * Updates the bot's current outfit.
     * If no outfit is provided, the bot resets to its default appearance.
     * @param outfit - An array of items to equip. Leave empty or undefined to reset to default.
     * @returns A promise that resolves to an {@link AcknowledgmentResponse} result containing `ok` property.
     * @example
     * ```javascript
     * // Reset to default outfit
     * const response = await bot.inventory.outfit.set();
     * if (response.ok) {
     *   console.log("Reset to default outfit successfully");
     * }
     * ```
     */
    set(outfit?: OutfitItem[]): Promise<AcknowledgmentResponse>;
}

export { Outfit }
export default Outfit