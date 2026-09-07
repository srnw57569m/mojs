const ErrorMessages = {
    FATAL: [
        'API token not found',
        'Room not found',
        'Invalid room id'
    ],

    CONNECTION: {
        FAILED: 'Failed to establish connection',
        LOST: 'Connection was lost unexpectedly',
        TIMEOUT: 'Connection attempt timed out',
        NOT_CONNECTED: 'Websocket is not connected',
    },

    AUTH: {
        INVALID_TOKEN: 'The provided API token is invalid',
        INVALID_ROOM: 'The provided room ID is invalid',
        UNAUTHORIZED: 'Not authorized to perform this action',
    },

    REQUEST: {
        TIMEOUT: 'Request timed out after 10 seconds',
        FAILED: 'Request failed to complete',
        INVALID_PAYLOAD: 'Payload is not a valid object',
    },

    VALIDATION: {
        INVALID_TYPE: 'Value is not the expected type',
        INVALID_VALUE: 'Value is invalid or empty',
        MISSING_FIELD: 'Required field is missing',
        OUT_OF_RANGE: 'Value is outside the allowed range',
    },

    API: {
        USER_NOT_FOUND: 'User was not found in the room',
        ROOM_NOT_FOUND: 'Room does not exist',
        PERMISSION_DENIED: 'Bot does not have permission',
        ACTION_FAILED: 'Action could not be completed',
    },

}

module.exports = { ErrorMessages }