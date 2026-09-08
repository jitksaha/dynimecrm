// Retry-After is expressed in whole seconds, and a value of 0 would invite an
// immediate retry that is guaranteed to be denied again.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRetryAfterSeconds", {
    enumerable: true,
    get: function() {
        return getRetryAfterSeconds;
    }
});
const getRetryAfterSeconds = (retryAfterMs)=>Math.max(1, Math.ceil(retryAfterMs / 1000));

//# sourceMappingURL=get-retry-after-seconds.util.js.map