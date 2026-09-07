type LogLevel = 'debug' | 'info' | 'warn' | 'error'


/** 
 * Built-in validator utils for highrise bots, also it can be imported for external usage 
 */
declare class Logger {
    
    constructor(
        /**
         * name for the logger prefix the default SDK prefix is `"Highrise"` prefix
         */
        prefix: string
    );

    /**
     * Log an informational message
     * @param category - The category or context of the log
     * @param args - Additional messages or objects to log
     * @example
     * logger.info("Websocket", "Connected to Highrise!")
     */
    info(category: string, ...args: unknown[]): void;

    /**
     * Log a warning message
     * @param category - The category or context of the log
     * @param args - Additional messages or objects to log
     * @example
     * logger.warn("Websocket", "Connection is slow")
     */
    warn(category: string, ...args: unknown[]): void;

    /**
     * Log an error message
     * @param category - The category or context of the log
     * @param args - Additional messages or objects to log
     * @example
     * logger.error("Websocket", "Failed to send payload", { rid })
     */
    error(category: string, ...args: unknown[]): void;

    /**
     * Log a debug message
     * @param category - The category or context of the log
     * @param args - Additional messages or objects to log
     * @example
     * logger.debug("Closing", `code: ${code}`, `reason: ${reason}`)
     */
    debug(category: string, ...args: unknown[]): void;

    /**
     * Changes the minimum log level at runtime.
     * Level order (low to high severity): `debug` < `info` < `warn` < `error`.
     * Setting a level shows that level and everything more severe.
     *
     * @param level - New minimum level.
     * @throws {Error} If `level` is not a valid `LogLevel`.
     *
     * @example
     * ```ts
     * logger.setLevel('debug')
     * ```
     */
    setLevel(level: LogLevel): void
}

export { Logger, LogLevel }
export default Logger