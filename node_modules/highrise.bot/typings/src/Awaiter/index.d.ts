import { AnchorPosition, Conversation, Currency, Message, Position, Receiver, Sender, User } from "../../interfaces"

/**
 * Base options for configuring an awaiter.
 */
interface BaseAwaiterOptions {
    /** Timeout in milliseconds before the awaiter resolves with an empty array (default: `30000`) */
    timeout?: number
    /** Maximum number of events to collect before resolving (default: `1`) */
    maxToCollect?: number
    /** Whether to only collect events from unique users (default: `false`) */
    uniqueUsers?: boolean
}

interface ChatAwaiterOptions extends BaseAwaiterOptions {
    /** Filter function to match specific chat events */
    filter?: (user: User, message: Message) => boolean
}

interface DirectAwaiterOptions extends BaseAwaiterOptions {
    /** Filter function to match specific direct message events */
    filter?: (user: User, message: Message, conversation: Conversation) => boolean
}

interface TipAwaiterOptions extends BaseAwaiterOptions {
    /** Filter function to match specific tip events */
    filter?: (sender: Sender, receiver: Receiver, currency: Currency) => boolean
}

interface MovementAwaiterOptions extends BaseAwaiterOptions {
    /** Filter function to match specific movement events */
    filter?: (user: User, position: Position | null, anchor: AnchorPosition | null) => boolean
}

declare class AwaitClass {
    /**
     * Waits for one or more chat messages to be sent in the room.
     * * Resolves with a single `[User, Message]` tuple when `maxToCollect` is `1`,
     * or an array of tuples when collecting multiple messages.
     * * Resolves with whatever was collected so far if the timeout is reached before `maxToCollect` is met.
     * * Resolves with an empty array if the timeout is reached before any messages are collected.
     * @param options Awaiter options.
     * 
     * @example
     * ```js
     * const [user, message] = await bot.await.chat({
     *     filter: (user, message) => message.content.includes("hello"),
     *     timeout: 10000
     * })
     * ```
     */
    chat(options?: ChatAwaiterOptions): Promise<[User, Message] | [User, Message][] | []>

    /**
     * Waits for one or more direct messages to be received outside of a room.
     * * Resolves with a single `[User, Message, Conversation]` tuple when `maxToCollect` is `1`,
     * or an array of tuples when collecting multiple messages.
     * * Resolves with whatever was collected so far if the timeout is reached before `maxToCollect` is met.
     * * Resolves with an empty array if the timeout is reached before any messages are collected.
     * @param options Awaiter options.
     * 
     * @example
     * ```js
     * const [user, message, conversation] = await bot.await.direct({
     *     filter: (user) => user.id === "123"
     * })
     * ```
     */
    direct(options?: DirectAwaiterOptions): Promise<[User, Message, Conversation] | [User, Message, Conversation][] | []>

    /**
     * Waits for one or more tip events to occur between players in the room.
     * * Resolves with a single `[Sender, Receiver, Currency]` tuple when `maxToCollect` is `1`,
     * or an array of tuples when collecting multiple tips.
     * * Resolves with whatever was collected so far if the timeout is reached before `maxToCollect` is met.
     * * Resolves with an empty array if the timeout is reached before any tips are collected.
     * @param options Awaiter options.
     * 
     * @example
     * ```js
     * const [sender, receiver, currency] = await bot.await.tip({
     *     filter: (sender, receiver) => receiver.id === bot.metadata.userId
     * })
     * ```
     */
    tip(options?: TipAwaiterOptions): Promise<[Sender, Receiver, Currency] | [Sender, Receiver, Currency][] | []>

    /**
     * Waits for one or more movement events to occur in the room.
     * * Resolves with a single `[User, Position | null, AnchorPosition | null]` tuple when `maxToCollect` is `1`,
     * or an array of tuples when collecting multiple movements.
     * `position` or `anchor` may be `null` if the player is in a transitional state.
     * * Resolves with whatever was collected so far if the timeout is reached before `maxToCollect` is met.
     * * Resolves with an empty array if the timeout is reached before any movements are collected.
     * @param options Awaiter options.
     * 
     * @example
     * ```js
     * const [user, position] = await bot.await.movement({
     *     filter: (user) => user.id === "123"
     * })
     * ```
     */
    movement(options?: MovementAwaiterOptions): Promise<[User, Position | null, AnchorPosition | null] | [User, Position | null, AnchorPosition | null][] | []>
}

export { AwaitClass }