import BaseResponse from "../../Base/BaseResponse";

interface ItemAffiliation {
    /** Unique identifier of the affiliation */
    id: string
    /** Display title of the affiliation (e.g. `"Creature Club Anniversary"`) */
    title: string
    /** Affiliation type (e.g. `"grab"`, `"event"`) */
    type: string
    /** Event type if the affiliation is an event, otherwise `null` */
    eventType: string | null
}

interface RelatedItem {
    /** Unique identifier of the related item */
    itemId: string
    /** Display name of the related item */
    dispName: string
    /** Rarity of the related item (e.g. `"rare"`, `"epic"`, `"legendary"`) */
    rarity: string
}

interface Seller {
    /** Unique identifier of the seller */
    userId: string
    /** Username of the seller */
    username: string
    /** UTC timestamp of when the seller last connected, or `null` if it's private */
    lastConnectedAt: Date | null
}

interface DetailedItem {
    /** Unique identifier of the item */
    itemId: string
    /** Display name of the item */
    itemName: string
    /** Cost to acquire the item */
    acquisitionCost: number
    /** Amount received upon acquisition */
    acquisitionAmount: number
    /** Currency used for acquisition (e.g. `"gems"`, `"gold"`), gems mean tokens */
    acquisitionCurrency: string
    /** Category of the item (e.g. `"eye"`, `"hair"`) */
    category: string
    /** UTC timestamp of when the item was created */
    createdAt: Date
    /** UTC timestamp of when the item was released */
    releaseDate: Date
    /** Item description, or `null` if none */
    descriptionKey: string | null
    /** List of user IDs this item was inspired by */
    inspiredBy: string[]
    /** Whether the item is currently purchasable */
    isPurchasable: boolean
    /** Whether the item can be traded between users */
    isTradable: boolean
    /** URL of the item's full image, or `null` if unavailable */
    imageUrl: string | null
    /** URL of the item's icon, or `null` if unavailable */
    iconUrl: string | null
    /** Rarity of the item (e.g. `"epic"`, `"legendary"`) */
    rarity: string
    /** List of keywords associated with the item */
    keywords: string[]
}

interface RelatedItems {
    /** Affiliations associated with the item (e.g. events, grabs) */
    affiliations: ItemAffiliation[]
    /** List of items related to this item */
    items: RelatedItem[]
}

interface StorefrontListings {
    /** Total number of pages of sellers */
    pages: number
    /** Total number of sellers listing this item */
    total: number
    /** List of sellers currently listing this item */
    sellers: Seller[]
}

declare class ItemResponse extends BaseResponse {
    /** Full detail of the requested item */
    item: DetailedItem
    /** Items and affiliations related to this item */
    relatedItems: RelatedItems
    /** Current storefront listings for this item */
    storefrontListings: StorefrontListings
}

interface SearchItem {
    /** Unique identifier of the item */
    itemId: string
    /** Display name of the item */
    itemName: string
    /** Category of the item (e.g. `"eye"`, `"hair"`) */
    category: string
    /** UTC timestamp of when the item was created */
    createdAt: Date
    /** UTC timestamp of when the item was released */
    releaseDate: Date
    /** Localization key for the item description, or `null` if none */
    descriptionKey: string | null
    /** List of item IDs this item was inspired by */
    inspiredBy: string[]
    /** Whether the item is currently purchasable */
    isPurchasable: boolean
    /** Whether the item can be traded between users */
    isTradable: boolean
    /** Rarity of the item (e.g. `"rare"`, `"epic"`, `"legendary"`) */
    rarity: string
    /** List of keywords associated with the item */
    keywords: string[]
}

interface Item extends SearchItem {}

declare class ItemsSearchResponse extends BaseResponse {
    /** List of items returned by the search */
    items: SearchItem[]
    /** Total number of items matching the search query */
    total: number
    /** Fetches the next batch of items, or `null` if there are no more */
    next(): Promise<ItemsSearchResponse> | null
}

declare class ItemsResponse extends BaseResponse {
    /** List of items returned by WebApi */
    items: Item[]

    /** Total items in Highrise */
    total: number

    /** First Id in `items` property */
    firstId: string | null

    /** Last Id in `items` property */
    lastId: string | null

    /**  Fetches the next batch of items. */
    next(): Promise<ItemsResponse> | null
}

export { 
    ItemResponse,
    ItemsSearchResponse,
    ItemsResponse
}