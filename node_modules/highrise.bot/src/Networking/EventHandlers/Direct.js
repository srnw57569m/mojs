const BaseHandler = require("../../Base/BaseHandler");
const { Direct } = require("../../Models/EventModels");

class DirectHandler extends BaseHandler {
    static type = "MessageEvent"

    constructor(ctx, directApi) {
        super(ctx);
        this.direct = directApi;
    }

    async handle(data, emit) {
        const result = await this.direct.messages.list(data.conversation_id)

        if (!result.ok) {
            this.logger.error(`WebSocket Direct Event Error: ${result.error}`);

            const direct = new Direct(data);
            return emit("Direct", direct.user, direct.message, direct.conversation);
        }

        const recentMessage = result.recentMessage
        data.message = recentMessage ? recentMessage.content : null

        const direct = new Direct(data);
        this.await.processAwaiter(this.constructor.type, direct.user, direct.message, direct.conversation)
        emit("Direct", direct.user, direct.message, direct.conversation);
    }
}

module.exports = DirectHandler