const fs = require("fs")

class Roles {
    #roles = new Map()
    #fileSaveInterval
    #roomFetchInterval
    #protectedRoles = new Set(["owner", "mod"])
    #state
    #logger
    #webapi
    #persistPath

    constructor(ctx, webapi) {
        this.#state = ctx.state
        this.#logger = ctx.logger
        this.#webapi = webapi
        this.#persistPath = ctx.configs.roles.persistPath
        this.#fileSaveInterval = ctx.configs.roles.fileSaveInterval
        this.#roomFetchInterval = ctx.configs.roles.roomFetchInterval

        this.#init().catch(err => {
            this.#logger.warn('Roles', `Failed to initialize roles: ${err.message}`)
        })
    }

    async #init() {
        if (this.#persistPath) {
            this.#loadFromFile()
        }

        await this.#fetchAndSync()

        if (this.#persistPath) {
            this.#saveToFile()
            this.#startSaveInterval()
        }

        this.#startInterval()
    }

    #loadFromFile() {
        try {
            if (!fs.existsSync(this.#persistPath)) return this.#logger.warn('Roles', `Failed to initialize roles: ${this.#persistPath} not found.`)

            const raw = fs.readFileSync(this.#persistPath, "utf-8")
            const saved = JSON.parse(raw)

            for (const [role, users] of Object.entries(saved)) {
                if (this.#roles.has(role)) {
                    const existing = this.#roles.get(role)
                    for (const user of users) existing.add(user)
                } else {
                    this.#roles.set(role, new Set(users))
                }
            }

            this.#logger.info("Roles", "Roles loaded from file.")
        } catch (err) {
            this.#logger.warn("Roles", `Failed to load roles from file: ${err.message}`)
        }
    }

    #saveToFile() {
        try {
            const serialized = Object.fromEntries(
                [...this.#roles.entries()].map(([role, users]) => [role, [...users]])
            )

            fs.writeFileSync(this.#persistPath, JSON.stringify(serialized, null, 2), "utf-8")
        } catch (err) {
            this.#logger.error("Roles", `Failed to save roles to file: ${err.message}`)
        }
    }

    #startSaveInterval() {
        const interval = setInterval(() => {
            this.#saveToFile()
        }, this.#fileSaveInterval)

        this.#state.get("intervals").push(interval)
    }

    #startInterval() {
        const interval = setInterval(async () => {
            await this.#fetchAndSync()
        }, this.#roomFetchInterval)

        this.#state.get("intervals").push(interval)
    }

    async #fetchAndSync() {
        const room = await this.#fetchRoom()
        if (!room) return

        const ownerId = room.ownerId;
        const moderators = new Set([...room.moderatorIds, ownerId]);

        this.#roles.set("owner", new Set([ownerId]));
        this.#roles.set("mod", moderators);
    }

    async #fetchRoom() {
        const { roomId } = this.#state.get("credential")
        if (!roomId) {
            this.#logger.warn("Roles", "No room ID found in credentials. Skipping role initialization.")
            return null
        }

        const room = await this.#webapi.rooms.get(roomId)
        if (!room.ok) {
            this.#logger.warn("Roles", `Failed to fetch room data, Skipping role initialization.`)
            return null
        }

        return room
    }

    hasRole(userId, role) {
        return this.#roles.get(role)?.has(userId) ?? false
    }

    hasAnyRole(userId, roles) {
        return roles.some(role => this.hasRole(userId, role))
    }

    hasAllRoles(userId, roles) {
        return roles.every(role => this.hasRole(userId, role))
    }

    addRole(userId, role) {
        if (this.#protectedRoles.has(role)) return false

        if (!this.#roles.has(role)) {
            this.#roles.set(role, new Set())
        }

        const users = this.#roles.get(role)
        if (users.has(userId)) return false

        users.add(userId)
        return true
    }

    removeRole(userId, role) {
        if (this.#protectedRoles.has(role)) return false

        const users = this.#roles.get(role)
        if (!users) return false

        const hadRole = users.has(userId)
        users.delete(userId)
        return hadRole
    }

    getUsersByRole(role) {
        return [...(this.#roles.get(role) ?? [])]
    }

    getRoles(userId) {
        return [...this.#roles.entries()]
            .filter(([, users]) => users.has(userId))
            .map(([role]) => role)
    }

    setRoles(userId, roles) {
        this.clearRoles(userId)
        roles.forEach(role => this.addRole(userId, role))
        return true
    }

    clearRoles(userId) {
        for (const [role, users] of this.#roles) {
            if (this.#protectedRoles.has(role)) continue
            users.delete(userId)
        }
        return true
    }

    isOwner(userId) {
        return this.hasRole(userId, "owner")
    }

    isModerator(userId) {
        return this.hasRole(userId, "mod")
    }

    destroy() {
      if (this.#persistPath) this.#saveToFile()  
    }
}

module.exports = Roles