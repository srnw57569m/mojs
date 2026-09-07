import { GetRoomUsersResponse } from "highrise.bot/typings/src/ResponseModels/RoomResponses";
import { User, Position, AnchorPosition } from "highrise.bot/typings/interfaces";

interface UserEntry {
    user: User;
    position: Position | AnchorPosition;
}

/**
* Handles in-room users related requests such as fetch all players in-room.
*/
declare class Users {
    /**
     * Fetch all users currently in the room
     * @returns A promise that resolves to an {@link GetRoomUsersResponse} containing all users and their positions
     * @example
     * ```javascript
     * const room = await bot.room.users.get()
     * if (room.hasError()) return console.log(room.error)
     * console.log(room.users)
     * ```
     */
    get(): Promise<GetRoomUsersResponse>;

    /**
     * Get a user's username by their id
     * @param userId - The user's id
     * @returns The username or null if not found
     * @example
     * ```javascript
     * const username = await bot.room.users.username('64f1a2b3c4d5e6f7')
     * const username = await bot.room.users.username('Unfairly')
     * ```
     */
    username(userId: string): Promise<string | null>;

    /**
     * Get a user's id by their username
     * @param username - The user's username
     * @returns The user id or null if not found
     * @example
     * ```javascript
     * const id = await bot.room.users.userId('Unfairly')
     * const id = await bot.room.users.userId('64f1a2b3c4d5e6f7')
     * ```
     */
    userId(username: string): Promise<string | null>;

    /**
     * Get a user's position by their id or username
     * @param identifier - The user's id or username
     * @returns The user's Position or AnchorPosition or null if not found
     * @example
     * ```javascript
     * const pos = await bot.room.users.position('Unfairly')
     * if (pos) console.log(pos.x, pos.y, pos.z)
     * ```
     */
    position(identifier: string): Promise<Position | AnchorPosition | null>;

    /**
     * Find a user entry by their id or username
     * @param identifier - The user's id or username
     * @returns The UserEntry or null if not found
     * @example
     * ```javascript
     * const entry = await bot.room.users.find('Unfairly')
     * if (entry) console.log(entry.user, entry.position)
     * ```
     */
    find(identifier: string): Promise<UserEntry | null>;

    /**
     * Check if a user is in the room by their id or username
     * @param identifier - The user's id or username
     * @returns True if the user is in the room, false otherwise
     * @example
     * ```javascript
     * const inRoom = await bot.room.users.has('Unfairly')
     * if (inRoom) await bot.message.send('Unfairly is here!')
     * ```
     */
    has(identifier: string): Promise<boolean>;

    /**
     * Get the total number of users in the room
     * @returns The number of users currently in the room, 0 if error occur
     * @example
     * ```javascript
     * const total = await bot.room.users.count()
     * await bot.message.send(`There are ${total} users in the room`)
     * ```
     */
    count(): Promise<number>;
}

export { Users, UserEntry }