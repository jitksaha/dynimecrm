"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _usercanserverimpersonateutil = require("../user-can-server-impersonate.util");
describe('userCanServerImpersonate', ()=>{
    it('should be true only when canImpersonate is true', ()=>{
        expect((0, _usercanserverimpersonateutil.userCanServerImpersonate)({
            canImpersonate: true,
            canAccessFullAdminPanel: false
        })).toBe(true);
        expect((0, _usercanserverimpersonateutil.userCanServerImpersonate)({
            canImpersonate: false,
            canAccessFullAdminPanel: true
        })).toBe(false);
    });
});

//# sourceMappingURL=user-can-server-impersonate.util.spec.js.map