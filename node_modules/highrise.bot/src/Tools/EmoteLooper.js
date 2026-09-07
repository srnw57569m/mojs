class EmoteLoop {
    #playerApi
    #emotesManager
    #loops = new Map()

    constructor(playerApi, emotesManager) {
        this.#playerApi = playerApi
        this.#emotesManager = emotesManager
    }

    #emote(emote_id, user_id) {
        return this.#playerApi.emote(emote_id, user_id)
    }

    #getEmote(identifier) {
        return this.#emotesManager.getByName(identifier) ||
            this.#emotesManager.getById(identifier) ||
            this.#emotesManager.getByIndex(Number(identifier) - 1)
    }

    async start(user, identifier) {
        const emote = this.#getEmote(identifier)
        if (!emote) return null

        const existing = this.#loops.get(user.id)
        if (existing?.emote.id === emote.id) return null

        this.stop(user.id)

        const generation = Symbol()

        const loop = async () => {
            const current = this.#loops.get(user.id)
            if (!current || current.generation !== generation) return

            const result = await this.#emote(emote.id, user.id)

            const currentAfter = this.#loops.get(user.id)
            if (!currentAfter || currentAfter.generation !== generation) return

            if (result.hasError()) {
                this.#loops.delete(user.id)
                return
            }

            const timeoutId = setTimeout(loop, emote.duration * 1000)
            this.#loops.set(user.id, { timeoutId, user, emote, generation })
        }

        this.#loops.set(user.id, { timeoutId: null, user, emote, generation })
        await loop()
        return emote
    }

    stop(userId) {
        const loop = this.#loops.get(userId)
        if (!loop) return

        clearTimeout(loop.timeoutId)
        this.#loops.delete(userId)
        return loop.emote
    }

    destroy() {
        for (const loop of this.#loops.values()) clearTimeout(loop.timeoutId)
        this.#loops.clear()
    }
}

module.exports = EmoteLoop