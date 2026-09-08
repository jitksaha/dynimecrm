"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "usageLimitToRestApiExceptionHandler", {
    enumerable: true,
    get: function() {
        return usageLimitToRestApiExceptionHandler;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _usagelimithttpexception = require("../exceptions/usage-limit-http.exception");
const _buildratelimitresponseheadersutil = require("./build-rate-limit-response-headers.util");
const _getretryaftersecondsutil = require("./get-retry-after-seconds.util");
const _getusagelimiterrorcodeutil = require("./get-usage-limit-error-code.util");
const usageLimitToRestApiExceptionHandler = (error)=>{
    const { exhaustedScope } = error;
    if (!(0, _utils.isDefined)(exhaustedScope)) {
        throw new _common.HttpException(error.message, _common.HttpStatus.TOO_MANY_REQUESTS);
    }
    const retryAfterSeconds = (0, _getretryaftersecondsutil.getRetryAfterSeconds)(exhaustedScope.retryAfterMs);
    throw new _usagelimithttpexception.UsageLimitHttpException({
        statusCode: _common.HttpStatus.TOO_MANY_REQUESTS,
        error: (0, _getusagelimiterrorcodeutil.getUsageLimitErrorCode)(error.code),
        messages: [
            error.message
        ],
        limitKind: exhaustedScope.limitKind,
        scope: {
            spenderType: exhaustedScope.spenderType,
            spenderId: exhaustedScope.spenderId
        },
        limit: exhaustedScope.limitValue,
        remaining: exhaustedScope.remaining,
        windowSeconds: exhaustedScope.windowSeconds,
        retryAfterSeconds
    }, (0, _buildratelimitresponseheadersutil.buildRateLimitResponseHeaders)({
        exhaustedScope,
        retryAfterSeconds
    }));
};

//# sourceMappingURL=usage-limit-to-rest-api-exception-handler.util.js.map