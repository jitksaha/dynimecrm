"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSpendersFromAuthContext", {
    enumerable: true,
    get: function() {
        return buildSpendersFromAuthContext;
    }
});
const _utils = require("twenty-shared/utils");
const _buildusagespendersfromauthcontextutil = require("../../usage/utils/build-usage-spenders-from-auth-context.util");
const buildSpendersFromAuthContext = (authContext)=>{
    const { userWorkspaceId, apiKeyId, applicationId } = (0, _buildusagespendersfromauthcontextutil.buildUsageSpendersFromAuthContext)(authContext);
    const spenders = [];
    if ((0, _utils.isDefined)(userWorkspaceId)) {
        spenders.push({
            spenderType: 'userWorkspace',
            spenderId: userWorkspaceId
        });
    }
    if ((0, _utils.isDefined)(apiKeyId)) {
        spenders.push({
            spenderType: 'apiKey',
            spenderId: apiKeyId
        });
    }
    if ((0, _utils.isDefined)(applicationId)) {
        spenders.push({
            spenderType: 'application',
            spenderId: applicationId
        });
    }
    spenders.push({
        spenderType: 'workspace',
        spenderId: ''
    });
    return spenders;
};

//# sourceMappingURL=build-spenders-from-auth-context.util.js.map