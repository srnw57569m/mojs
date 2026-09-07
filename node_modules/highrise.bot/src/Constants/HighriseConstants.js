const facingDirections = ["FrontRight", "FrontLeft", "BackRight", "BackLeft"]
const BuyingResult = ["success", "insufficient_funds", "only_token_bought"]
const Reactions = ['clap', 'heart', 'thumbs', 'wave', 'wink']
const GoldBars = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000]

const PayloadGoldBars = {
    1: "gold_bar_1",
    5: "gold_bar_5",
    10: "gold_bar_10",
    50: "gold_bar_50",
    100: "gold_bar_100",
    500: "gold_bar_500",
    1000: "gold_bar_1k",
    5000: "gold_bar_5000",
    10000: "gold_bar_10k"
};

const defaultOutfit = [
    {
        type: 'clothing',
        amount: 1,
        id: 'hair_front-n_malenew05',
        account_bound: false,
        active_palette: 1
    },
    {
        type: 'clothing',
        amount: 1,
        id: 'hair_back-n_malenew05',
        account_bound: false,
        active_palette: 1
    },
    {
        type: 'clothing',
        amount: 1,
        id: 'body-flesh',
        account_bound: false,
        active_palette: 27
    },
    {
        type: 'clothing',
        amount: 1,
        id: 'eye-n_basic2018malesquaresleepy',
        account_bound: false,
        active_palette: 7
    },
    {
        type: 'clothing',
        amount: 1,
        id: 'eyebrow-n_basic2018newbrows07',
        account_bound: false,
        active_palette: 0
    },
    {
        type: 'clothing',
        amount: 1,
        id: 'nose-n_basic2018newnose05',
        account_bound: false,
        active_palette: 0
    },
    {
        type: 'clothing',
        amount: 1,
        id: 'mouth-basic2018chippermouth',
        account_bound: false,
        active_palette: -1
    },
    {
        type: 'clothing',
        amount: 1,
        id: 'freckle-n_basic2018freckle04',
        account_bound: false,
        active_palette: 0
    },
    {
        type: 'clothing',
        amount: 1,
        id: 'shirt-n_room32019denimjackethoodie',
        account_bound: false,
        active_palette: 0
    },
    {
        type: 'clothing',
        amount: 1,
        id: 'pants-n_starteritems2019cuffedjeanswhite',
        account_bound: false,
        active_palette: 0
    },
    {
        type: 'clothing',
        amount: 1,
        id: 'shoes-n_room32019socksneakersgrey',
        account_bound: false,
        active_palette: 0
    }
]

module.exports = {
    facingDirections: Object.freeze(facingDirections),
    GoldBars: Object.freeze(GoldBars),
    Reactions: Object.freeze(Reactions),
    defaultOutfit: Object.freeze(defaultOutfit.map(Object.freeze)),
    BuyingResult: Object.freeze(BuyingResult),
    PayloadGoldBars: Object.freeze(PayloadGoldBars)
}