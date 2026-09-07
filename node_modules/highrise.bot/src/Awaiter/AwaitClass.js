'use strict'

const {
    ChatAwaiter,
    DirectAwaiter,
    TipAwaiter,
    MovementAwaiter
} = require('./Awaiters')

class AwaitClass {
    #pendingAwaiters

    constructor() {
        this.#pendingAwaiters = {
            ChatEvent: new Map(),
            MessageEvent: new Map(),
            TipReactionEvent: new Map(),
            UserMovedEvent: new Map()
        }
    }

    chat({ filter = () => true, timeout = 30000, maxToCollect = 1, uniqueUsers = false } = {}) {
        return this.#create(ChatAwaiter, 'ChatEvent', filter, timeout, maxToCollect, uniqueUsers)
    }

    direct({ filter = () => true, timeout = 30000, maxToCollect = 1, uniqueUsers = false } = {}) {
        return this.#create(DirectAwaiter, 'MessageEvent', filter, timeout, maxToCollect, uniqueUsers)
    }

    tip({ filter = () => true, timeout = 30000, maxToCollect = 1, uniqueUsers = false } = {}) {
        return this.#create(TipAwaiter, 'TipReactionEvent', filter, timeout, maxToCollect, uniqueUsers)
    }

    movement({ filter = () => true, timeout = 30000, maxToCollect = 1, uniqueUsers = false } = {}) {
        return this.#create(MovementAwaiter, 'UserMovedEvent', filter, timeout, maxToCollect, uniqueUsers)
    }

    processAwaiter(eventType, ...args) {
        const map = this.#pendingAwaiters[eventType]
        if (!map?.size) return
        for (const awaiter of map.values()) {
            awaiter.process(args)
        }
    }

    #create(AwaiterClass, eventType, filter, timeout, maxToCollect, uniqueUsers) {
        const map = this.#pendingAwaiters[eventType]
        const id = Symbol()

        const awaiter = new AwaiterClass(filter, timeout, maxToCollect, uniqueUsers, () => map.delete(id))
        map.set(id, awaiter)
        
        return awaiter.promise
    }
}

module.exports = AwaitClass