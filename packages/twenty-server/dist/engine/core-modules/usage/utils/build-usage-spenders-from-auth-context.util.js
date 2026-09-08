/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildUsageSpendersFromAuthContext", {
    enumerable: true,
    get: function() {
        return buildUsageSpendersFromAuthContext;
    }
});
const _isapikeyauthcontextguard = require("../../auth/guards/is-api-key-auth-context.guard");
const _isapplicationauthcontextguard = require("../../auth/guards/is-application-auth-context.guard");
const _isuserauthcontextguard = require("../../auth/guards/is-user-auth-context.guard");
const buildUsageSpendersFromAuthContext = (authContext)=>{
    if ((0, _isapikeyauthcontextguard.isApiKeyAuthContext)(authContext)) {
        return {
            apiKeyId: authContext.apiKey.id
        };
    }
    if ((0, _isapplicationauthcontextguard.isApplicationAuthContext)(authContext)) {
        return {
            applicationId: authContext.application.id
        };
    }
    if ((0, _isuserauthcontextguard.isUserAuthContext)(authContext)) {
        return {
            userWorkspaceId: authContext.userWorkspaceId,
            applicationId: authContext.application?.id ?? authContext.viaApplication?.id
        };
    }
    return {};
};

//# sourceMappingURL=build-usage-spenders-from-auth-context.util.js.map