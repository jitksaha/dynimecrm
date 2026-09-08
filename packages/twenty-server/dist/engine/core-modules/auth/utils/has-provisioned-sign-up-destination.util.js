"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasProvisionedSignUpDestination", {
    enumerable: true,
    get: function() {
        return hasProvisionedSignUpDestination;
    }
});
const _workspace = require("twenty-shared/workspace");
const hasProvisionedSignUpDestination = (availableWorkspacesForSignUp)=>availableWorkspacesForSignUp.some(({ workspace })=>(0, _workspace.isWorkspaceProvisioned)(workspace));

//# sourceMappingURL=has-provisioned-sign-up-destination.util.js.map