/**
 * Represents a Highrise clothing item that can be equipped to a bot.
 * Provides a convenient constructor for creating outfit items without writing
 * raw objects by hand.
 * 
 * @example
 * ```javascript
 * const shirt = new OutfitItem('shirt-f_marchingband', 2);
 * const hat = new OutfitItem('hat-beanie');
 * 
 * await bot.inventory.outfit.set([shirt, hat]);
 * ```
 */
declare class OutfitItem {
    /** The unique identifier of the item (e.g., "shirt-f_marchingband") */
    id: string;
    
    /** The category of the item (always "clothing") */
    type: string;
    
    /** Quantity of the item */
    amount: number;
    
    /** Whether the item is bound to the account */
    account_bound: boolean;
    
    /** The active color palette index */
    active_palette: number;

    /**
     * Creates a new OutfitItem instance
     * @param id - The unique item identifier (e.g., "shirt-f_marchingband")
     * @param palette - The color palette index to apply (default: 0)
     * @param amount - Quantity of the item (default: 1)
     * @param isBound - Whether the item is account bound (default: false)
     */
    constructor(id: string, palette?: number, amount?: number, isBound?: boolean);
}

export default OutfitItem