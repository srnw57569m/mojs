import {
    AnchorPosition,
    Conversation,
    Currency,
    Message,
    ModerationAction,
    Moderator,
    Position,
    Receiver,
    Sender,
    Target,
    User,
    VoiceUser,
    Metadata
    
} from "highrise.bot/typings/interfaces";

/**
 * A mapping of Highrise event names to their respective callback arguments.
 */
interface EventMap {
    /** Emitted once the bot has successfully authenticated and received session metadata. */
    Ready: [metadata: Metadata];

    /** Emitted when a user sends a message in the room. */
    Chat: [user: User, message: Message];

    /** Emitted when the bot receives a private whisper from a user in the same room. */
    Whisper: [user: User, message: Message];

    /** Emitted when a user enters the room, including their initial spawn position. */
    UserJoined: [user: User, position: Position];

    /** Emitted when a user leaves the current room. */
    UserLeft: [user: User];

    /** Emitted when a message is received on a the hidden channel. */
    Channel: [botId: string, message: string, tags: string[]];

    /** Emitted when a tip (currency) is exchanged between two players. */
    Tip: [sender: Sender, receiver: Receiver, currency: Currency];

    // /**
    //  *  Emitted when there is an update to the room's voice status.
    //  * @param users List of users currently in the voice session.
    //  * @param secondsLeft Remaining time for the voice session.
    //  * @param ended Whether the voice session has ended.
    //  */
    // Voice: [users: VoiceUser[], secondsLeft: number, ended: boolean];

    /** Emitted when the bot emote on a user or a user perform an emote (not tested) */
    Emote: [user: User, emoteId: string, receiver: Receiver];

    /** Emitted when the bot receives a Direct Message (DM) outside of a room. */
    Direct: [user: User, message: Message, conversation: Conversation];

    /** Emitted when a moderation action (kick, ban, mute) occurs in the room. */
    Moderation: [moderator: Moderator, target: Target, action: ModerationAction];

    /**
     * Emitted when a player moves or changes their position in the room. 
     * `position` or `anchor` may be null if the player is in a transitional state (sitting, walking).
     */
    Movement: [user: User, position: Position | null, anchor: AnchorPosition | null];
}

export { EventMap, Metadata }