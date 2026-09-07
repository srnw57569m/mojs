interface RewardMetadata {
    /** NFI metadata, or `null` if none */
    nfiMetadata: unknown | null
    /** NFI template metadata, or `null` if none */
    nfiTemplateMetadata: unknown | null
}

interface Reward {
    /** Category of the reward (e.g. `"outfit"`, `"gems"`) */
    category: string
    /** Amount of the reward */
    amount: number
    /** Unique identifier of the reward */
    rewardId: string
    /** Item ID of the reward, or `null` if it's a currency reward */
    itemId: string | null
    /** Whether the reward is bound to the account */
    accountBound: boolean
    /** Metadata of the reward, or `null` if none */
    metadata: RewardMetadata | null
    /** Whether the reward is a banner item */
    bannerItem: boolean
}

interface LimitedTimeKompu {
    /** UTC timestamp of when the limited time kompu expires */
    expiresAt: Date
    /** List of limited time kompu rewards */
    rewards: Reward[]
}

interface Grab {
    /** Unique identifier of the grab */
    grabId: string
    /** Display title of the grab */
    title: string
    /** Description of the grab */
    description: string
    /** URL of the grab's banner image */
    bannerImgUrl: string
    /** URL of the grab's primary image, or `null` if none */
    primaryImgUrl: string | null
    /** URL of the grab's secondary image, or `null` if none */
    secondaryImgUrl: string | null
    /** UTC timestamp of when the grab starts */
    startsAt: Date
    /** UTC timestamp of when the grab expires */
    expiresAt: Date
    /** Whether the grab rewards are tradable */
    isTradable: boolean
    /** List of possible rewards from the grab */
    rewards: Reward[]
    /** Cost to spin the grab */
    costs: Reward[]
    /** List of kompu rewards for completing the grab */
    kompuRewards: Reward[]
    /** Limited time kompu reward, or `null` if none */
    limitedTimeKompu: LimitedTimeKompu | null
    /** Progress reward, or `null` if none */
    progressReward: unknown | null
}

declare class GrabsResponse extends BaseResponse {
    /** List of grabs returned by the WebApi */
    grabs: Grab[]
    /** Total number of grabs available */
    total: number
    /** First grab ID in the current page */
    firstId: string
    /** Last grab ID in the current page, used for pagination */
    lastId: string
    /** Fetches the next batch of grabs, or `null` if there are no more */
    next(): Promise<GrabsResponse> | null
}

declare class GrabResponse extends BaseResponse {
    /** Unique identifier of the grab */
    grabId: string
    /** Display title of the grab */
    title: string
    /** Description of the grab */
    description: string
    /** URL of the grab's banner image */
    bannerImgUrl: string
    /** URL of the grab's primary image, or `null` if none */
    primaryImgUrl: string | null
    /** URL of the grab's secondary image, or `null` if none */
    secondaryImgUrl: string | null
    /** UTC timestamp of when the grab starts */
    startsAt: Date
    /** UTC timestamp of when the grab expires */
    expiresAt: Date
    /** Whether the grab rewards are tradable */
    isTradable: boolean
    /** List of possible rewards from the grab */
    rewards: Reward[]
    /** Cost to spin the grab */
    costs: Reward[]
    /** List of kompu rewards for completing the grab */
    kompuRewards: Reward[]
    /** Limited time kompu reward, or `null` if none */
    limitedTimeKompu: LimitedTimeKompu | null
    /** Progress reward, or `null` if none */
    progressReward: unknown | null
}

export { 
    GrabsResponse,
    GrabResponse
}