import { ItemResponse, ItemsResponse, ItemsSearchResponse } from "../../../ResponseModels/WebApi/ItemsResponses";

interface GetItemsParams {
    /** Maximum number of items to return */
    limit?: number;
    /** Order of results (e.g. `"asc"` | `"desc"`) */
    sortOrder?: "asc" | "desc"
    /** Filter items by item name */
    itemName?: string;
    /** Filter items by item category */
    category?: string;
    /** Filter items by item rarity */
    rarity?: string;
    /** Return items after this ItemId (pagination) */
    startsAfter?: string;
    /** Return items before this ItemId (pagination) */
    endsBefore?: string;
}

/** Represents the Highrise WebApi `/items` endpoint */
declare class ItemsEndpoint {

    /**
     * Fetches data for a specific item from the WebApi
     * @param ItemID The item ID to fetch
     * @note expect some errors like getting `500 Internal Server` error.
     * @returns A promise that resolves to a {@link ItemResponse} containing the item's data
     * @example
     * ```javascript
     * const res = await bot.webapi.items.get("ItemID")
     * console.log(res)
     * ```
     */
    get(ItemID: string): Promise<ItemResponse>

    /**
     * Search a list of items from the WebApi.
     * @param itemName The name of the item to search for.
     * @param limit The maximum number of items to return.
     * @param skip The number of items to skip.
     * 
     * @returns A promise that resolves to a {@link ItemsSearchResponse} containing the items data and pagination method.
     */
    search(itemName: string, limit: number, skip: number): Promise<ItemsSearchResponse>

    /**
     * Fetches a filtered list of items from the WebApi.
     * @param params WebApi filtering options.
     * @note This endpoint does not return emotes.
     * @returns A promise that resolves to a {@link ItemsResponse} containing the items data and pagination method.
     */
    list(params: GetItemsParams): Promise<ItemsResponse>
}

export default ItemsEndpoint