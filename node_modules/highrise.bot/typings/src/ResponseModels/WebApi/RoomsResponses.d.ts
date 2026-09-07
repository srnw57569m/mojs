import BaseResponse from "../../Base/BaseResponse";

declare class RoomResponse extends BaseResponse {
    /** Unique identifier of the room */
    id: string;

    /** Display name of the room shown to users */
    name: string;

    /** UTC timestamp of when the room was created */
    createdAt: Date;

    /** Defines who can access the room */
    accessPolicy: string;

    /** Category the room belongs to*/
    category: string;

    /** User ID of the room owner */
    ownerId: string;

    /** List of locale codes supported by the room, usually 1 locale */
    locale: string[];

    /** Whether this room is the owner's home room */
    isHome: boolean;

    /** Number of players currently connected to the room */
    playersOnline: number;

    /** List of user IDs with moderator privileges in this room */
    moderatorIds: string[];

    /** List of user IDs with designer privileges in this room */
    designerIds: string[];

    /** description of the room */
    description: string | null;

    /** ID of the crew associated with this room, if any */
    crewId: string | null;

    /** URL of the room's thumbnail image */
    thumbnailUrl: string | null;

    /** URL of the room's banner image */
    bannerUrl: string | null;
}

interface Room {
    /** Unique identifier of the room */
    id: string;

    /** Display name of the room shown to users */
    name: string;

    /** UTC timestamp of when the room was created */
    createdAt: Date;

    /** Defines who can access the room */
    accessPolicy: string;

    /** Category the room belongs to*/
    category: string;

    /** User ID of the room owner */
    ownerId: string;

    /** List of locale codes supported by the room, usually 1 locale */
    locale: string[];

    /** Whether this room is the owner's home room */
    isHome: boolean;

    /** List of user IDs with moderator privileges in this room */
    moderatorIds: string[];

    /** List of user IDs with designer privileges in this room */
    designerIds: string[];

    /** description of the room */
    description: string | null;
}

declare class RoomsResponse extends BaseResponse {
    /** List of rooms returned by WebApi */
    rooms: Room[]

    /** Total rooms in Highrise */
    total: number

    /** First Id in `rooms` property */
    firstId: string

    /** Last Id in `rooms` property */
    lastId: string

    /** 
     * Fetches the next batch of rooms.
     */
    next(): Promise<RoomsResponse> | null
}

export {
    RoomResponse,
    RoomsResponse
}