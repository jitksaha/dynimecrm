"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeSameBatchViewFieldPositionByFieldUniversalIdentifier", {
    enumerable: true,
    get: function() {
        return computeSameBatchViewFieldPositionByFieldUniversalIdentifier;
    }
});
const _computedefaultviewfieldpositionbyfielduniversalidentifierutil = require("./compute-default-view-field-position-by-field-universal-identifier.util");
const _computeviewfieldpositioninputflatfieldmetadatasutil = require("./compute-view-field-position-input-flat-field-metadatas.util");
const computeSameBatchViewFieldPositionByFieldUniversalIdentifier = ({ sourceFlatFieldMetadata, parentFlatObjectMetadata, allFlatEntityOperationRecordByMetadataName, labelIdentifierPolicy })=>{
    const { labelIdentifierFieldMetadataUniversalIdentifier } = parentFlatObjectMetadata;
    const { systemFlatFieldMetadatas, callerFlatFieldMetadatas } = (0, _computeviewfieldpositioninputflatfieldmetadatasutil.computeViewFieldPositionInputFlatFieldMetadatas)({
        applicationUniversalIdentifier: parentFlatObjectMetadata.applicationUniversalIdentifier,
        objectMetadataUniversalIdentifier: sourceFlatFieldMetadata.objectMetadataUniversalIdentifier,
        labelIdentifierFieldMetadataUniversalIdentifier,
        allFlatEntityOperationRecordByMetadataName
    });
    return (0, _computedefaultviewfieldpositionbyfielduniversalidentifierutil.computeDefaultViewFieldPositionByFieldUniversalIdentifier)({
        systemFlatFieldMetadatas,
        callerFlatFieldMetadatas,
        labelIdentifierFieldMetadataUniversalIdentifier,
        labelIdentifierPolicy
    });
};

//# sourceMappingURL=compute-same-batch-view-field-position-by-field-universal-identifier.util.js.map