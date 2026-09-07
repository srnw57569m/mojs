declare class Roles {

    /**
     * Checks if a user has a specific role.
     * @param userId The unique identifier of the user.
     * @param role The role to check for.
     */
    hasRole(userId: string, role: string): boolean

    /**
     * Checks if a user has at least one of the specified roles.
     * @param userId The unique identifier of the user.
     * @param roles The list of roles to check against.
     */
    hasAnyRole(userId: string, roles: string[]): boolean

    /**
     * Checks if a user has all of the specified roles.
     * @param userId The unique identifier of the user.
     * @param roles The list of roles to check against.
     */
    hasAllRoles(userId: string, roles: string[]): boolean

    /**
     * Assigns a role to a user.
     * @param userId The unique identifier of the user.
     * @param role The role to assign.
     * @returns `false` if the user already has the role, otherwise `true`.
     * 
     * @note adding to `"mod"` or `"owner"` is restricted to prevent mutation
     */
    addRole(userId: string, role: string): boolean

    /**
     * Removes a role from a user.
     * @param userId The unique identifier of the user.
     * @param role The role to remove.
     * @returns `false` if the role does not exist, `true` if removed successfully.
     * 
     * @note removing from `"mod"` or `"owner"` is restricted to prevent mutation
     */
    removeRole(userId: string, role: string): boolean

    /**
     * Returns all user IDs assigned to a specific role.
     * @param role The role to get users for.
     * @returns An array of user IDs assigned to the role, or an empty array if the role does not exist.
     */
    getUsersByRole(role: string): string[]

    /**
     * Returns all roles assigned to a user.
     * @param userId The unique identifier of the user.
     */
    getRoles(userId: string): string[]

    /**
     * Replaces all roles of a user with the specified roles.
     * @param userId The unique identifier of the user.
     * @param roles The new list of roles to assign.
     * @returns `true` when complete.
     */
    setRoles(userId: string, roles: string[]): true

    /**
     * Removes all roles from a user.
     * @param userId The unique identifier of the user.
     * @returns `true` when complete.
     * 
     * @note `"mod"` or `"owner"` will always be skipped.
     */
    clearRoles(userId: string): true

    /**
     * Checks if a user is the room owner.
     * @param userId The unique identifier of the user.
     */
    isOwner(userId: string): boolean

    /**
     * Checks if a user is a moderator.
     * @param userId The unique identifier of the user.
     */
    isModerator(userId: string): boolean
}

export default Roles