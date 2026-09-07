import Highrise, { LoginOptions } from '../Highrise'
import { EventMap } from '../Highrise/EventMap'

/**
 * Manages multiple Highrise bots across multiple rooms from a single process.
 * All events from every bot are aggregated into a single event emitter with
 * the bot instance prepended as the first argument.
 * 
 * @example
 * ```js
 * const cluster = new HighriseCluster()
 * 
 * cluster
 *     .add("token1", "roomId1")
 *     .add("token2", "roomId2")
 * 
 * cluster.on("Chat", async (bot, user, message) => {
 *     await bot.message.send(`Hello ${user.username}!`)
 * })
 * 
 * cluster.login()
 * ```
 */
declare class HighriseCluster {
    /**
     * The number of bots currently in the cluster.
     */
    get size(): number

    /**
     * Adds a bot to the cluster, indexed by both token and room ID.
     * If the cluster has already been started, the bot is wired and logged in immediately.
     * @param token The authentication token for the bot.
     * @param roomId The room ID the bot will connect to.
     * @param options Optional configuration options for the bot.
     * @returns The cluster instance for chaining.
     */
    add(token: string, roomId: string, options?: LoginOptions): this

    /**
     * Starts all bots in the cluster by wiring event forwarding and calling `login()` on each one.
     * @returns The cluster instance for chaining.
     */
    login(): this

    /**
     * Disconnects all bots in the cluster.
     * @returns The cluster instance for chaining.
     */
    logout(): this

    /**
     * Retrieves a specific bot by its authentication token.
     * @param token The token of the bot to retrieve.
     * @returns The bot instance, or `null` if not found.
     */
    getByToken(token: string): Highrise | null

    /**
     * Retrieves bot(s) by room ID.
     * @param roomId The room ID to look up.
     * @returns A single bot if only one exists in the room, an array if multiple bots share the room, or `null` if none found.
     */
    getByRoom(roomId: string): Highrise | Highrise[] | null

    /**
     * Returns all bot instances in the cluster.
     */
    getAll(): Highrise[]

    /**
     * Removes a bot from the cluster by its authentication token and disconnects it.
     * @param token The token of the bot to remove.
     * @returns `true` if removed successfully, `false` if not found.
     */
    removeByToken(token: string): boolean

    /**
     * Removes all bots in a room from the cluster and disconnects them.
     * @param roomId The room ID to remove all bots from.
     * @returns `true` if any bots were removed, `false` if none found.
     */
    removeByRoom(roomId: string): boolean

    /**
     * Reconnects a specific bot by its authentication token.
     * @param token The token of the bot to reconnect.
     * @returns `true` if reconnected successfully, `false` if not found.
     */
    reconnectByToken(token: string): boolean

    /**
     * Reconnects all bots in a specific room.
     * @param roomId The room ID to reconnect all bots in.
     * @returns `true` if any bots were reconnected, `false` if none found.
     */
    reconnectByRoom(roomId: string): boolean

    /**
     * Reconnects all bots in the cluster.
     */
    reconnectAll(): void

    /**
     * Destroys and removes all bots in the cluster, calling `destroy()` on each one.
     * Automatically called on `SIGINT` and `SIGTERM`.
     */
    destroyAll(): void

    on<K extends keyof EventMap>(event: K, listener: (bot: Highrise, ...args: EventMap[K]) => Promise<void>): this
    on(event: string, listener: (bot: Highrise, ...args: any[]) => Promise<void>): this

    once<K extends keyof EventMap>(event: K, listener: (bot: Highrise, ...args: EventMap[K]) => Promise<void>): this
    once(event: string, listener: (bot: Highrise, ...args: any[]) => Promise<void>): this

    off<K extends keyof EventMap>(event: K, listener: (bot: Highrise, ...args: EventMap[K]) => void | Promise<void>): this
    off(event: string, listener: (bot: Highrise, ...args: any[]) => void | Promise<void>): this

    emit<K extends keyof EventMap>(event: K, bot: Highrise, ...args: EventMap[K]): boolean
    emit(event: string, bot: Highrise, ...args: any[]): boolean
}

export default HighriseCluster