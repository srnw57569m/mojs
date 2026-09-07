const { facingDirections } = require("../Constants/HighriseConstants");

class Validator {
    string(value, field) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error(`${field} must be a non-empty string`)
        }
        return this
    }

    number(value, field) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(`${field} must be a number`)
        }
        return this
    }

    function(value, field) {
        if (typeof value !== 'function') {
            throw new Error(`${field} must be a function`)
        }
        return this
    }

    required(value, field) {
        if (value === null || value === undefined) {
            throw new Error(`${field} is required`)
        }
        return this
    }

    range(value, min, max, field) {
        if (value < min || value > max) {
            throw new Error(`${field} must be between ${min} and ${max}`)
        }
        return this
    }

    oneOf(value, options, field) {
        if (!options.includes(value)) {
            throw new Error(`${field} must be one of: ${options.join(', ')}`)
        }
        return this
    }

    boolean(value, field) {
        if (typeof value !== 'boolean') {
            throw new Error(`${field} must be a boolean`)
        }
        return this
    }

    array(value, field) {
        if (!Array.isArray(value)) {
            throw new Error(`${field} must be an array`)
        }
        return this
    }

    nonEmptyArray(value, field) {
        if (!Array.isArray(value) || value.length === 0) {
            throw new Error(`${field} must be a non-empty array`)
        }
        return this
    }

    minLength(value, min, field) {
        if (typeof value !== 'string' || value.length < min) {
            throw new Error(`${field} must be at least ${min} characters`)
        }
        return this
    }

    maxLength(value, max, field) {
        if (typeof value !== 'string' || value.length > max) {
            throw new Error(`${field} must be at most ${max} characters`)
        }
        return this
    }

    integer(value, field) {
        if (!Number.isInteger(value)) {
            throw new Error(`${field} must be an integer`)
        }
        return this
    }

    positive(value, field) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error(`${field} must be a positive number`)
        }
        return this
    }

    instanceOf(value, Class, field) {
        if (!(value instanceof Class)) {
            throw new Error(`${field} must be an instance of ${Class.name}`)
        }
        return this
    }

    isCoordinates(x, y, z, facing) {
        this.required(x, 'x').nonNegative(x, 'x')
            .required(y, 'y').number(y, 'y')
            .required(z, 'z').nonNegative(z, 'z')
            .required(facing, 'facing')
            .string(facing, 'facing')
            .oneOf(facing, facingDirections, 'facing')

        return this
    }

    isAnchor(entity_id, anchor_ix) {
        this.required(entity_id, "entity_id").string(entity_id, 'entity_id')
            .required(anchor_ix, "anchor_ix").nonNegative(anchor_ix, "anchor_ix")

        return this
    }

    nonNegative(value, field) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error(`${field} must be 0 or greater`);
        }
        return this;
    }

    match(value, regex, field) {
        if (typeof value !== 'string' || !regex.test(value)) {
            throw new Error(`${field} does not match the required pattern`)
        }
        return this
    }

    object(value, field) {
        if (typeof value !== 'object' || Array.isArray(value) || value === null) {
            throw new Error(`${field} must be a plain object`)
        }
        return this
    }
}

module.exports = Validator