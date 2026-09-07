import { User } from "highrise.bot/typings/interfaces";

declare class EmoteLoop {
    /**
     * Starts a looping emote for a user.
     * * If the user is already looping the same emote, does nothing.
     * * If the user is looping a different emote, stops it and starts the new one.
     * @param user The user to loop the emote for.
     * @param identifier The emote name, ID, or index to loop. (strings are serialized to number for index internally)
     * @returns The emote that was started, or `null` if the emote was not found or already looping.
     */
    start(user: User, identifier: string): Promise<Emote | null>

    /**
     * Stops the looping emote for a user.
     * @param userId The unique identifier of the user.
     * @returns The emote that was stopped, or `undefined` if no loop was active.
     */
    stop(userId: string): Emote | undefined

    /**
     * Stops all active emote loops and clears all internal state.
     */
    destroy(): void
}

export default EmoteLoop