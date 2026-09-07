import BaseResponse from "../../Base/BaseResponse";

/** A single item piece within a user's outfit */
interface WebApiOutfitItem {
    /** Unique identifier of the item */
    item_id: string,
    /** Display name of the item */
    name: string,
    /** Rarity tier of the item (e.g. Common, Rare, Epic) */
    rarity: string,
    /** Currently selected color palette index for the item */
    active_palette: number
}

/** The room the user is currently active in */
interface WebApiActiveRoom {
    /** Unique identifier of the room */
    id: string,
    /** Display name of the room */
    name: string
}

/** The crew the user has joined */
interface WebApiUserCrew {
    /** Unique identifier of the crew */
    id: string,
    /** Display name of the crew */
    name: string
}

declare class UsersResponse extends BaseResponse {
    /** Unique identifier of the user */
    id: string
    /** Display name of the user */
    username: string
    /** List of items the user is currently wearing */
    outfit: WebApiOutfitItem[]
    /** User's profile bio */
    bio: string

    /** UTC timestamp of when the user created the account */
    joinedAt: Date
    /** UTC timestamp of when the user was last online. Null if the user has set their online status to Hidden */
    lastOnlineIn: Date | null

    /** Number of users following this user */
    followers: number
    /** Number of users this user is following */
    following: number
    /** Number of friends this user has */
    friends: number

    /** The room the user is currently in. Null if the user has set their active room visibility to Hidden */
    activeRoom: WebApiActiveRoom | null

    /** ISO country code of the user's profile location (e.g. IQ, US, IN) */
    countryCode: string
    /** The crew the user has joined, null if not in any crew */
    crew: WebApiUserCrew | null
    /** Whether the user has voice enabled, also indicates the user is +18 age verified */
    voiceEnabled: boolean
    /** The user's linked Discord account ID */
    discordId: string

    /** URL of the user's current avatar icon */
    iconUrl: string
    /** URL of the user's current avatar image */
    avatarUrl: string
    /** The user's current avatar rendered as a stringified SVG element */
    avatarSvg: string
}

export default UsersResponse