"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveRoleIdsFromAuthContext", {
    enumerable: true,
    get: function() {
        return resolveRoleIdsFromAuthContext;
    }
});
const _utils = require("twenty-shared/utils");
const _isapikeyauthcontextguard = require("../../core-modules/auth/guards/is-api-key-auth-context.guard");
const _isapplicationauthcontextguard = require("../../core-modules/auth/guards/is-application-auth-context.guard");
const _isuserauthcontextguard = require("../../core-modules/auth/guards/is-user-auth-context.guard");
const _resolveroleidsforuserutil = require("./resolve-role-ids-for-user.util");
const resolveRoleIdsFromAuthContext = ({ authContext, userWorkspaceRoleMap, apiKeyRoleMap })=>{
    if ((0, _isuserauthcontextguard.isUserAuthContext)(authContext)) {
        return (0, _resolveroleidsforuserutil.resolveRoleIdsForUser)({
            userRoleId: userWorkspaceRoleMap[authContext.userWorkspaceId],
            applicationRoleId: authContext.application?.defaultRoleId
        });
    }
    if ((0, _isapikeyauthcontextguard.isApiKeyAuthContext)(authContext)) {
        const apiKeyRoleId = apiKeyRoleMap[authContext.apiKey.id];
        return (0, _utils.isDefined)(apiKeyRoleId) ? [
            apiKeyRoleId
        ] : [];
    }
    if ((0, _isapplicationauthcontextguard.isApplicationAuthContext)(authContext)) {
        const applicationRoleId = authContext.application.defaultRoleId;
        return (0, _utils.isDefined)(applicationRoleId) ? [
            applicationRoleId
        ] : [];
    }
    return [];
};

//# sourceMappingURL=resolve-role-ids-from-auth-context.util.js.map