/** 
 * Built-in validator utils for highrise bots, also it can be imported for external usage 
 */
declare class Validator {
    /**
     * Validates that a value is a non-empty string
     * @param value - The value to validate
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.string(message, "message")
     */
    string(value: unknown, field: string): this;

    /**
     * Validates that a value is a valid number
     * @param value - The value to validate
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.number(amount, "amount")
     */
    number(value: unknown, field: string): this;

    /**
     * Validates that a value is a function
     * @param value - The value to validate
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.function(someFunction, "someFunctionName")
     */
    function(value: unknown, field: string): this;

    /**
     * Validates that a value is not null or undefined
     * @param value - The value to validate
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.required(userId, "userId")
     */
    required(value: unknown, field: string): this;

    /**
     * Validates that a number is within a specified range
     * @param value - The value to validate
     * @param min - The minimum allowed value
     * @param max - The maximum allowed value
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.range(duration, 0, 3600, "duration")
     */
    range(value: number, min: number, max: number, field: string): this;

    /**
     * Validates that a value is one of the allowed options
     * @param value - The value to validate
     * @param options - Array of allowed values
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.oneOf(facing, ['FrontLeft', 'FrontRight', 'BackLeft', 'BackRight'], "facing")
     */
    oneOf<T>(value: T, options: T[], field: string): this;

    /**
     * Validates that a value is a boolean
     * @param value - The value to validate
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.boolean(isActive, "isActive")
     */
    boolean(value: unknown, field: string): this;

    /**
     * Validates that a value is an array
     * @param value - The value to validate
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.array(items, "items")
     */
    array(value: unknown, field: string): this;

    /**
     * Validates that an array is non-empty
     * @param value - The value to validate
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.nonEmptyArray(users, "users")
     */
    nonEmptyArray(value: unknown, field: string): this;

    /**
     * Validates that a string meets a minimum length requirement
     * @param value - The value to validate
     * @param min - The minimum allowed length
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.minLength(username, 3, "username")
     */
    minLength(value: string, min: number, field: string): this;

    /**
     * Validates that a string does not exceed a maximum length
     * @param value - The value to validate
     * @param max - The maximum allowed length
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.maxLength(message, 256, "message")
     */
    maxLength(value: string, max: number, field: string): this;

    /**
     * Validates that a value is an integer
     * @param value - The value to validate
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.integer(page, "page")
     */
    integer(value: unknown, field: string): this;

    /**
     * Validates that a number is positive
     * @param value - The value to validate
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.positive(amount, "amount")
     */
    positive(value: unknown, field: string): this;

    /**
     * Validates that a value is not a negative value
     * @param value - The value to validate
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.nonNegative(amount, "amount")
     */
    nonNegative(value: unknown, field: string): this

    /**
     * Validates that a string matches a regex pattern
     * @param value - The value to validate
     * @param regex - The regular expression to test against
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.match(userId, /^[a-z0-9]+$/, "userId")
     */
    match(value: string, regex: RegExp, field: string): this;

    /**
     * Validates that a value is a plain object
     * @param value - The value to validate
     * @param field - The field name for error messages
     * @returns The current Validator instance for chaining 
     * @example
     * validator.object(options, "options")
     */
    object(value: unknown, field: string): this;

    /**
     * Validates a set of Highrise coordinates and facing direction.
     * This is a composite validator that checks x, y, z, and facing in one call.
     * @param x - The X coordinate (must be non-negative)
     * @param y - The Y coordinate (must be non-negative)
     * @param z - The Z coordinate (must be non-negative)
     * @param facing - The direction the player is facing
     * @returns The current Validator instance for chaining
     * @example
     * validator.isCoordinates(x, y, z, "FrontRight")
     */
    isCoordinates(
        x: unknown,
        y: unknown,
        z: unknown,
        facing: unknown
    ): this;
}

export { Validator }
export default Validator