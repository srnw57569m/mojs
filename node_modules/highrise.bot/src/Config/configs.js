const BaseConfig = require("../Base/BaseConfig")

class RolesConfig extends BaseConfig {
    static staticName = "roles"

    setup(options = {}) {
        if (options.persistPath !== undefined) {
            this.validator.string(options.persistPath, "roles.persistPath")
        }

        if (options.fileSaveInterval !== undefined) {
            this.validator
                .nonNegative(options.fileSaveInterval, "roles.fileSaveInterval")
                .range(options.fileSaveInterval, 1 * 60 * 1000, Infinity, "roles.fileSaveInterval")
        }

        if (options.roomFetchInterval !== undefined) {
            this.validator
                .nonNegative(options.roomFetchInterval, "roles.roomFetchInterval")
                .range(options.roomFetchInterval, 1 * 60 * 1000, Infinity, "roles.roomFetchInterval")
        }

        this.persistPath = options.persistPath ?? null
        this.fileSaveInterval = options.fileSaveInterval ?? 7.5 * 60 * 1000
        this.roomFetchInterval = options.roomFetchInterval ?? 10 * 60 * 1000

        return this
    }
}

module.exports = { RolesConfig }