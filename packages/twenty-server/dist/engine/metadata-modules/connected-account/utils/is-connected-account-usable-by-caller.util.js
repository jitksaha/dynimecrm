"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isConnectedAccountUsableByCaller", {
    enumerable: true,
    get: function() {
        return isConnectedAccountUsableByCaller;
    }
});
const isConnectedAccountUsableByCaller = ({ connectedAccount, userWorkspaceId })=>connectedAccount.visibility === 'workspace' || connectedAccount.userWorkspaceId === userWorkspaceId;

//# sourceMappingURL=is-connected-account-usable-by-caller.util.js.map