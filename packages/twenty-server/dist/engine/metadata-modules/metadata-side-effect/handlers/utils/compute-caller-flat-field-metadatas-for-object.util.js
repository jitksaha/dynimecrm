"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeCallerFlatFieldMetadatasForObject", {
    enumerable: true,
    get: function() {
        return computeCallerFlatFieldMetadatasForObject;
    }
});
const _orderflatfieldmetadatasforsystemindexviewutil = require("../../../object-metadata/utils/order-flat-field-metadatas-for-system-index-view.util");
const computeCallerFlatFieldMetadatasForObject = ({ objectMetadataUniversalIdentifier, labelIdentifierFieldMetadataUniversalIdentifier, allFlatEntityOperationRecordByMetadataName })=>(0, _orderflatfieldmetadatasforsystemindexviewutil.orderFlatFieldMetadatasForSystemIndexView)({
        labelIdentifierFieldMetadataUniversalIdentifier,
        flatFieldMetadatas: Object.values(allFlatEntityOperationRecordByMetadataName.fieldMetadata?.flatEntityToCreate ?? {}).filter((flatFieldMetadata)=>flatFieldMetadata.objectMetadataUniversalIdentifier === objectMetadataUniversalIdentifier && !flatFieldMetadata.isSystemSideEffect)
    });

//# sourceMappingURL=compute-caller-flat-field-metadatas-for-object.util.js.map