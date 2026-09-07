const Actions = require("./Actions")
const { ItemBuy, BoostBuy } = require("./Buying")
const Outfit = require("./Outfit")
const Wallet = require("./Wallet")

class InventoryApi {
    #actions
    
    constructor(ctx, utils) {
        this.#actions = new Actions(ctx, utils)
        this.outfit = new Outfit(ctx, utils)
        this.wallet = new Wallet(ctx, utils)
        this.item = new ItemBuy(ctx, utils)
        this.boost = new BoostBuy(ctx, utils)
    }

    async get() {
        return await this.#actions.getInventory()
    }
}

module.exports = InventoryApi