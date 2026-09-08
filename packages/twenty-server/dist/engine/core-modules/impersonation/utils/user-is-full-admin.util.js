"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "userIsFullAdmin", {
    enumerable: true,
    get: function() {
        return userIsFullAdmin;
    }
});
const userIsFullAdmin = (user)=>user.canAccessFullAdminPanel === true;

//# sourceMappingURL=user-is-full-admin.util.js.map