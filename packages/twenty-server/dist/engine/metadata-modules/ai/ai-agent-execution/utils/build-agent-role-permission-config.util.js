"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildAgentRolePermissionConfig", {
    enumerable: true,
    get: function() {
        return buildAgentRolePermissionConfig;
    }
});
const _utils = require("twenty-shared/utils");
const buildAgentRolePermissionConfig = ({ agentRoleId, runAsRoleId })=>{
    if ((0, _utils.isDefined)(runAsRoleId)) {
        return {
            intersectionOf: [
                runAsRoleId
            ]
        };
    }
    return {
        intersectionOf: [
            agentRoleId
        ]
    };
};

//# sourceMappingURL=build-agent-role-permission-config.util.js.map