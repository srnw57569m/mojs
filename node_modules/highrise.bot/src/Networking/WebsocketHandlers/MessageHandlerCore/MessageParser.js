const { ErrorMessages } = require("../../../Constants/ErrorConstants")

class MessageParser {
    parse(raw) {
        try {
            return { data: JSON.parse(raw), error: null }
        } catch {
            return { data: null, error: "Failed to parse raw data" }
        }
    }

    isError(raw) {
        return !raw.rid && raw._type === "Error"
    }

    isFatal(raw) {
        return ErrorMessages.FATAL.includes(raw.message)
    }
}

module.exports = MessageParser