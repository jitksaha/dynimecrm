"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "userHasAdminPrivileges", {
    enumerable: true,
    get: function() {
        return userHasAdminPrivileges;
    }
});
const _usercanserverimpersonateutil = require("./user-can-server-impersonate.util");
const _userisfulladminutil = require("./user-is-full-admin.util");
const userHasAdminPrivileges = (user)=>(0, _usercanserverimpersonateutil.userCanServerImpersonate)(user) || (0, _userisfulladminutil.userIsFullAdmin)(user);

//# sourceMappingURL=user-has-admin-privileges.util.js.map