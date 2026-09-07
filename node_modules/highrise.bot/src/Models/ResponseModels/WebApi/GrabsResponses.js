const BaseResponse = require("../../../Base/BaseResponse");

function buildRewards(rewards) {
    return (rewards ?? []).map(reward => ({
        category: reward.category,
        amount: reward.amount,
        rewardId: reward.reward_id,
        itemId: reward.item_id,
        accountBound: reward.account_bound,
        metadata: reward.metadata ? {
            nfiMetadata: reward.metadata.nfi_metadata,
            nfiTemplateMetadata: reward.metadata.nfi_template_metadata
        } : null,
        bannerItem: reward.banner_item
    }))
}

class GrabsResponse extends BaseResponse {
    build(data, listNext) {
        this.grabs = data.grabs.map(grab => ({
            grabId: grab.grab_id,
            title: grab.title,
            description: grab.description,
            bannerImgUrl: grab.banner_img_url,
            primaryImgUrl: grab.primary_img_url,
            secondaryImgUrl: grab.secondary_img_url,
            startsAt: new Date(grab.starts_at),
            expiresAt: new Date(grab.expires_at),
            isTradable: grab.is_tradable,
            rewards: buildRewards(grab.rewards),
            costs: buildRewards(grab.costs),
            kompuRewards: buildRewards(grab.kompu_rewards),
            limitedTimeKompu: grab.limited_time_kompu ? {
                expiresAt: new Date(grab.limited_time_kompu.expires_at),
                rewards: buildRewards(grab.limited_time_kompu.rewards)
            } : null,
            progressReward: grab.progress_reward
        }))

        this.total = data.total

        this.firstId = data.first_id
        this.lastId = data.last_id

        if (this.lastId) {
            this.next = async () => await listNext(this.lastId);
        } else {
            this.next = null;
        }
    }
}

class GrabResponse extends BaseResponse {
    build(data) {
        const grab = data.grab
        this.grabId = grab.grab_id
        this.title = grab.title
        this.description = grab.description
        this.bannerImgUrl = grab.banner_img_url
        this.primaryImgUrl = grab.primary_img_url
        this.secondaryImgUrl = grab.secondary_img_url
        this.startsAt = new Date(grab.starts_at)
        this.expiresAt = new Date(grab.expires_at)
        this.isTradable = grab.is_tradable
        this.rewards = buildRewards(grab.rewards)
        this.costs = buildRewards(grab.costs)
        this.kompuRewards = buildRewards(grab.kompu_rewards)
        this.limitedTimeKompu = grab.limited_time_kompu ? {
            expiresAt: new Date(grab.limited_time_kompu.expires_at),
            rewards: buildRewards(grab.limited_time_kompu.rewards)
        } : null
        this.progressReward = grab.progress_reward
    }
}

module.exports = {
    GrabsResponse,
    GrabResponse
}