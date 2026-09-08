"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildRateLimitResponseHeaders", {
    enumerable: true,
    get: function() {
        return buildRateLimitResponseHeaders;
    }
});
const buildRateLimitResponseHeaders = ({ exhaustedScope, retryAfterSeconds })=>({
        'Retry-After': String(retryAfterSeconds),
        'X-RateLimit-Limit': String(exhaustedScope.limitValue),
        'X-RateLimit-Remaining': String(exhaustedScope.remaining),
        'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + retryAfterSeconds)
    });

//# sourceMappingURL=build-rate-limit-response-headers.util.js.map