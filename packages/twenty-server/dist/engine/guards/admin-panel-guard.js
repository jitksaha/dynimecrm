"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelGuard", {
    enumerable: true,
    get: function() {
        return AdminPanelGuard;
    }
});
const _graphql = require("@nestjs/graphql");
const _userisfulladminutil = require("../core-modules/impersonation/utils/user-is-full-admin.util");
let AdminPanelGuard = class AdminPanelGuard {
    canActivate(context) {
        const ctx = _graphql.GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        return (0, _userisfulladminutil.userIsFullAdmin)(request.user);
    }
};

//# sourceMappingURL=admin-panel-guard.js.map