const BaseRequest = require("../../Base/BaseRequest");
const { BuyItemRequest, BuyRoomBoostRequest } = require("../../Models/RequestModels/InventoryRequests");
const { BuyItemResponse, BuyRoomBoostResponse } = require("../../Models/ResponseModels/InventoryResponses");

class ItemBuy extends BaseRequest {
    async buy(itemId) {
        try {
            this.validator
                .required(itemId, "itemId")
                .string(itemId, "itemId")

            const result = await this.request(new BuyItemRequest(itemId))
            return new BuyItemResponse(result.data)
        } catch (error) {
            return new BuyItemResponse({ error })
        }
    }
}

class BoostBuy extends BaseRequest {
    async buy(amount = 1) {
        try {
            if (amount) {
                this.validator
                .positive(amount, 'amount')
            }

            const result = await this.request(new BuyRoomBoostRequest(amount))
            return new BuyRoomBoostResponse(result.data)
        } catch (error) {
            return new BuyRoomBoostResponse({ error })
        }
    }
}

module.exports = {
    ItemBuy,
    BoostBuy
}