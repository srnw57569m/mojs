class UtilsApi {
    #logger

    constructor(ctx) {
        this.state = ctx.state
        this.#logger = ctx.logger
        this.validator = ctx.validator
    }

    async sleep(ms) {
        if (ms < 0) {
            this.#logger.warn('bot.utils.sleep', 'Negative delay provided, fallback to 0ms');
            ms = 0;
        }

        return new Promise(resolve => setTimeout(resolve, ms))
    }

    splitMessages(text, limit) {
        if (!text) return [];
        const chunks = [];
        let remaining = text.trim();

        while (remaining.length > 0) {
            if (remaining.length <= limit) {
                chunks.push(remaining);
                break;
            }

            let breakAt = remaining.lastIndexOf('\n', limit);

            if (breakAt === -1) {
                breakAt = remaining.lastIndexOf(' ', limit);
            }

            if (breakAt === -1) breakAt = limit;

            chunks.push(remaining.slice(0, breakAt).trim());
            remaining = remaining.slice(breakAt).trim();
        }

        return chunks;
    }

    uptime() {
        const connectionTimeMs = this.state.get("connectTime")
        if (!connectionTimeMs || connectionTimeMs <= 0) {
            return 'Offline';
        }

        const diffMs = Date.now() - connectionTimeMs;
        return this.formatTime(diffMs)
    }

    formatTime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

        return parts.join(' ');
    }

    sequencingGoldBars(amount) {
        const validAmounts = [10000, 5000, 1000, 500, 100, 50, 10, 5, 1];
        const result = [];
        let remaining = Math.floor(amount);

        for (const value of validAmounts) {
            const count = Math.floor(remaining / value);
            if (count > 0) {
                for (let i = 0; i < count; i++) {
                    result.push(value);
                }
                remaining %= value;
            }
        }

        return result;
    }
}

module.exports = UtilsApi