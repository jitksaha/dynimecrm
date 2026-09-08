"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFlatApplicationToApplicationDto", {
    enumerable: true,
    get: function() {
        return fromFlatApplicationToApplicationDto;
    }
});
const _applicationstateenum = require("../enums/application-state.enum");
const fromFlatApplicationToApplicationDto = ({ canBeUninstalled, autoUpgrade, description, id, logo, name, packageJsonChecksum, packageJsonFileId, yarnLockChecksum, yarnLockFileId, availablePackages, universalIdentifier, version, state, settingsCustomTabFrontComponentId })=>{
    return {
        canBeUninstalled,
        autoUpgrade,
        description: description ?? undefined,
        id,
        logo: logo ?? undefined,
        name,
        objects: [],
        packageJsonChecksum: packageJsonChecksum ?? undefined,
        packageJsonFileId: packageJsonFileId ?? undefined,
        yarnLockChecksum: yarnLockChecksum ?? undefined,
        yarnLockFileId: yarnLockFileId ?? undefined,
        availablePackages: availablePackages ?? {},
        universalIdentifier,
        version: version ?? undefined,
        state: state ?? _applicationstateenum.ApplicationState.INSTALLED,
        settingsCustomTabFrontComponentId: settingsCustomTabFrontComponentId ?? undefined
    };
};

//# sourceMappingURL=from-flat-application-to-application-dto.util.js.map