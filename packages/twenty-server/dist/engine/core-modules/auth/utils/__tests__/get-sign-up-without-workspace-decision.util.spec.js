"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getsignupwithoutworkspacedecisionutil = require("../get-sign-up-without-workspace-decision.util");
describe('getSignUpWithoutWorkspaceDecision', ()=>{
    it('should allow the first sign up of a fresh instance whatever the restrictions', ()=>{
        expect((0, _getsignupwithoutworkspacedecisionutil.getSignUpWithoutWorkspaceDecision)({
            isMultiWorkspaceEnabled: false,
            isWorkspaceCreationLimitedToServerAdmins: true,
            workspaceCount: 0
        })).toBe('allowed');
    });
    it('should refuse a sign up on a single-workspace instance that already has one', ()=>{
        expect((0, _getsignupwithoutworkspacedecisionutil.getSignUpWithoutWorkspaceDecision)({
            isMultiWorkspaceEnabled: false,
            isWorkspaceCreationLimitedToServerAdmins: false,
            workspaceCount: 1
        })).toBe('refused');
    });
    it('should allow a sign up without a destination when workspace creation is unrestricted', ()=>{
        expect((0, _getsignupwithoutworkspacedecisionutil.getSignUpWithoutWorkspaceDecision)({
            isMultiWorkspaceEnabled: true,
            isWorkspaceCreationLimitedToServerAdmins: false,
            workspaceCount: 1
        })).toBe('allowed');
    });
    it('should require a destination when workspace creation is restricted to server admins', ()=>{
        expect((0, _getsignupwithoutworkspacedecisionutil.getSignUpWithoutWorkspaceDecision)({
            isMultiWorkspaceEnabled: true,
            isWorkspaceCreationLimitedToServerAdmins: true,
            workspaceCount: 1
        })).toBe('requiresDestination');
    });
});

//# sourceMappingURL=get-sign-up-without-workspace-decision.util.spec.js.map