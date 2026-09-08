"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServerLevelImpersonateGuard", {
    enumerable: true,
    get: function() {
        return ServerLevelImpersonateGuard;
    }
});
const _graphql = require("@nestjs/graphql");
const _usercanserverimpersonateutil = require("../core-modules/impersonation/utils/user-can-server-impersonate.util");
let ServerLevelImpersonateGuard = class ServerLevelImpersonateGuard {
    canActivate(context) {
        const ctx = _graphql.GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        return (0, _usercanserverimpersonateutil.userCanServerImpersonate)(request.user);
    }
};

//# sourceMappingURL=server-level-impersonate.guard.js.map