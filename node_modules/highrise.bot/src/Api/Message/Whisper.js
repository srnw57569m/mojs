const BaseRequest = require("../../Base/BaseRequest");
const { ChatRequest } = require("../../Models/RequestModels/ChatRequests");
const AcknowledgmentResponse = require("../../Models/ResponseModels/AcknowledgmentResponse");

class WhisperApi extends BaseRequest {
    async send(userId, message) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")
                .required(message, "message")
                .string(message, "message")

            if (message.length > 256) {
                let failed = 0
                const parts = this.utils.splitMessages(message, 256)
                for (const part of parts) {
                    try {
                        await this.request(new ChatRequest(part, userId))
                    } catch {
                        failed++
                    }
                }

                if (failed) this.logger.warn('Whisper', `${failed}/${parts.length} message parts failed to send`)
                if (failed === parts.length) {
                    return new AcknowledgmentResponse({ error: new Error('All message parts failed to send in bot.whisper.send()') })
                }

                return new AcknowledgmentResponse()
            }

            await this.request(new ChatRequest(message, userId))
            return new AcknowledgmentResponse()

        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }
}

module.exports = WhisperApi