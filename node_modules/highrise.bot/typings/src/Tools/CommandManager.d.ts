import Roles from "./Roles"

interface Command {
    /** The primary name used to trigger the command (e.g. `"ban"`) */
    name: string
    /** Optional list of alternative names that also trigger the command (e.g. `["b", "banuser"]`) */
    aliases?: string[]
    /** Optional description of what the command does */
    desc?: string
    /** Optional list of roles required to execute the command. If empty, everyone can use it. */
    roles?: string[]
    /** The function executed when the command is triggered */
    execute: (context: any) => void
}

interface DetailedCommand extends Command {
    /** File path to the command file from which it got exported */
    filePath: string
}

/**
 * The command manager instance.
 * Handles loading commands from a directory and executing them by name or alias.
 * 
 * @see {@link CommandManager}
 */
declare class CommandManager {
    /**
     * Creates a new CommandManager and automatically scans and loads all `.js` files in the given folder.
     * @param folderPath Path to the folder containing command files (e.g. `"./commands"`)
     * @param roles The {@link Roles} instance used to check command access control.
     */
    constructor(folderPath: string, roles: Roles)

    /**
     * Rescans and reloads all command files from the folder.
     * Called automatically on construction.
     */
    init(): void

    /**
     * Returns all commands in the registry
     */
    getAllCommands(): DetailedCommand[]

    /**
     * Manually registers a command module.
     * @param module The command module to register.
     * @returns `true` if registered successfully, `false` if validation failed or a collision was detected.
     */
    register(module: Command): boolean

    /**
     * Unregisters a command and all its aliases by name.
     * @param name The primary name or alias of the command to unregister.
     * @returns `true` if unregistered successfully, `false` if not found.
     */
    unregister(name: string): boolean

    /**
     * Looks up and executes a command by name.
     * @param commandName The name or alias of the command to execute.
     * @param context The context passed to the command's `execute` function.
     * @returns `true` if the command was found and executed, `false` if not found or error.
     */
    handle(commandName: string, context: any): boolean
}

export { CommandManager, Command }