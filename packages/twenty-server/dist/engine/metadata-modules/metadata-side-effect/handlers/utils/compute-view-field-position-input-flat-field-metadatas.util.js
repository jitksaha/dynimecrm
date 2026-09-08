"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeViewFieldPositionInputFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return computeViewFieldPositionInputFlatFieldMetadatas;
    }
});
const _computecallerflatfieldmetadatasforobjectutil = require("./compute-caller-flat-field-metadatas-for-object.util");
const _buildreservedsystemflatfieldmetadatasforcustomobjectutil = require("../../../object-metadata/utils/build-reserved-system-flat-field-metadatas-for-custom-object.util");
const computeViewFieldPositionInputFlatFieldMetadatas = ({ applicationUniversalIdentifier, objectMetadataUniversalIdentifier, labelIdentifierFieldMetadataUniversalIdentifier, allFlatEntityOperationRecordByMetadataName })=>({
        systemFlatFieldMetadatas: Object.values((0, _buildreservedsystemflatfieldmetadatasforcustomobjectutil.buildReservedSystemFlatFieldMetadatasForCustomObject)({
            flatObjectMetadata: {
                applicationUniversalIdentifier,
                universalIdentifier: objectMetadataUniversalIdentifier
            }
        })),
        callerFlatFieldMetadatas: (0, _computecallerflatfieldmetadatasforobjectutil.computeCallerFlatFieldMetadatasForObject)({
            objectMetadataUniversalIdentifier,
            labelIdentifierFieldMetadataUniversalIdentifier,
            allFlatEntityOperationRecordByMetadataName
        })
    });

//# sourceMappingURL=compute-view-field-position-input-flat-field-metadatas.util.js.map