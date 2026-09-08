"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getSignUpWithoutWorkspaceDecision", {
    enumerable: true,
    get: function() {
        return getSignUpWithoutWorkspaceDecision;
    }
});
const getSignUpWithoutWorkspaceDecision = ({ isMultiWorkspaceEnabled, isWorkspaceCreationLimitedToServerAdmins, workspaceCount })=>{
    if (workspaceCount === 0) {
        return 'allowed';
    }
    if (!isMultiWorkspaceEnabled) {
        return 'refused';
    }
    if (!isWorkspaceCreationLimitedToServerAdmins) {
        return 'allowed';
    }
    return 'requiresDestination';
};

//# sourceMappingURL=get-sign-up-without-workspace-decision.util.js.map