"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "keepWorkspaceOwnedProperties", {
    enumerable: true,
    get: function() {
        return keepWorkspaceOwnedProperties;
    }
});
const _utils = require("twenty-shared/utils");
const _workspaceownedpropertiesbymetadatanameconstant = require("../constant/workspace-owned-properties-by-metadata-name.constant");
const keepWorkspaceOwnedProperties = ({ metadataName, fromFlatEntityMaps, toFlatEntityMaps })=>{
    const workspaceOwnedProperties = _workspaceownedpropertiesbymetadatanameconstant.WORKSPACE_OWNED_PROPERTIES_BY_METADATA_NAME[metadataName];
    if (!(0, _utils.isDefined)(workspaceOwnedProperties)) {
        return toFlatEntityMaps;
    }
    const byUniversalIdentifier = {
        ...toFlatEntityMaps.byUniversalIdentifier
    };
    for (const [universalIdentifier, toFlatEntity] of Object.entries(byUniversalIdentifier)){
        const fromFlatEntity = fromFlatEntityMaps.byUniversalIdentifier[universalIdentifier];
        if (!(0, _utils.isDefined)(fromFlatEntity) || !(0, _utils.isDefined)(toFlatEntity)) {
            continue;
        }
        // A property missing from the workspace entity means its cache predates the
        // property, and the application default is the only value to go on.
        const keptProperties = Object.fromEntries(workspaceOwnedProperties.map((property)=>[
                property,
                fromFlatEntity[property]
            ]).filter(([, value])=>(0, _utils.isDefined)(value)));
        byUniversalIdentifier[universalIdentifier] = {
            ...toFlatEntity,
            ...keptProperties
        };
    }
    return {
        ...toFlatEntityMaps,
        byUniversalIdentifier
    };
};

//# sourceMappingURL=keep-workspace-owned-properties.util.js.map