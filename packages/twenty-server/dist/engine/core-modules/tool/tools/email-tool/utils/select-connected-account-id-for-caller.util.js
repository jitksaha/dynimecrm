"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "selectConnectedAccountIdForCaller", {
    enumerable: true,
    get: function() {
        return selectConnectedAccountIdForCaller;
    }
});
const _isconnectedaccountusablebycallerutil = require("../../../../../metadata-modules/connected-account/utils/is-connected-account-usable-by-caller.util");
const selectConnectedAccountIdForCaller = ({ connectedAccounts, userWorkspaceId })=>{
    const ownAccount = connectedAccounts.find((connectedAccount)=>connectedAccount.userWorkspaceId === userWorkspaceId);
    const usableAccount = ownAccount ?? connectedAccounts.find((connectedAccount)=>(0, _isconnectedaccountusablebycallerutil.isConnectedAccountUsableByCaller)({
            connectedAccount,
            userWorkspaceId
        }));
    return usableAccount?.id;
};

//# sourceMappingURL=select-connected-account-id-for-caller.util.js.map