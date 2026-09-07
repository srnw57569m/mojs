const HighrsieEmotes = require("../Constants/Emotes");

class EmotesManager {
    #idToEmote = new Map()
    #nameToEmote = new Map()

    constructor() {
        this.#init()
    }

    #init() {
        for (const emote of HighrsieEmotes) {
            this.#idToEmote.set(emote.id, emote)
        }

        for (const emote of HighrsieEmotes) {
            this.#nameToEmote.set(emote.name, emote)
        }
    }

    getById(emoteId) {
        if (!emoteId || typeof emoteId !== 'string') return null
        
        return this.#idToEmote.get(emoteId) || null
    }

    getByName(emoteName) {
        if (!emoteName || typeof emoteName !== 'string') return null

        return this.#nameToEmote.get(emoteName) || null
    }

    getByIndex(index) {
        if (index < 0 || typeof index !== 'number') return null
        return [...this.#idToEmote.values()][index] || null
    }

    getIndexByName(emoteName) {
        if (!emoteName || typeof emoteName !== 'string') return null

        const index = [...this.#idToEmote.values()].findIndex((emote) => emote.name?.toLowerCase() === emoteName?.toLowerCase())
        return index !== -1 ? index : null
    }

    getAll() {
        return Array.from(this.#idToEmote.values())
    }

    get size() {
        return this.#idToEmote.size;
    }
}

module.exports = EmotesManager