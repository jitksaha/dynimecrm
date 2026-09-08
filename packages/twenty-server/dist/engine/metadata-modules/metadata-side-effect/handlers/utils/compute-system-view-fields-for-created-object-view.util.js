"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeSystemViewFieldsForCreatedObjectView", {
    enumerable: true,
    get: function() {
        return computeSystemViewFieldsForCreatedObjectView;
    }
});
const _computedefaultviewfieldpositionbyfielduniversalidentifierutil = require("./compute-default-view-field-position-by-field-universal-identifier.util");
const _computesystemviewfieldstocreateutil = require("./compute-system-view-fields-to-create.util");
const _computeviewfieldpositioninputflatfieldmetadatasutil = require("./compute-view-field-position-input-flat-field-metadatas.util");
const computeSystemViewFieldsForCreatedObjectView = ({ sourceFlatObjectMetadata, viewUniversalIdentifier, allFlatEntityOperationRecordByMetadataName, labelIdentifierPolicy })=>{
    const { applicationUniversalIdentifier, universalIdentifier: objectMetadataUniversalIdentifier, labelIdentifierFieldMetadataUniversalIdentifier } = sourceFlatObjectMetadata;
    const { systemFlatFieldMetadatas, callerFlatFieldMetadatas } = (0, _computeviewfieldpositioninputflatfieldmetadatasutil.computeViewFieldPositionInputFlatFieldMetadatas)({
        applicationUniversalIdentifier,
        objectMetadataUniversalIdentifier,
        labelIdentifierFieldMetadataUniversalIdentifier,
        allFlatEntityOperationRecordByMetadataName
    });
    const positionByFieldUniversalIdentifier = (0, _computedefaultviewfieldpositionbyfielduniversalidentifierutil.computeDefaultViewFieldPositionByFieldUniversalIdentifier)({
        systemFlatFieldMetadatas,
        callerFlatFieldMetadatas,
        labelIdentifierFieldMetadataUniversalIdentifier,
        labelIdentifierPolicy
    });
    return (0, _computesystemviewfieldstocreateutil.computeSystemViewFieldsToCreate)({
        objectFlatFieldMetadatas: systemFlatFieldMetadatas,
        viewUniversalIdentifier,
        applicationUniversalIdentifier,
        labelIdentifierFieldMetadataUniversalIdentifier,
        excludeLabelIdentifier: labelIdentifierPolicy === 'excluded'
    }).map((flatViewFieldToCreate)=>({
            ...flatViewFieldToCreate,
            position: positionByFieldUniversalIdentifier.get(flatViewFieldToCreate.fieldMetadataUniversalIdentifier) ?? flatViewFieldToCreate.position
        }));
};

//# sourceMappingURL=compute-system-view-fields-for-created-object-view.util.js.map