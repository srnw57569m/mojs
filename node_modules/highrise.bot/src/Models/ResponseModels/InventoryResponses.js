const BaseResponse = require("../../Base/BaseResponse");

class GetWalletResponse extends BaseResponse {
    build(data) {
        const find = (type) => data.content.find(c => c.type === type)?.amount ?? 0
        this.gold = find('gold')
        this.boostToken = find('room_boost_tokens')
        this.voiceToken = find('room_voice_tokens')
    }
}

class GetInventoryResponse extends BaseResponse {
    build(data) {
        this.inventory = data.items
        this.count = data.items.length
    }
}

class BuyItemResponse extends BaseResponse {
    build(data) {
        this.result = data.result
        this.success = data.result === 'success'
        this.insufficientFunds = data.result === 'insufficient_funds'
    }
}

class BuyRoomBoostResponse extends BaseResponse {
    build(data) {
        this.result = data.result
        this.success = data.result === 'success'
        this.insufficientFunds = data.result === 'insufficient_funds'
    }
}

module.exports = {
    BuyRoomBoostResponse,
    GetInventoryResponse,
    GetWalletResponse,
    BuyItemResponse
}