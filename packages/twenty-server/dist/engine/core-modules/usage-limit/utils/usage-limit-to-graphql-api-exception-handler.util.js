"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "usageLimitToGraphqlApiExceptionHandler", {
    enumerable: true,
    get: function() {
        return usageLimitToGraphqlApiExceptionHandler;
    }
});
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
const _getusagelimiterrorcodeutil = require("./get-usage-limit-error-code.util");
const usageLimitToGraphqlApiExceptionHandler = (error)=>{
    const { exhaustedScope } = error;
    const commonExtensions = {
        subCode: error.code,
        userFriendlyMessage: error.userFriendlyMessage
    };
    if (!(0, _utils.isDefined)(exhaustedScope)) {
        throw new _graphqlerrorsutil.BaseGraphQLError(error.message, (0, _getusagelimiterrorcodeutil.getUsageLimitErrorCode)(error.code), commonExtensions);
    }
    throw new _graphqlerrorsutil.BaseGraphQLError(error.message, (0, _getusagelimiterrorcodeutil.getUsageLimitErrorCode)(error.code), {
        ...commonExtensions,
        limitKind: exhaustedScope.limitKind,
        limit: exhaustedScope.limitValue,
        remaining: exhaustedScope.remaining,
        windowSeconds: exhaustedScope.windowSeconds,
        retryAfterMs: exhaustedScope.retryAfterMs,
        scope: {
            spenderType: exhaustedScope.spenderType,
            spenderId: exhaustedScope.spenderId
        }
    });
};

//# sourceMappingURL=usage-limit-to-graphql-api-exception-handler.util.js.map