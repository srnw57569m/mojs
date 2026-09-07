const BaseResponse = require("../../Base/BaseResponse");

class GetUserOutfitResponse extends BaseResponse {
    build(data) {
        this.outfit = data.outfit
        this.count = data.outfit.length
    }

    has(itemId) {
        return this.outfit.some(item => item.id === itemId)
    }

    find(itemId) {
        return this.outfit.find(item => item.id === itemId) || null
    }
}

class TipUserResponse extends BaseResponse {
    build(data) {
        this.result = data.result
    }
}

class SplitTipUserResponse extends BaseResponse {
    build(data) {
        this.success = data.success
        this.failed = data.failed
        this.total = data.total
    }
}

module.exports = {
    GetUserOutfitResponse,
    SplitTipUserResponse,
    TipUserResponse
}