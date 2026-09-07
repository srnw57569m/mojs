const BaseRequest = require("../../Base/BaseRequest");
const { GetWalletResponse } = require('../../Models/ResponseModels/InventoryResponses')
const { GetWalletRequest } = require('../../Models/RequestModels/InventoryRequests')

class Wallet extends BaseRequest {
    async get() {
        try {
            const result = await this.request(new GetWalletRequest())
            return new GetWalletResponse(result.data)
        } catch (error) {
            return new GetWalletResponse({ error })
        }
    }
}

module.exports = Wallet