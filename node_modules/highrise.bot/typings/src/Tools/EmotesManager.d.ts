import { Emote } from "../../interfaces";

/**
 * Manager for handling Highrise emotes.
 * Provides methods to retrieve emotes by ID, name, index, and more.
 * 
 * @example
 * ```typescript
 * const { EmotesMangaer } = require("highrise.bot")
 * 
 * const emoteManager = new EmotesMangaer();
 * 
 * // Get an emote by ID
 * const kissEmote = emoteManager.getById("sit-idle-cute");
 * 
 * // Get an emote by name
 * const laughingEmote = emoteManager.getByName("Rest");
 * 
 * // Get all emotes
 * const allEmotes = emoteManager.getAll();
 * 
 * // Get total number of emotes
 * console.log(emoteManager.size); // 260
 * ```
 */
declare class EmotesManager {
    /**
     * Creates a new EmotesManager instance.
     * Initializes internal maps for ID and name lookups.
     */
    constructor();

    /**
     * Retrieves an emote by its unique ID.
     * 
     * @param emoteId - The emote ID to search for (e.g., "sit-idle-cute")
     * @returns The emote object if found, otherwise null
     * 
     * @example
     * ```typescript
     * const emote = emoteManager.getById("sit-idle-cute");
     * if (emote) {
     *     console.log(emote.name); // "Rest"
     * }
     * ```
     */
    getById(emoteId: string): Emote | null;

    /**
     * Retrieves an emote by its name.
     * 
     * @param emoteName - The emote name to search for (e.g., "Rest")
     * @returns The emote object if found, otherwise null
     * 
     * @example
     * ```typescript
     * const emote = emoteManager.getByName("Rest");
     * if (emote) {
     *     console.log(emote.id); // "sit-idle-cute"
     *     console.log(emote.duration); // 17.06
     * }
     * ```
     */
    getByName(emoteName: string): Emote | null;

    /**
     * Retrieves an emote by its index position in the internal list.
     * 
     * @param index - Zero-based index position of the emote
     * @returns The emote object if found, otherwise null
     * 
     * @example
     * ```typescript
     * // Get the first emote
     * const firstEmote = emoteManager.getByIndex(0);
     * 
     * // Get the last emote
     * const lastEmote = emoteManager.getByIndex(emoteManager.size - 1);
     * ```
     */
    getByIndex(index: number): Emote | null;

    /**
     * Finds the Zero-based index position of an emote by its name.
     * 
     * @param emoteName - The emote name to search for
     * @returns The Zero-based index position, or null if not found
     * 
     * @example
     * ```typescript
     * const position = emoteManager.getIndexByName("Rest");
     * if (position) {
     *     console.log(`Kiss is emote #${position}`);
     * }
     * ```
     */
    getIndexByName(emoteName: string): number | null;

    /**
     * Gets the total number of emotes available.
     * 
     * @returns The total count of emotes (260)
     * 
     * @example
     * ```typescript
     * console.log(`There are ${emoteManager.size} emotes available`);
     * ```
     */
    get size(): number;

    /**
     * Retrieves all emotes as an array.
     * 
     * @returns An array containing all emote objects
     * 
     * @example
     * ```typescript
     * const allEmotes = emoteManager.getAll();
     * allEmotes.forEach(emote => {
     *     console.log(`${emote.name}: ${emote.id} (${emote.duration}s)`);
     * });
     * ```
     */
    getAll(): Emote[];
}

export default EmotesManager;