import { EventMap, Metadata } from "../Highrise/EventMap";

import UtilsApi from "../Api/Utils";
import Roles from "../Tools/Roles"
import RoomApi from "../Api/Room";
import ChatApi from "../Api/Message/Chat";
import WhisperApi from "../Api/Message/Whisper";
import PlayerApi from "../Api/Player";
import DirectApi from "../Api/Message/Direct";
import InventoryApi from "../Api/Inventory";
import ChannelApi from "../Api/Message/Channel";
import WebApi from "../Api/WebApi";
import { Roles } from "../Tools/Roles";
import { AwaitClass } from "../Awaiter";
import EmoteLoop from "../Tools/EmoteLooper";
import EmotesManager from "../Tools/EmotesManager";
import Logger, { LogLevel } from "../Tools/Logger";
import HighriseCluster from "../HighriseCluster";

interface RolesOptions {
    /** Path to the file where roles will be persisted (e.g. `"./roles.json"`) */
    persistPath?: string
    /** Interval in milliseconds to save roles to file (default: 7.5 min) */
    fileSaveInterval?: number
    /** Interval in milliseconds to re-fetch room roles (default: 10 min) */
    roomFetchInterval?: number
}

interface LoggerOptions {
    /** Prefix shown in every log line, e.g. `[MyBot]` (default: `"Highrise"`) */
    prefix?: string
    /** Minimum log level shown (default: `"debug"`) */
    level?: LogLevel
}

interface LoginOptions {
    /** Configuration options for the {@link Roles} manager */
    roles?: RolesOptions 
    /** Configuration options for the {@link Logger} */
    logger?: LoggerOptions
}

/**
 * The main class for creating and managing a Highrise bot.
 * 
 * Extends `EventEmitter` to provide a typed event system for handling room events.
 */
declare class Highrise {
    /**
     * Initializes a new instance of the Highrise bot.
     */
    constructor(options?: LoginOptions);

    /** API for handling room chat messages. */
    message: ChatApi;

    /** API for sending private whispers within a room. */
    whisper: WhisperApi;

    /** API for sending and communication between bots in-room */
    channel: ChannelApi;

    /** API for handling Direct Messages (DMs) across the Highrise platform. */
    direct: DirectApi;

    /** API for interacting with the bot's inventory and outfits. */
    inventory: InventoryApi;

    /** API for interacting with room properties, players, and room state. */
    room: RoomApi;

    /** API for interacting and managing player-specific actions. */
    player: PlayerApi;

    /** Utility methods for common bot development tasks. */
    utils: UtilsApi;

    /**
     * Client for interacting with the Highrise WebApi
     * @see https://create.highrise.game/learn/web-api/general/overview
     */
    webapi: WebApi;

    /**
     * Waits for specific events to occur, resolving a promise when the conditions are met.
     * Useful for building interactive bots that need to wait for a user response,
     * collect multiple events, or filter events by specific criteria.
     */
    await: AwaitClass

    /**
     * Manages looping emotes for users in the room.
     * 
     * Automatically repeats an emote for a user after its duration ends,
     * until explicitly stopped or an error occurs. Only one emote loop
     * can be active per user at a time.
     */
    looper: EmoteLoop

    /**
     * Manager for Highrise emotes.
     * Provides methods to retrieve emotes by ID, name, index, and more.
     */
    emotes: EmotesManager

    /**
     * Manages role-based access control for the bot.
     * 
     * Automatically fetches and syncs room moderators and owner on initialization,
     * and refreshes them every 10 minutes. Custom roles can be assigned, removed,
     * and queried at runtime.
     * 
     * Roles can be persisted to a file by setting the `persistPath` option in the
     * {@link Highrise} constructor. The file is saved every 7.5 minutes and on process exit.
     * 
     * @see {@link Roles}
     */
    roles: Roles

    /** 
     * The login credentials used for the current session.
     * @returns An object containing the authentication token and room ID.
     */
    get credential(): { token: string, roomId: string };

    /**
     * The bot's id, room data, and session metadata.
     * @note This property is only populated after the `Ready` event has fired.
     */
    get metadata(): Metadata;

    /**
     * The timestamp (in milliseconds) of the bot's most recent successful connection.
     * This value resets every time the connection is re-established.
     */
    get connectTime(): EpochTimeStamp;

    /**
     * Current bot connection status
     */
    get status(): "Online" | "Offline" | "Connecting" | "Failure" | "Invalid room id" | "API token not found"

    /**
     * Authenticates the bot and establishes a connection to a specific Highrise room.
     * @param token - The unique 64-character authentication token for the bot.
     * @param roomId - The 24-character identifier of the room.
     * @remarks Ensure you have registered essential event listeners (like `Ready` or `Chat`) 
     *          before calling this method, as the connection process triggers them immediately.
     */
    login(token: string, roomId: string): void;

    /**
     * Disconnects from the room and cleanup resources.
     * @remarks 
     * Existing event listeners will remain since they are tied to the {@link Highrise} instance.
     */
    logout(): | void;

    /**
     * Reconnects using the current credentials.
     * @returns A promise that resolves when the reconnection is complete.
     */
    reconnect(): void

    /**
     * Stops all internal managers (roles, emote loop) and logs the bot out.
     * Call this in your own `SIGINT`/`SIGTERM` handlers to ensure roles and
     * other stateful managers persist correctly on shutdown.
     * 
     * @remarks
     * If you're using {@link HighriseCluster}, cleanup is handled automatically
     * and you do not need to call this manually.
     */
    destroy(): void

    /**
     * Updates the authentication token credential while preserving the current room ID.
     * @param newToken The new authentication token.
     */
    setToken(newToken: string): void

    /**
     * Updates the room ID credential while preserving the current authentication token.
     * @param newRoomId The new room ID to connect to.
     */
    setRoomId(newRoomId: string): void

    /**
     * Registers a persistent listener for a specific event.
     * @param event - The name of the event to subscribe to.
     * @param listener - An asynchronous callback function executed when the event triggers.
     * @returns The {@link Highrise} instance for method chaining.
     */
    on<K extends keyof EventMap>(event: K, listener: (...args: EventMap[K]) => Promise<void>): this;
    on(event: string, listener: (...args: any[]) => Promise<void>): this;

    /**
     * Registers a listener that will be invoked at most once. 
     * The listener is automatically removed after the first execution.
     * @param event - The name of the event to subscribe to once.
     * @param listener - An asynchronous callback function.
     * @returns The {@link Highrise} instance for method chaining.
     */
    once<K extends keyof EventMap>(event: K, listener: (...args: EventMap[K]) => Promise<void>): this;
    once(event: string, listener: (...args: any[]) => Promise<void>): this;

    /**
     * Removes a previously registered listener from an event.
     * @param event - The name of the event the listener is attached to.
     * @param listener - The specific callback function to unregister.
     * @returns The {@link Highrise} instance for method chaining.
     */
    off<K extends keyof EventMap>(event: K, listener: (...args: EventMap[K]) => void | Promise<void>): this;
    off(event: string, listener: (...args: any[]) => void | Promise<void>): this;

    /**
     * Synchronously calls each of the listeners registered for a specific event.
     * @param event - The name of the event to trigger.
     * @param args - Arguments to pass to each listener function.
     * @returns `true` if the event had registered listeners; otherwise `false`.
     */
    emit<K extends keyof EventMap>(event: K, ...args: EventMap[K]): boolean;
    emit(event: string, ...args: any[]): boolean;
}

export { Highrise, LoginOptions }
export default Highrise