"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getUsageLimitErrorCode", {
    enumerable: true,
    get: function() {
        return getUsageLimitErrorCode;
    }
});
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
const _usagelimitexception = require("../exceptions/usage-limit.exception");
const getUsageLimitErrorCode = (code)=>code === _usagelimitexception.UsageLimitExceptionCode.QUOTA_EXHAUSTED ? _graphqlerrorsutil.ErrorCode.QUOTA_EXHAUSTED : _graphqlerrorsutil.ErrorCode.RATE_LIMITED;

//# sourceMappingURL=get-usage-limit-error-code.util.js.map