import { ModeratorPrivilege, DesignerPrivilege } from "highrise.bot/typings/src/Api/Room/Promotion";
import Privilege from "highrise.bot/typings/src/Api/Room/Privilege";
import { Users } from "highrise.bot/typings/src/Api/Room/Users";
import Voice from "highrise.bot/typings/src/Api/Room/Voice";

/**
* Handles in-room related requests such as fetching users, voice, promotion.
*/
declare class RoomApi {
    /**
     * Access and manage users in the room
     */
    users: Users;

    /**
     * Manage voice chat in the room (check, invite, remove)
     */
    voice: Voice;

    /**
     * Manage and check room privileges for users (get, isModerator, isDesigner)
     */
    privilege: Privilege;

    /**
     * Grant or remove moderator privilege from a user
     */
    moderator: ModeratorPrivilege;

    /**
     * Grant or remove designer privilege from a user
     */
    designer: DesignerPrivilege;
}

export { RoomApi }
export default RoomApi