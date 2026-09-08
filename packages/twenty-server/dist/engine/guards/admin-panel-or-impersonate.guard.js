"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelOrImpersonateGuard", {
    enumerable: true,
    get: function() {
        return AdminPanelOrImpersonateGuard;
    }
});
const _graphql = require("@nestjs/graphql");
const _userhasadminprivilegesutil = require("../core-modules/impersonation/utils/user-has-admin-privileges.util");
let AdminPanelOrImpersonateGuard = class AdminPanelOrImpersonateGuard {
    canActivate(context) {
        const ctx = _graphql.GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        return (0, _userhasadminprivilegesutil.userHasAdminPrivileges)(request.user);
    }
};

//# sourceMappingURL=admin-panel-or-impersonate.guard.js.map