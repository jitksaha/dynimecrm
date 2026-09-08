"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveWorkspaceIdFromAwsSesResources", {
    enumerable: true,
    get: function() {
        return resolveWorkspaceIdFromAwsSesResources;
    }
});
const _utils = require("twenty-shared/utils");
const _parseworkspaceidfromawssesresourcearnutil = require("./parse-workspace-id-from-aws-ses-resource-arn.util");
const resolveWorkspaceIdFromAwsSesResources = (resources)=>{
    if (!(0, _utils.isNonEmptyArray)(resources)) {
        return null;
    }
    for (const resourceArn of resources){
        const workspaceId = (0, _parseworkspaceidfromawssesresourcearnutil.parseWorkspaceIdFromAwsSesResourceArn)(resourceArn);
        if ((0, _utils.isDefined)(workspaceId)) {
            return workspaceId;
        }
    }
    return null;
};

//# sourceMappingURL=resolve-workspace-id-from-aws-ses-resources.util.js.map