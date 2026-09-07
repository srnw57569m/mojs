/**
 * Represents a Highrise user facing type
 */
export type Facing = "FrontRight" | "FrontLeft" | "BackRight" | "BackLeft"

/**
 * Represents result message for buying result
 */
export type BuyingResult = "success" | "insufficient_funds" | "only_token_bought"

/**
 * Represents result message for tip result
 */
export type TipResult = "success" | "insufficient_funds"

/**
 * Represents a Highrise Reaction type
 */
export type Reactions = 'clap' | 'heart' | 'thumbs' | 'wave' | 'wink'

/**
 * Represents a Highrise gold currency type (1-10,000)
 */
export type Goldbars = 1 | 5 | 10 | 50 | 100 | 500 | 1000 | 5000 | 10000

/**
 * Represents a Highrise conversation type (Id-to-Id)
 */
export type CONV_ID = `1_on_1:${string}:${string}`

/**
 * Represents a Highrise Voice type
 */
export type VoiceStatusType = 'muted' | 'voice';

/**
 * ISO 8601 format: 2026-02-15T16:22:24.175Z
 */
export type ISOString = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;

/**
 * Represents a processed message with utility methods for parsing commands and arguments.
 */
export class Message {
    /** 
     * The raw, trimmed text content of the message. 
     */
    content: string;

    /**
     * The first word of the message, typically used as a command.
     * @example 
     * ```javascript
     * // Message: "!warn user spamming"
     * console.log(message.command()); // "!warn"
     * ```
     */
    command(): string | null;

    /**
     * Retrieves arguments after the command.
     * @param index - Optional index of a specific argument.
     * @returns 
     * - No index: All arguments as a `string[]`.
     * - With index: The specific argument at that position as a `string`, or `null`.
     */
    args(index?: number): string[] | string | null;

    /**
     * Retrieves usernames from the message that start with the "@" symbol.
     * @param index - Optional index of a specific mention.
     * @returns 
     * - No index: An array of mentioned usernames (symbol removed).
     * - With index: The specific username string (symbol removed), or null.
     */
    mentions(index?: number): string[] | string | null;
}

/**
 * Represents a Highrise user object
 */
export interface User {
    id: string;
    username: string;
}

/**
 * Represents a Highrise tip sender object (extended from User)
 */
export interface Sender extends User { }

/**
 * Represents a Highrise tip receiver object (extended from User)
 */
export interface Receiver extends User { }

/**
 * Represents a Highrise room moderator object (extended from User)
 */
export interface Moderator extends User { }

/**
 * Represents a Highrise moderation target object (extended from User)
 */
export interface Target extends User { }

/**
 * Represents a Highrise user position object
 */
export interface Position {
    x: number;
    y: number;
    z: number;
    facing: Facing;
}

/**
 * Represents a Highrise room anchor position object
 */
export interface AnchorPosition {
    entity_id: string;
    anchor_ix: number;
}

/**
 * Represents a Highrise emote object
 */
export interface Emote {
    /** The unique identifier of the emote (e.g., "sit-idle-cute") */
    id: string;
    /** The display name of the emote (e.g., "Rest") */
    name: string | null;
    /** Duration of the emote in seconds */
    duration: number;
}

/**
 * Represents a Highrise currency object
 */
export interface Currency {
    type: string;
    amount: number
}

/**
 * Represents a Highrise user conversation object
 */
export interface Conversation {
    id: CONV_ID;
    isNew: boolean;
}

/**
 * Represents a Highrise Voice event user object
 */
export interface VoiceUser {
    user: User,
    /**
     * Either "muted" or "voice"
     */
    status: VoiceStatusType
}

/**
 * Represents a Highrise Moderation Action object
 */
export interface ModerationAction {
    type: string;
    duration: number
}

/**
 * Represents a Highrise Room metadata sub-object
 */
export interface RoomMetadata {
    ownerId: string;
    roomName: string;
}

/**
 * Represents a Highrise Ready connection metdata object
 */
export interface ConnectionMetadata {
    id: string
    rateLimits: {
        client: [number, number],
        socials: [number, number]
    }
}

/**
 * Represents a Highrise Ready event object
 */
export interface Metadata {
    botId: string;
    room: RoomMetadata;
    connection: ConnectionMetadata
}

/**
 * Represents a Highrise user outfit object
 */
export interface OutfitItem {
    type: string;
    amount: number;
    id: string;
    account_bound: boolean;
    active_palette: number;
}