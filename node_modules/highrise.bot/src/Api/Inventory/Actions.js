const BaseRequest = require("../../Base/BaseRequest");
const { GetInventoryRequest } = require("../../Models/RequestModels/InventoryRequests");
const { GetInventoryResponse } = require("../../Models/ResponseModels/InventoryResponses");

class Actions extends BaseRequest {
    async getInventory() {
        try {
            const result = await this.request(new GetInventoryRequest())
            return new GetInventoryResponse(result.data)
        } catch (error) {
            return new GetInventoryResponse({ error })
        }
    }
}

module.exports = Actions