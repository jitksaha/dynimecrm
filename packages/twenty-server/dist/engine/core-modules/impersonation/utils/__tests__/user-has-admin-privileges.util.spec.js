"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _userhasadminprivilegesutil = require("../user-has-admin-privileges.util");
describe('userHasAdminPrivileges', ()=>{
    it('should be true when canImpersonate is true', ()=>{
        expect((0, _userhasadminprivilegesutil.userHasAdminPrivileges)({
            canImpersonate: true,
            canAccessFullAdminPanel: false
        })).toBe(true);
    });
    it('should be true when canAccessFullAdminPanel is true', ()=>{
        expect((0, _userhasadminprivilegesutil.userHasAdminPrivileges)({
            canImpersonate: false,
            canAccessFullAdminPanel: true
        })).toBe(true);
    });
    it('should be false when neither privilege is set', ()=>{
        expect((0, _userhasadminprivilegesutil.userHasAdminPrivileges)({
            canImpersonate: false,
            canAccessFullAdminPanel: false
        })).toBe(false);
    });
});

//# sourceMappingURL=user-has-admin-privileges.util.spec.js.map