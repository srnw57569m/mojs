class SetOutfitRequest {
    constructor(outfit) {
        this._type = "SetOutfitRequest"
        this.outfit = outfit
    }
}

class GetWalletRequest {
    constructor() {
        this._type = 'GetWalletRequest'
    }
}

class GetInventoryRequest {
    constructor() {
        this._type = 'GetInventoryRequest'
    }
}

class BuyItemRequest {
    constructor(item_id) {
        this._type = 'BuyItemRequest'
        this.item_id = item_id
    }
}

class BuyRoomBoostRequest {
    constructor(amount) {
        this._type = 'BuyRoomBoostRequest'
        this.payment_method = 'bot_wallet_only'
        this.amount = amount

    }
}

module.exports = {
    SetOutfitRequest,
    GetWalletRequest,
    GetInventoryRequest,
    BuyItemRequest,
    BuyRoomBoostRequest
}