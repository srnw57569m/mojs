import { Position, AnchorPosition } from "highrise.bot/typings/interfaces";
import BaseResponse from "highrise.bot/typings/src/Base/BaseResponse";
import { UserEntry } from 'highrise.bot/typings/src/Api/Room/Users'

/** Highrise api response for room user fetch request */
declare class GetRoomUsersResponse extends BaseResponse {
    /**
     * Array of all users and their positions in the room
     */
    users: UserEntry[];

    /**
     * Find a user entry by their id or username
     * @param identifier - The user's id or username
     * @returns The UserEntry or null if not found
     * @example
     * ```javascript
     * const entry = room.find('yahya')
     * if (entry) console.log(entry.user, entry.position)
     * ```
     */
    find(identifier: string): UserEntry | null;

    /**
     * Check if a user is in the room by their id or username
     * @param identifier - The user's id or username
     * @returns True if the user is in the room, false otherwise
     * @example
     * ```javascript
     * const inRoom = room.has('yahya')
     * if (inRoom) await bot.message.send('yahya is here!')
     * ```
     */
    has(identifier: string): boolean;

    /**
     * Get the total number of users in the room
     * @returns The number of users currently in the room
     * @example
     * ```javascript
     * const total = room.count()
     * await bot.message.send(`There are ${total} users in the room`)
     * ```
     */
    count(): number;

    /**
     * Get a user's username by their id
     * @param userId - The user's id
     * @returns The username or null if not found
     * @example
     * ```javascript
     * const username = room.username('userId')
     * ```
     */
    username(userId: string): string | null;

    /**
     * Get a user's id by their username
     * @param username - The user's username
     * @returns The user id or null if not found
     * @example
     * ```javascript
     * const id = room.userId('yahya')
     * ```
     */
    userId(username: string): string | null;

    /**
     * Get a user's position by their id or username
     * @param identifier - The user's id or username
     * @returns The user's Position or AnchorPosition or null if not found
     * @example
     * ```javascript
     * const pos = room.position('yahya')
     * if (pos) console.log(pos.x, pos.y, pos.z)
     * ```
     */
    position(identifier: string): Position | AnchorPosition | null;
}

/** Highrise api response for room voice check */
declare class CheckVoiceChatResponse extends BaseResponse {
    /**
     * Seconds left in the current voice chat session
     */
    secondsLeft: number;

    /**
     * List of auto speakers in the voice chat
     */
    speakers: string[];
}

/** Highrise api response for room privilege */
declare class GetRoomPrivilegeResponse extends BaseResponse {
    /**
     * Whether the user is a moderator in the room or not
     */
    moderator: boolean;

    /**
     * Whether the user is a designer in the room or not
     */
    designer: boolean;
}

export { 
    GetRoomUsersResponse, 
    CheckVoiceChatResponse,
    GetRoomPrivilegeResponse
}