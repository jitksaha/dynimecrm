"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getUserFromAuthContext", {
    enumerable: true,
    get: function() {
        return getUserFromAuthContext;
    }
});
const _isuserauthcontextguard = require("../../../../engine/core-modules/auth/guards/is-user-auth-context.guard");
const getUserFromAuthContext = (authContext)=>(0, _isuserauthcontextguard.isUserAuthContext)(authContext) ? {
        userId: authContext.user.id,
        userWorkspaceId: authContext.userWorkspaceId
    } : {};

//# sourceMappingURL=get-user-from-auth-context.util.js.map