"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get userCanServerImpersonate () {
        return _usercanserverimpersonateutil.userCanServerImpersonate;
    },
    get userHasAdminPrivileges () {
        return _userhasadminprivilegesutil.userHasAdminPrivileges;
    },
    get userIsFullAdmin () {
        return _userisfulladminutil.userIsFullAdmin;
    }
});
const _usercanserverimpersonateutil = require("./user-can-server-impersonate.util");
const _userhasadminprivilegesutil = require("./user-has-admin-privileges.util");
const _userisfulladminutil = require("./user-is-full-admin.util");

//# sourceMappingURL=index.js.map