"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildPreallocatedIdByUniversalIdentifierFromActions", {
    enumerable: true,
    get: function() {
        return buildPreallocatedIdByUniversalIdentifierFromActions;
    }
});
const _utils = require("twenty-shared/utils");
const buildPreallocatedIdByUniversalIdentifierFromActions = (actions)=>{
    const preallocatedIdByUniversalIdentifierByMetadataName = {};
    const registerId = ({ metadataName, universalIdentifier, id })=>{
        if (!(0, _utils.isDefined)(id)) {
            return;
        }
        const idByUniversalIdentifier = preallocatedIdByUniversalIdentifierByMetadataName[metadataName] ?? {};
        idByUniversalIdentifier[universalIdentifier] = id;
        preallocatedIdByUniversalIdentifierByMetadataName[metadataName] = idByUniversalIdentifier;
    };
    for (const action of actions){
        if (action.type !== 'create') {
            continue;
        }
        registerId({
            metadataName: action.metadataName,
            universalIdentifier: action.flatEntity.universalIdentifier,
            id: action.id
        });
        if (action.metadataName === 'objectMetadata') {
            const fieldIdByUniversalIdentifier = action.fieldIdByUniversalIdentifier ?? {};
            for (const universalFlatFieldMetadata of action.universalFlatFieldMetadatas){
                registerId({
                    metadataName: 'fieldMetadata',
                    universalIdentifier: universalFlatFieldMetadata.universalIdentifier,
                    id: fieldIdByUniversalIdentifier[universalFlatFieldMetadata.universalIdentifier]
                });
            }
        }
        if (action.metadataName === 'fieldMetadata' && (0, _utils.isDefined)(action.relatedUniversalFlatFieldMetadata)) {
            registerId({
                metadataName: 'fieldMetadata',
                universalIdentifier: action.relatedUniversalFlatFieldMetadata.universalIdentifier,
                id: action.relatedFieldId
            });
        }
    }
    return preallocatedIdByUniversalIdentifierByMetadataName;
};

//# sourceMappingURL=build-preallocated-id-by-universal-identifier-from-actions.util.js.map