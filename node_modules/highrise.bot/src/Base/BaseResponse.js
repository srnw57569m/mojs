class BaseResponse {
    constructor(data, ...args) {
        this.error = null
        this.ok = true

        if (data?.error) {
            this.error = data.error.message
            this.ok = false
            return
        }

        try {
            this.build(data, ...args)
        } catch (err) {
            this.error = `${this.constructor.name}: ${err.message}`
            this.ok = false
        }
    }

    hasError() {
        return this.error !== null
    }

    build(data, ...args) {
        throw new Error(`${this.constructor.name} must implement build()`)
    }
}

module.exports = BaseResponse