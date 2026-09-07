class ChatRequest {
    constructor(message, whisper_target_id = null) {
        this._type = "ChatRequest"
        this.message = message
        this.whisper_target_id = whisper_target_id
    }
}

module.exports = {
    ChatRequest
}