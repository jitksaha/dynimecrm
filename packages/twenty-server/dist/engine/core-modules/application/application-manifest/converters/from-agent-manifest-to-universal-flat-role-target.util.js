"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromAgentManifestToUniversalFlatRoleTarget", {
    enumerable: true,
    get: function() {
        return fromAgentManifestToUniversalFlatRoleTarget;
    }
});
const _application = require("twenty-shared/application");
const fromAgentManifestToUniversalFlatRoleTarget = ({ agentUniversalIdentifier, roleUniversalIdentifier, applicationUniversalIdentifier, now })=>{
    return {
        universalIdentifier: (0, _application.getRoleTargetUniversalIdentifier)({
            applicationUniversalIdentifier,
            agentUniversalIdentifier
        }),
        applicationUniversalIdentifier,
        roleUniversalIdentifier,
        agentUniversalIdentifier,
        userWorkspaceId: null,
        apiKeyId: null,
        createdAt: now,
        updatedAt: now
    };
};

//# sourceMappingURL=from-agent-manifest-to-universal-flat-role-target.util.js.map