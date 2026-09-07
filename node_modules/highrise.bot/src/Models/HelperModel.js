class OutfitItem {
    constructor(id, palette = 0, amount = 1, isBound = false) {
        this.id = id;
        this.type = "clothing"
        this.amount = amount;
        this.account_bound = isBound;
        this.active_palette = palette;
    }
}


module.exports = {
    OutfitItem
}