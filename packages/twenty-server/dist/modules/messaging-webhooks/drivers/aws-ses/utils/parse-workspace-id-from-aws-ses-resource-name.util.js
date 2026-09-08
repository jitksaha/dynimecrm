"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseWorkspaceIdFromAwsSesResourceName", {
    enumerable: true,
    get: function() {
        return parseWorkspaceIdFromAwsSesResourceName;
    }
});
const _awssesresourcenameprefixconstant = require("../../../../../engine/core-modules/emailing-domain/drivers/aws-ses/constants/aws-ses-resource-name-prefix.constant");
const parseWorkspaceIdFromAwsSesResourceName = (resourceName)=>{
    const expectedPrefix = `${_awssesresourcenameprefixconstant.AWS_SES_RESOURCE_NAME_PREFIX}-`;
    if (!resourceName.startsWith(expectedPrefix)) {
        return null;
    }
    const workspaceId = resourceName.slice(expectedPrefix.length);
    return workspaceId.length > 0 ? workspaceId : null;
};

//# sourceMappingURL=parse-workspace-id-from-aws-ses-resource-name.util.js.map