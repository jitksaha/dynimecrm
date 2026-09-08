"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _userisfulladminutil = require("../user-is-full-admin.util");
describe('userIsFullAdmin', ()=>{
    it('should be true only when canAccessFullAdminPanel is true', ()=>{
        expect((0, _userisfulladminutil.userIsFullAdmin)({
            canAccessFullAdminPanel: true,
            canImpersonate: false
        })).toBe(true);
        expect((0, _userisfulladminutil.userIsFullAdmin)({
            canAccessFullAdminPanel: false,
            canImpersonate: true
        })).toBe(false);
    });
});

//# sourceMappingURL=user-is-full-admin.util.spec.js.map