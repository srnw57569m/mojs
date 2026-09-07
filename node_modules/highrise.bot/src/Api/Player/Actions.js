const BaseRequest = require("../../Base/BaseRequest");
const AcknowledgmentResponse = require("../../Models/ResponseModels/AcknowledgmentResponse");
const { FloorHitRequest, AnchorHitRequest, TeleportRequest, EmoteRequest, MoveUserToRoomRequest, TipUserRequest, ReactionRequest } = require("../../Models/RequestModels/PlayerRequests");
const { Reactions, GoldBars, PayloadGoldBars } = require("../../Constants/HighriseConstants");
const { SplitTipUserResponse, TipUserResponse } = require("../../Models/ResponseModels/PlayerResponses");

class Actions extends BaseRequest {
    constructor(ctx, utils) {
        super(ctx, utils)
        this.botId = null
    }


    async #sendAction(model) {
        try {
            await this.request(model)
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async walk(x, y, z, facing = "FrontRight") {
        try {
            this.validator.isCoordinates(x, y, z, facing)

            return await this.#sendAction(new FloorHitRequest(x, y, z, facing))
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async sit(entity_id, anchor_ix = 0) {
        try {
            this.validator.isAnchor(entity_id, anchor_ix)

            return await this.#sendAction(new AnchorHitRequest(entity_id, anchor_ix))
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async teleport(userId, x, y, z, facing = "FrontRight") {
        try {
            this.validator
                .required(userId, "userId").string(userId, "userId")
                .isCoordinates(x, y, z, facing)

            return await this.#sendAction(new TeleportRequest(userId, x, y, z, facing))
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }

    }

    async emote(emoteId, userId = null) {
        if (!userId) {
            if (!this.botId) {
                this.botId = this.state.get("metadata")?.botId
            }
            userId = this.botId
        }

        try {
            this.validator
                .required(emoteId, "emoteId")
                .string(emoteId, "emoteId")
                .required(userId, "userId")
                .string(userId, "userId")

            return await this.#sendAction(new EmoteRequest(emoteId, userId))
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async transport(userId, roomId) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")
                .required(roomId, "roomId")
                .string(roomId, "roomId")

            return await this.#sendAction(new MoveUserToRoomRequest(userId, roomId))
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async react(userId, reaction = "heart") {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")
                .required(reaction, "reaction")
                .string(reaction, "reaction")
                .oneOf(reaction, Reactions, 'reaction')

            return await this.#sendAction(new ReactionRequest(userId, reaction))
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async tip(userId, amount = 1) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")
                .required(amount, "amount")
                .positive(amount, "amount")
                .oneOf(amount, GoldBars, 'amount')

            const gold_bar_string = PayloadGoldBars[amount]

            const result = await this.request(new TipUserRequest(userId, gold_bar_string))
            return new TipUserResponse(result.data)
        } catch (error) {
            return new TipUserResponse({ error })
        }
    }

    async splitTip(userId, amount = 1, delay = 300) {
        try {
            this.validator
                .required(userId, "userId")
                .string(userId, "userId")
                .required(amount, "amount")
                .positive(amount, "amount")
                .required(delay, "delay")
                .positive(delay, "delay")

            const goldbars = this.utils.sequencingGoldBars(amount)
            const total = goldbars.length
            let success = 0

            for (const goldbar of goldbars) {

                const response = await this.tip(userId, goldbar)
                if (response.ok) success++
                await this.utils.sleep(delay)
            }

            return new SplitTipUserResponse({ success, failed: total - success, total })
        } catch (error) {
            return new SplitTipUserResponse({ error })
        }
    }
}

module.exports = Actions