const EventEmitter = require('node:events')
const { WebSocket } = require("ws");

const OpenHandler = require('../Networking/WebsocketHandlers/OpenHandler');
const MessageHandler = require('../Networking/WebsocketHandlers/MessageHandler');
const ErrorHandler = require('../Networking/WebsocketHandlers/ErrorHandler');
const CloseHandler = require('../Networking/WebsocketHandlers/CloseHandler');

const KeepAliveHandler = require('../Networking/Core/KeepAlive');
const Sender = require('../Networking/Core/Sender');

const { EventToListener } = require('../Constants/WebsocketConstants');

const Logger = require('../Tools/Logger');
const Validator = require("../Tools/Validator")

const BotContext = require('../Contexts/BotContext');

const BotApi = require('../Api');
const { RolesConfig } = require('../Config/configs');

class HighriseCore extends EventEmitter {
    #keepaliveHandler
    #openHandler
    #messageHandler
    #errorHandler
    #closeHandler

    #validator
    #options
    #logger
    #sender
    #botApi
    #state
    #ctx
    #ws

    constructor(options = {}) {
        super()
        this.setMaxListeners(25)

        this.#ws = null
        this.#state = new Map()
        this.#logger = new Logger(options.logger?.prefix, options.logger?.level)
        this.#options = options
    }

    logout() {
        this.#keepaliveHandler.stop()
        this.#state.set('doNotReconnect', true)
        this.#cleanup()

        this.#logger.info('Connection', 'Logged out successfully')
        this.#state.set("status", "Offline")
    }

    login(token, roomId) {
        this.#cleanup()

        const events = this.#getWebsocketEvents()

        this.#ws = new WebSocket(`wss://highrise.game/web/botapi?events=${events.join(',')}`, {
            headers: {
                "api-token": token,
                "room-id": roomId
            },
            perMessageDeflate: false
        })

        this.#ws.setMaxListeners(25)

        this.#state.set('credential', { token, roomId })
        this.#state.set('doNotReconnect', false) // break
        this.#state.set("intervals", []) // id's
        this.#state.set("status", "Connecting") // Online, Offline, Connecting, Failure, Invalid room id, API token not found

        this.#setupHandlers()
        this.#setupApi()
        this.#setupListeners()
    }

    setToken(newToken) {
        const { roomId } = this.#getCredential()
        this.#state.set("credential", { token: newToken, roomId })
    }

    setRoomId(newRoomId) {
        const { token } = this.#getCredential()
        this.#state.set("credential", { token, roomId: newRoomId })
    }

    reconnect() {
        const { token, roomId } = this.#getCredential()

        this.#logger.info('Connection', 'Reconnecting...')
        this.logout()
        this.login(token, roomId)
    }

    #getWebsocketEvents() {
        const registered = this.eventNames()
        const validEvents = new Set()

        for (const event of registered) {
            const wsEvent = EventToListener[event]
            if (wsEvent) {
                validEvents.add(wsEvent)
            } else {
                this.#logger.warn("Events", `Unknown event "${event}", skipping...`)
            }
        }

        return [...validEvents]
    }

    #getCredential() {
        const credential = this.#state.get("credential")
        if (!credential?.token || !credential?.roomId) {
            throw new Error("Missing token or roomId")
        }

        return credential
    }

    #setupListeners() {
        this.#ws.on('open', this.#openHandler.handle.bind(this.#openHandler))
        this.#ws.on('message', this.#messageHandler.handle.bind(this.#messageHandler))
        this.#ws.on('error', this.#errorHandler.handle.bind(this.#errorHandler))
        this.#ws.on('close', this.#closeHandler.handle.bind(this.#closeHandler))
    }

    #setupHandlers() {
        this.#setupCore()
        this.#setupWebsocketHandlers()
    }

    #setupCore() {
        this.#sender = new Sender(this.#ws, this.#logger)
        this.#validator = new Validator()
        const configs = [
            new RolesConfig(this.#validator).setup(this.#options.roles)
        ]

        this.#ctx = new BotContext(
            this.#sender,
            this.#logger,
            this.#state,
            this.#validator,
            configs
        )

        this.#botApi = new BotApi(this.#ctx)
    }

    #setupWebsocketHandlers() {
        this.#keepaliveHandler = new KeepAliveHandler(this.#ctx)
        this.#openHandler = new OpenHandler(this.#ctx, this.#keepaliveHandler)
        this.#messageHandler = new MessageHandler(
            this.#ctx,
            this.#botApi,
            this.emit.bind(this)
        )
        this.#errorHandler = new ErrorHandler(this.#ctx)
        this.#closeHandler = new CloseHandler(
            this.#ctx,
            this.#keepaliveHandler,
            this.reconnect.bind(this)
        )
    }

    #setupApi() {
        this.utils = this.#botApi.utils
        this.message = this.#botApi.message
        this.whisper = this.#botApi.whisper
        this.direct = this.#botApi.direct
        this.channel = this.#botApi.channel
        this.inventory = this.#botApi.inventory
        this.player = this.#botApi.player
        this.room = this.#botApi.room
        this.webapi = this.#botApi.webapi
        this.roles = this.#botApi.roles

        this.await = this.#ctx.await
    }

    #cleanup() {
        if (this.#ws) {
            this.#ws.removeAllListeners()
            this.#ws.close()
            this.#ws = null
        }

        if (this.#sender) this.#sender.cleanUp()
        if (this.roles) this.roles.destroy()

        for (const interval of (this.#state.get("intervals") ?? [])) {
            clearInterval(interval)
        }

        this.#state.set("intervals", [])
    }

    get credential() {
        return this.#state.get("credential")
    }

    get metadata() {
        return this.#state.get("metadata")
    }

    get connectTime() {
        return this.#state.get("connectTime")
    }

    get status() {
        return this.#state.get("status") || "unknown"
    }
}

module.exports = HighriseCore