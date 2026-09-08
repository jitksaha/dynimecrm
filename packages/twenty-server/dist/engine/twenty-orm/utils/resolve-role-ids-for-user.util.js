"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveRoleIdsForUser", {
    enumerable: true,
    get: function() {
        return resolveRoleIdsForUser;
    }
});
const _utils = require("twenty-shared/utils");
const resolveRoleIdsForUser = ({ userRoleId, applicationRoleId })=>{
    // The application's role must never stand in for a missing user role.
    if (!(0, _utils.isDefined)(userRoleId)) {
        return [];
    }
    return (0, _utils.isDefined)(applicationRoleId) && applicationRoleId !== userRoleId ? [
        userRoleId,
        applicationRoleId
    ] : [
        userRoleId
    ];
};

//# sourceMappingURL=resolve-role-ids-for-user.util.js.map