class BaseAwaiter {
    #filter
    #maxToCollect
    #collected
    #seenUsers
    #timeoutId
    #resolve
    #onDone

    constructor(filter, timeout, maxToCollect, uniqueUsers, onDone) {
        this.#filter = filter
        this.#maxToCollect = maxToCollect
        this.#collected = maxToCollect > 1 ? [] : null
        this.#seenUsers = uniqueUsers ? new Set() : null
        this.#onDone = onDone

        this.promise = new Promise(r => (this.#resolve = r))

        this.#timeoutId = timeout > 0
            ? setTimeout(() => this.#finish(this.#collected ?? []), timeout)
            : null
    }

    extractUser([user]) {
        return user?.id
    }

    process(args) {
        if (this.#seenUsers) {
            const uid = this.extractUser(args)
            if (!uid || this.#seenUsers.has(uid)) return
            this.#seenUsers.add(uid)
        }

        try {
            if (!this.#filter(...args)) return
        } catch {
            return
        }

        if (this.#maxToCollect === 1) {
            return this.#finish(args)
        }

        this.#collected.push(args)
        if (this.#collected.length >= this.#maxToCollect) {
            this.#finish(this.#collected)
        }
    }

    cancel() {
        this.#finish([])
    }

    #finish(result) {
        clearTimeout(this.#timeoutId)
        this.#onDone()

        if (result.length === 1) {
            this.#resolve(result[0])
        } else if (result.length > 1) {
            this.#resolve(result)
        } else {
            this.#resolve([])
        }
    }
}

module.exports = BaseAwaiter