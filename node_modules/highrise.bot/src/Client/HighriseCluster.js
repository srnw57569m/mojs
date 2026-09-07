const EventEmitter = require('node:events')
const Highrise = require('./Highrise')
const { EventToListener } = require('../Constants/WebsocketConstants')
const Validator = require('../Tools/Validator')
const Logger = require('../Tools/Logger')

class HighriseCluster extends EventEmitter {
    #validator = new Validator()
    #log = new Logger('HighriseCluster')
    #bots = new Map()          // token -> { bot, token, roomId }
    #roomIndex = new Map()     // roomId -> Set<token>
    #wiredBots = new WeakSet()
    #started = false

    constructor() {
        super()
        this.setMaxListeners(0)

        const handleShutdown = () => {
            this.#log.warn('HighriseCluster', 'Shutdown signal received. Cleaning up all bots...')
            this.destroyAll()
            process.exit(0)
        }

        process.once("SIGINT", handleShutdown)
        process.once("SIGTERM", handleShutdown)
    }

    destroyAll() {
        for (const { bot } of this.#bots.values()) {
            try {
                bot.destroy()
            } catch (err) {
                this.#log.error('HighriseCluster', `Failed to destroy bot: ${err.message}`)
            }
        }

        this.#bots.clear()
        this.#roomIndex.clear()
    }

    #wireEvents(bot) {
        if (this.#wiredBots.has(bot)) return
        this.#wiredBots.add(bot)

        for (const event of this.eventNames()) {
            this.#validator.oneOf(event, Object.keys(EventToListener), `HighriseCluster Events`)
            bot.on(event, (...args) => this.emit(event, bot, ...args))
        }
    }

    #indexRoom(roomId, token) {
        if (!this.#roomIndex.has(roomId)) {
            this.#roomIndex.set(roomId, new Set())
        }
        this.#roomIndex.get(roomId).add(token)
    }

    #unindexRoom(roomId, token) {
        const tokens = this.#roomIndex.get(roomId)
        if (!tokens) return

        tokens.delete(token)
        if (!tokens.size) this.#roomIndex.delete(roomId)
    }

    add(token, roomId, options = {}) {
        this.#validator
            .required(token, "token")
            .string(token, "token")
            .required(roomId, "roomId")
            .string(roomId, "roomId")

        if (this.#bots.has(token)) {
            this.#log.warn('HighriseCluster', `Bot with this token already exists, skipping.`)
            return this
        }

        const bot = new Highrise(options)
        this.#bots.set(token, { bot, token, roomId })
        this.#indexRoom(roomId, token)

        if (this.#started) {
            this.#wireEvents(bot)
            bot.login(token, roomId)
        }

        return this
    }

    login() {
        this.#started = true

        for (const [token, { bot, roomId }] of this.#bots) {
            this.#wireEvents(bot)
            bot.login(token, roomId)
        }

        return this
    }

    logout() {
        for (const { bot } of this.#bots.values()) {
            bot.logout()
        }
        return this
    }

    getByToken(token) {
        this.#validator
            .required(token, "token")
            .string(token, "token")

        return this.#bots.get(token)?.bot ?? null
    }

    getByRoom(roomId) {
        this.#validator
            .required(roomId, "roomId")
            .string(roomId, "roomId")

        const tokens = this.#roomIndex.get(roomId)
        if (!tokens?.size) return null

        const bots = [...tokens].map(token => this.#bots.get(token).bot)
        return bots.length === 1 ? bots[0] : bots
    }

    getAll() {
        return [...this.#bots.values()].map(({ bot }) => bot)
    }

    removeByToken(token) {
        this.#validator
            .required(token, "token")
            .string(token, "token")

        const entry = this.#bots.get(token)
        if (!entry) return false

        entry.bot.destroy()
        this.#bots.delete(token)
        this.#unindexRoom(entry.roomId, token)
        return true
    }

    removeByRoom(roomId) {
        this.#validator
            .required(roomId, "roomId")
            .string(roomId, "roomId")

        const tokens = this.#roomIndex.get(roomId)
        if (!tokens?.size) return false

        for (const token of [...tokens]) {
            this.#bots.get(token).bot.destroy()
            this.#bots.delete(token)
        }

        this.#roomIndex.delete(roomId)
        return true
    }

    reconnectByToken(token) {
        this.#validator
            .required(token, "token")
            .string(token, "token")

        const bot = this.getByToken(token)
        if (!bot) return false

        bot.reconnect()
        return true
    }

    reconnectByRoom(roomId) {
        this.#validator
            .required(roomId, "roomId")
            .string(roomId, "roomId")

        const tokens = this.#roomIndex.get(roomId)
        if (!tokens?.size) return false

        for (const token of tokens) {
            this.#bots.get(token).bot.reconnect()
        }

        return true
    }

    reconnectAll() {
        for (const { bot } of this.#bots.values()) {
            bot.reconnect()
        }
    }

    get size() {
        return this.#bots.size
    }
}

module.exports = HighriseCluster