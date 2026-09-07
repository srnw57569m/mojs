import Validator from "../../Tools/Validator"

/**
 * Highrise bot development Utils
 */
declare class Utils {

    /** 
     * Built-in validator utils for highrise bots, also it can be imported for external usage 
     */
    validator: Validator

    /**
     * Utility method to create a delay/pause in execution
     * Returns a Promise that resolves after the specified time, useful for rate limiting,
     * artificial delays, or waiting between methods
     * 
     * @param ms - Delay duration in milliseconds
     * @returns Promise that resolves after the specified delay
     * 
     * @example
     * ```javascript
     * // Basic delay
     * await bot.utils.sleep(1000); // Wait 1 second
     * 
     * // Rate limiting between messages
     * await bot.message.send("First message");
     * await bot.utils.sleep(500); // Wait 500ms
     * await bot.message.send("Second message");
     * 
     * // Artificial delay for user experience
     * await bot.utils.sleep(2000); // Wait 2 seconds before response
     * await bot.message.send("Processing complete!");
     * 
     * // In loops with delays
     * for (let i = 0; i < 5; i++) {
     *   await bot.message.send(`Message ${i + 1}`);
     *   await bot.utils.sleep(1000); // Wait 1 second between messages
     * }
     * ```
     */
    sleep(ms: number): Promise<boolean>;

    /**
     * Returns the bot's uptime as a formatted string (e.g., `"2d 5h 13m 42s"`), return `"Offline"` if the bot is offline IT'S OBVIOUS!.
     * The timer starts when the WebSocket connection is established and resets upon reconnection.
     */
    uptime(): string;

    /**
     * Returns passed ms as a formatted string (e.g., `"2d 5h 13m 42s"`)
     */
    formatTime(ms: number): string

    /**
     * Splits text into chunks of specified length, respecting word boundaries
     * @param text - The text to split
     * @param limit - Maximum characters per chunk
     * @returns Array of text chunks
     */
    splitMessages(text: string, limit: number): string[]

    /**
     * Breaks down a gold bar amount into valid denominations in descending order.
     * The input amount is rounded down to the nearest whole number, then sequenced
     * into the available gold bar denominations (10000, 5000, 1000, 500, 100, 50, 10, 5, 1)
     * using a greedy algorithm.
     * 
     * @param amount - The total amount of gold bars to sequence/break down (rounded down)
     * @returns An array of valid gold bar denominations that sum to the rounded amount,
     *          sorted from highest to lowest denomination
     * @example
     * ```javascript
     * sequencingGoldBars(454) // Returns [100, 100, 100, 100, 50] (454 -> 450)
     * sequencingGoldBars(454.7) // Returns [100, 100, 100, 100, 50] (454.7 -> 450)
     * sequencingGoldBars(1234.2) // Returns [1000, 100, 100, 10, 10, 10, 1, 1, 1, 1] (1234.2 -> 1234)
     * sequencingGoldBars(7500) // Returns [5000, 1000, 1000, 500]
     * ```
     */
    sequencingGoldBars(amount: number): number[];
}

export default Utils