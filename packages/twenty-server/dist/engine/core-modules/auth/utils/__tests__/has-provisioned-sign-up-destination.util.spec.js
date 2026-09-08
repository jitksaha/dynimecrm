"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workspace = require("twenty-shared/workspace");
const _workspacediscoverabilitytype = require("../../../workspace/types/workspace-discoverability.type");
const _hasprovisionedsignupdestinationutil = require("../has-provisioned-sign-up-destination.util");
describe('hasProvisionedSignUpDestination', ()=>{
    it('should not find a destination when nothing is available', ()=>{
        expect((0, _hasprovisionedsignupdestinationutil.hasProvisionedSignUpDestination)([])).toBe(false);
    });
    it('should find a destination in an active workspace', ()=>{
        expect((0, _hasprovisionedsignupdestinationutil.hasProvisionedSignUpDestination)([
            {
                workspace: {
                    activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE
                }
            }
        ])).toBe(true);
    });
    // Suspension is temporary and membership survives it, unlike a workspace
    // that was never provisioned.
    it('should find a destination in a suspended workspace', ()=>{
        expect((0, _hasprovisionedsignupdestinationutil.hasProvisionedSignUpDestination)([
            {
                workspace: {
                    activationStatus: _workspace.WorkspaceActivationStatus.SUSPENDED
                }
            }
        ])).toBe(true);
    });
    it.each([
        _workspace.WorkspaceActivationStatus.PENDING_CREATION,
        _workspace.WorkspaceActivationStatus.ONGOING_CREATION,
        _workspace.WorkspaceActivationStatus.INACTIVE
    ])('should not find a destination in a %s workspace', (activationStatus)=>{
        expect((0, _hasprovisionedsignupdestinationutil.hasProvisionedSignUpDestination)([
            {
                workspace: {
                    activationStatus
                }
            }
        ])).toBe(false);
    });
    // Callers pass invitations to hidden workspaces straight in, so nothing here
    // may key off discoverability.
    it('should find a destination regardless of workspace discoverability', ()=>{
        const hiddenWorkspaceInvitation = {
            workspace: {
                activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE,
                workspaceDiscoverability: _workspacediscoverabilitytype.WorkspaceDiscoverability.HIDDEN
            }
        };
        expect((0, _hasprovisionedsignupdestinationutil.hasProvisionedSignUpDestination)([
            hiddenWorkspaceInvitation
        ])).toBe(true);
    });
    it('should find a destination when only one of several candidates is provisioned', ()=>{
        expect((0, _hasprovisionedsignupdestinationutil.hasProvisionedSignUpDestination)([
            {
                workspace: {
                    activationStatus: _workspace.WorkspaceActivationStatus.PENDING_CREATION
                }
            },
            {
                workspace: {
                    activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE
                }
            }
        ])).toBe(true);
    });
});

//# sourceMappingURL=has-provisioned-sign-up-destination.util.spec.js.map