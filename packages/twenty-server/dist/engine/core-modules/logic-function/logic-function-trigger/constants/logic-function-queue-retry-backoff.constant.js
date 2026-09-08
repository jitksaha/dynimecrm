"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LOGIC_FUNCTION_QUEUE_RETRY_BACKOFF", {
    enumerable: true,
    get: function() {
        return LOGIC_FUNCTION_QUEUE_RETRY_BACKOFF;
    }
});
const LOGIC_FUNCTION_QUEUE_RETRY_BACKOFF = {
    strategy: 'exponential',
    initialDelayMilliseconds: 1_000,
    jitter: 0.5
};

//# sourceMappingURL=logic-function-queue-retry-backoff.constant.js.map