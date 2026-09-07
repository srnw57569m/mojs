class CommandRegistery {
    #commands = new Map()
    #validator
    #log

    constructor(validator, log) {
        this.#validator = validator
        this.#log = log
    }

    #validate(module) {
        try {
            this.#validator
                .required(module.name, "name")
                .string(module.name, "name")

            this.#validator
                .required(module.execute, "execute")
                .function(module.execute, "execute")

            if (module.aliases !== undefined) {
                this.#validator
                    .nonEmptyArray(module.aliases, 'aliases')

                if (!module.aliases.every((alias) => typeof alias === 'string')) {
                    throw new Error(`all aliases names must be strings`)
                }
            }

            if (module.desc !== undefined) {
                this.#validator
                    .string(module.desc, "desc")
            }

            return true
        } catch (error) {
            this.#log.error(`Validating Command "${module.filePath}"`, error.message)
            return false
        }
    }

    getAllCommands() {
        return [...this.#commands.values()]
    }

    register(module) {
        if (!this.#validate(module)) return false

        const keys = [module.name, ...(module.aliases ?? [])]

        for (const key of keys) {
            if (this.#commands.has(key)) {
                this.#log.error(`Registering Command`, `Collision detected on key "${key}" from "${module.filePath}"`)
                continue
            }

            this.#commands.set(key, module)
        }

        return true
    }

    get(name) {
        return this.#commands.get(name) ?? null
    }

    unregister(name) {
        const module = this.#commands.get(name)
        if (!module) return false

        const keys = [module.name, ...(module.aliases ?? [])]
        for (const key of keys) {
            this.#commands.delete(key)
        }

        return true
    }
}

module.exports = CommandRegistery