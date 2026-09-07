class BaseConfig {
    static staticName = null
    constructor(validator) {
        this.validator = validator
    }

    setup(options) {
        throw new Error(`${this.constructor.name} must implement setup()`)
    }
}

module.exports = BaseConfig