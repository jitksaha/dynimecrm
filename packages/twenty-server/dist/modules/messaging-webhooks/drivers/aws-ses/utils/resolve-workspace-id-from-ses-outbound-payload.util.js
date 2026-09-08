"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveWorkspaceIdFromSesOutboundPayload", {
    enumerable: true,
    get: function() {
        return resolveWorkspaceIdFromSesOutboundPayload;
    }
});
const _utils = require("twenty-shared/utils");
const _parseworkspaceidfromawssesresourcenameutil = require("./parse-workspace-id-from-aws-ses-resource-name.util");
const CONFIGURATION_SET_MAIL_TAG_KEY = 'ses:configuration-set';
const resolveWorkspaceIdFromSesOutboundPayload = (payload)=>{
    const configurationSetNames = payload.mail?.tags?.[CONFIGURATION_SET_MAIL_TAG_KEY] ?? [];
    for (const configurationSetName of configurationSetNames){
        const workspaceId = (0, _parseworkspaceidfromawssesresourcenameutil.parseWorkspaceIdFromAwsSesResourceName)(configurationSetName);
        if ((0, _utils.isDefined)(workspaceId)) {
            return workspaceId;
        }
    }
    return null;
};

//# sourceMappingURL=resolve-workspace-id-from-ses-outbound-payload.util.js.map