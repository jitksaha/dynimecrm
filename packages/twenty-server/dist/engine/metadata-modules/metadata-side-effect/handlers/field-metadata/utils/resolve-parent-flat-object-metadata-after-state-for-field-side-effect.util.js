"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveParentFlatObjectMetadataAfterStateForFieldSideEffect", {
    enumerable: true,
    get: function() {
        return resolveParentFlatObjectMetadataAfterStateForFieldSideEffect;
    }
});
const resolveParentFlatObjectMetadataAfterStateForFieldSideEffect = ({ objectMetadataUniversalIdentifier, allFlatEntityOperationRecordByMetadataName, relatedFlatEntityMaps })=>{
    const pendingFlatObjectMetadata = allFlatEntityOperationRecordByMetadataName.objectMetadata?.flatEntityToUpdate[objectMetadataUniversalIdentifier] ?? allFlatEntityOperationRecordByMetadataName.objectMetadata?.flatEntityToCreate[objectMetadataUniversalIdentifier];
    return pendingFlatObjectMetadata ?? relatedFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[objectMetadataUniversalIdentifier];
};

//# sourceMappingURL=resolve-parent-flat-object-metadata-after-state-for-field-side-effect.util.js.map