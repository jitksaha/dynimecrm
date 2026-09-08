"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "enrichApplicationManifestSyncError", {
    enumerable: true,
    get: function() {
        return enrichApplicationManifestSyncError;
    }
});
const _utils = require("twenty-shared/utils");
const _findmanifestentitydescriptorbyuniversalidentifierutil = require("./find-manifest-entity-descriptor-by-universal-identifier.util");
const _applicationexception = require("../../application.exception");
const _getflatentitymapsexceptioncontextutil = require("../../../../metadata-modules/flat-entity/utils/get-flat-entity-maps-exception-context.util");
const enrichApplicationManifestSyncError = ({ error, manifest })=>{
    const context = (0, _getflatentitymapsexceptioncontextutil.getFlatEntityMapsExceptionContext)(error);
    if (!(0, _utils.isDefined)(context)) {
        return error;
    }
    const applicationDisplayName = manifest.application.displayName;
    const originalMessage = error instanceof Error ? error.message : String(error);
    const descriptor = (0, _utils.isDefined)(context.universalIdentifier) ? (0, _findmanifestentitydescriptorbyuniversalidentifierutil.findManifestEntityDescriptorByUniversalIdentifier)({
        manifest,
        universalIdentifier: context.universalIdentifier
    }) : undefined;
    if ((0, _utils.isDefined)(descriptor)) {
        const { entityKind, label } = descriptor;
        const humanEntity = (0, _utils.isDefined)(label) ? `${entityKind} "${label}"` : entityKind;
        const developerDetail = (0, _utils.isDefined)(label) ? `${entityKind}: ${label}` : entityKind;
        return new _applicationexception.ApplicationException(`Installing application '${applicationDisplayName}' failed [${developerDetail}]: ${originalMessage}`, _applicationexception.ApplicationExceptionCode.APPLICATION_INSTALLATION_FAILED, {
            userFriendlyMessage: /*i18n*/ {
                id: "QJUYcw",
                message: 'We couldn\'t install "{applicationDisplayName}". Its {humanEntity} could not be applied to your workspace.',
                values: {
                    applicationDisplayName: applicationDisplayName,
                    humanEntity: humanEntity
                }
            },
            context
        });
    }
    return new _applicationexception.ApplicationException(`Installing application '${applicationDisplayName}' failed: ${originalMessage}`, _applicationexception.ApplicationExceptionCode.APPLICATION_INSTALLATION_FAILED, {
        userFriendlyMessage: /*i18n*/ {
            id: "N/EFgn",
            message: 'We couldn\'t install "{applicationDisplayName}" because some of its metadata could not be applied to your workspace.',
            values: {
                applicationDisplayName: applicationDisplayName
            }
        },
        context
    });
};

//# sourceMappingURL=enrich-application-manifest-sync-error.util.js.map