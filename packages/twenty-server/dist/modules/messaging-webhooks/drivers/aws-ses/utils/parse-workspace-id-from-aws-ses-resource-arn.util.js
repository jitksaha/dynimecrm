"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseWorkspaceIdFromAwsSesResourceArn", {
    enumerable: true,
    get: function() {
        return parseWorkspaceIdFromAwsSesResourceArn;
    }
});
const _utils = require("twenty-shared/utils");
const _parseworkspaceidfromawssesresourcenameutil = require("./parse-workspace-id-from-aws-ses-resource-name.util");
const parseWorkspaceIdFromAwsSesResourceArn = (resourceArn)=>{
    const slashIndex = resourceArn.indexOf('/');
    if (slashIndex === -1) {
        return null;
    }
    const afterPrefix = resourceArn.slice(slashIndex + 1);
    const resourceName = afterPrefix.split('/')[0];
    if (!(0, _utils.isDefined)(resourceName)) {
        return null;
    }
    return (0, _parseworkspaceidfromawssesresourcenameutil.parseWorkspaceIdFromAwsSesResourceName)(resourceName);
};

//# sourceMappingURL=parse-workspace-id-from-aws-ses-resource-arn.util.js.map