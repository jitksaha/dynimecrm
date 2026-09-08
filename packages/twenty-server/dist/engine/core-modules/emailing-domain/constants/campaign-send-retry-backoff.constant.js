"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CAMPAIGN_SEND_RETRY_BACKOFF", {
    enumerable: true,
    get: function() {
        return CAMPAIGN_SEND_RETRY_BACKOFF;
    }
});
const CAMPAIGN_SEND_RETRY_BACKOFF = {
    strategy: 'exponential',
    initialDelayMilliseconds: 5_000,
    jitter: 0.5
};

//# sourceMappingURL=campaign-send-retry-backoff.constant.js.map