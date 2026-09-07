const BaseRequest = require("../../Base/BaseRequest");
const { GetUserOutfitResponse } = require("../../Models/ResponseModels/PlayerResponses");
const { GetUserOutfitRequest } = require("../../Models/RequestModels/PlayerRequests");
const AcknowledgmentResponse = require("../../Models/ResponseModels/AcknowledgmentResponse");
const { defaultOutfit } = require("../../Constants/HighriseConstants");
const { SetOutfitRequest } = require("../../Models/RequestModels/InventoryRequests");
const { OutfitItem } = require("../../Models/HelperModel");

class Outfit extends BaseRequest {
    async get() {
        try {
            const botId = this.state.get('metadata').botId
            const CachedOutfit = this.state.get("outfit")
            if (CachedOutfit) return CachedOutfit

            const result = await this.request(new GetUserOutfitRequest(botId))
            const response = new GetUserOutfitResponse(result.data)
            this.state.set("outfit", response)

            return response
        } catch (error) {
            return new GetUserOutfitResponse({ error })
        }
    }

    async remove(itemId) {
        try {
            this.validator
                .required(itemId, "itemId")
                .string(itemId, "itemId")

            const currentOutfit = await this.get()
            const filterdOutfit = currentOutfit.outfit.filter((item) => item.id !== itemId)

            return await this.set(filterdOutfit)
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async color(itemId, colorIndex = 0) {
        try {
            this.validator
                .required(itemId, "itemId")
                .string(itemId, "itemId")
            if (colorIndex) this.validator.nonNegative(colorIndex, "colorIndex")

            const currentOutfit = await this.get()
            const outfitArray = currentOutfit.outfit

            const updatedOutfit = outfitArray.map((item) =>
                item.id === itemId
                    ? { ...item, active_palette: colorIndex }
                    : item
            )

            return await this.set(updatedOutfit)
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async add(outfitItem) {
        try {
            this.validator
                .required(outfitItem, "outfitItem")
                .instanceOf(outfitItem, OutfitItem, "outfitItem")

            const currentOutfit = await this.get()
            const itemExist = currentOutfit.outfit.some((item) => item.id === outfitItem.id)
            if (itemExist) {
                throw new Error(`Item ${outfitItem.id} already exists`)
            }

            const newOutfit = [...currentOutfit.outfit, outfitItem]
            return await this.set(newOutfit)
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }

    async set(outfit = defaultOutfit) {
        try {
            this.validator
                .nonEmptyArray(outfit, "outfit")

            await this.request(new SetOutfitRequest(outfit))
            this.state.set("outfit", new GetUserOutfitResponse({ outfit }))
            return new AcknowledgmentResponse()
        } catch (error) {
            return new AcknowledgmentResponse({ error })
        }
    }
}

module.exports = Outfit