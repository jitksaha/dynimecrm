"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get buildBuildOptions () {
        return buildBuildOptions;
    },
    get buildCreationArgs () {
        return buildCreationArgs;
    },
    get buildFlatPermissionFlag () {
        return buildFlatPermissionFlag;
    },
    get buildStandardAppFlatPermissionFlag () {
        return buildStandardAppFlatPermissionFlag;
    },
    get buildUpdateArgs () {
        return buildUpdateArgs;
    }
});
const _twentystandardapplications = require("../../../../../twenty-standard-application/constants/twenty-standard-applications");
const CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER = 'custom-application';
const buildFlatPermissionFlag = ({ universalIdentifier, key, permissionType = 'settings', applicationUniversalIdentifier = CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER })=>({
        universalIdentifier,
        key,
        permissionType,
        applicationUniversalIdentifier
    });
const buildStandardAppFlatPermissionFlag = (args)=>buildFlatPermissionFlag({
        ...args,
        applicationUniversalIdentifier: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier
    });
const buildMaps = (flags)=>({
        byUniversalIdentifier: Object.fromEntries(flags.map((flag)=>[
                flag.universalIdentifier,
                flag
            ]))
    });
const buildBuildOptions = ({ isCallerStandardApp = false } = {})=>({
        isSystemBuild: false,
        applicationUniversalIdentifier: isCallerStandardApp ? _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier : CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
    });
const buildCreationArgs = ({ flatEntityToValidate, existingFlags = [], isCallerStandardApp = false })=>({
        flatEntityToValidate,
        optimisticFlatEntityMapsAndRelatedFlatEntityMaps: {
            flatPermissionFlagMaps: buildMaps(existingFlags)
        },
        buildOptions: buildBuildOptions({
            isCallerStandardApp
        }),
        workspaceId: 'workspace-id',
        remainingFlatEntityMapsToValidate: buildMaps([]),
        additionalCacheDataMaps: {}
    });
const buildUpdateArgs = ({ universalIdentifier, flatEntityUpdate, existingFlags = [], isCallerStandardApp = false })=>({
        universalIdentifier,
        flatEntityUpdate,
        optimisticFlatEntityMapsAndRelatedFlatEntityMaps: {
            flatPermissionFlagMaps: buildMaps(existingFlags)
        },
        buildOptions: buildBuildOptions({
            isCallerStandardApp
        }),
        workspaceId: 'workspace-id',
        remainingFlatEntityMapsToValidate: buildMaps([]),
        additionalCacheDataMaps: {}
    });

//# sourceMappingURL=flat-permission-flag-validation.test-util.js.map