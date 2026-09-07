const crypto = require('node:crypto')
const { WebSocket } = require("ws")
const { ErrorMessages } = require('../../Constants/ErrorConstants')

class Sender {
    #pending

    constructor(ws, logger) {
        this.ws = ws
        this.logger = logger
        this.#pending = new Map()
    }

    raw_request(data, rid = null) {
        if (!this.#validate()) return

        if (Buffer.isBuffer(data)) {
            this.ws.send(data, (error) => {
                if (error) {
                    this.logger.error("Websocket", `Failed to send Buffer: ${error.message}`)
                }
            })

            return
        }

        const payload = JSON.stringify({ ...data, rid })
        if (payload) {
            this.ws.send(payload, (error) => {
                if (error) {
                    this.logger.error("Websocket", `Failed to send payload: ${error.message}`)
                }
            })
        }
    }


    request(data) {
        if (!this.#validate()) return Promise.reject(new Error(ErrorMessages.CONNECTION.NOT_CONNECTED))

        return new Promise((resolve, reject) => {
            const rid = crypto.randomUUID();

            const timeoutId = setTimeout(() => {
                if (this.#pending.has(rid)) {
                    this.#pending.delete(rid);
                    reject(new Error(ErrorMessages.REQUEST.TIMEOUT));
                }
            }, 10000);

            const req = { resolve, reject, timeoutId };
            this.#pending.set(rid, req);

            this.raw_request(data, rid);
        });
    }

    handlePending(raw) {
        const { rid, _type: type } = raw;
        const pendingRequest = this.#pending.get(rid);
        if (!pendingRequest) return false;

        clearTimeout(pendingRequest.timeoutId);
        this.#pending.delete(rid);

        if (type === 'Error') {
            pendingRequest.reject(new Error(raw.message || "Unknown Server Error"));
        } else {
            pendingRequest.resolve({ ok: true, data: raw });
        }

        return true;
    }

    cleanUp() {
        for (const [, req] of this.#pending) {
            clearTimeout(req.timeoutId)
            req.reject(new Error('Connection closed'))
        }
        this.#pending.clear()
    }

    #validate() {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
            return false
        }
        return true
    }
}

module.exports = Sender