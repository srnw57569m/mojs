const path = require('path')
const fs = require('fs')

const CommandRegistery = require('./CommandRegistery')
const Validator = require('../Validator')
const Logger = require('../Logger')
const Roles = require('../Roles')

class CommandManager {
    #folderPath
    #roles

    #validator = new Validator()
    #log = new Logger('CommandManager')

    #commandRegistery = new CommandRegistery(this.#validator, this.#log)

    constructor(folderPath, roles) {
        this.#validator
            .required(folderPath, "folderPath")
            .string(folderPath, "folderPath")

        this.#validator
            .required(roles, 'roles')
            .instanceOf(roles, Roles, 'roles')

        this.#roles = roles
        this.#folderPath = path.resolve(folderPath)

        this.init()
    }

    init() {
        const files = this.#scanFiles()
        const modules = this.#loadModules(files)
        const loaded = this.#registerModules(modules)

        this.#log.info('Commands Loaded', `Success: ${loaded.success}`, `Failed: ${loaded.failed}`)
    }

    #scanFiles() {
        try {
            const files = fs.readdirSync(this.#folderPath, {
                recursive: true,
                withFileTypes: true
            })

            return files.filter((file) => file.name.endsWith('.js'))
        } catch (error) {
            this.#log.error("Scanning Files", error.message)
            return []
        }
    }

    #loadModules(files) {
        const modules = []
        if (!files.length) return []

        for (const file of files) {
            const filePath = path.join(file.parentPath, file.name)

            try {

                delete require.cache[filePath]

                const module = require(filePath)
                const detailedModule = {
                    ...module,
                    filePath
                }

                modules.push(detailedModule)
            } catch (error) {
                this.#log.error(`Loading Module '${filePath}'`, error.message)
            }
        }

        return modules
    }

    #registerModules(modules) {
        let success = 0, failed = 0
        if (!modules.length) return { success: 0, failed: 0 }

        for (const module of modules) {
            const registered = this.#commandRegistery.register(module)
            if (registered) {
                success++
            } else {
                failed++
            }
        }

        return { success, failed }
    }

    #hasAccess(user, roles) {
        this.#validator
            .required(user, "user")
            .required(user?.id, "user.id")
            .string(user?.id, "user.id")

        if (!roles.length) return true

        return this.#roles.hasAnyRole(user.id, roles)
    }

    getAllCommands() {
        return this.#commandRegistery.getAllCommands()
    }

    register(module) {
        return this.#commandRegistery.register(module)
    }

    unregister(name) {
        return this.#commandRegistery.unregister(name)
    }

    handle(commandName, context) {
        const command = this.#commandRegistery.get(commandName)
        if (!command) return false

        const commandRoles = command.roles ?? []

        try {
            const hasAccess = this.#hasAccess(context.user, commandRoles)
            if (!hasAccess) return false
        } catch {
            return false
        }

        command.execute(context)
        return true
    }
}

module.exports = CommandManager