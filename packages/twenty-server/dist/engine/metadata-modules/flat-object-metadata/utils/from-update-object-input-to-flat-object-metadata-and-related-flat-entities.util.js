"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromUpdateObjectInputToFlatObjectMetadataAndRelatedFlatEntities", {
    enumerable: true,
    get: function() {
        return fromUpdateObjectInputToFlatObjectMetadataAndRelatedFlatEntities;
    }
});
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _flatobjectmetadataeditablepropertiesconstant = require("../constants/flat-object-metadata-editable-properties.constant");
const _handleflatobjectmetadataupdatesideeffectutil = require("./handle-flat-object-metadata-update-side-effect.util");
const _sanitizerawupdateobjectinput = require("./sanitize-raw-update-object-input");
const _objectmetadataexception = require("../../object-metadata/object-metadata.exception");
const _belongstotwentystandardapputil = require("../../utils/belongs-to-twenty-standard-app.util");
const _mergeupdateinexistingrecordutil = require("../../../../utils/merge-update-in-existing-record.util");
const fromUpdateObjectInputToFlatObjectMetadataAndRelatedFlatEntities = ({ flatObjectMetadataMaps: existingFlatObjectMetadataMaps, updateObjectInput: rawUpdateObjectInput, flatIndexMaps, flatFieldMetadataMaps, flatViewFieldMaps, flatViewMaps, flatSearchFieldMetadataMaps })=>{
    const { id: objectMetadataIdToUpdate } = (0, _utils.trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties)(rawUpdateObjectInput, [
        'id'
    ]);
    const existingFlatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityMaps: existingFlatObjectMetadataMaps,
        flatEntityId: objectMetadataIdToUpdate
    });
    if (!(0, _utils.isDefined)(existingFlatObjectMetadata)) {
        throw new _objectmetadataexception.ObjectMetadataException('Object to update not found', _objectmetadataexception.ObjectMetadataExceptionCode.OBJECT_METADATA_NOT_FOUND);
    }
    const requestedImageIdentifierFieldMetadataId = rawUpdateObjectInput.update.imageIdentifierFieldMetadataId;
    if ((0, _utils.isDefined)(requestedImageIdentifierFieldMetadataId)) {
        const imageIdentifierFlatFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityMaps: flatFieldMetadataMaps,
            flatEntityId: requestedImageIdentifierFieldMetadataId
        });
        if (!(0, _utils.isDefined)(imageIdentifierFlatFieldMetadata)) {
            throw new _objectmetadataexception.ObjectMetadataException('Field declared as image identifier not found', _objectmetadataexception.ObjectMetadataExceptionCode.INVALID_OBJECT_INPUT);
        }
        if (imageIdentifierFlatFieldMetadata.objectMetadataId !== existingFlatObjectMetadata.id) {
            throw new _objectmetadataexception.ObjectMetadataException('Field declared as image identifier does not belong to this object', _objectmetadataexception.ObjectMetadataExceptionCode.INVALID_OBJECT_INPUT);
        }
        if (!(0, _utils.isImageIdentifierFieldMetadataType)(imageIdentifierFlatFieldMetadata.type)) {
            throw new _objectmetadataexception.ObjectMetadataException('Field cannot be used as image identifier due to its type: should be of type Files or Links', _objectmetadataexception.ObjectMetadataExceptionCode.INVALID_OBJECT_INPUT);
        }
        if (!imageIdentifierFlatFieldMetadata.isActive) {
            throw new _objectmetadataexception.ObjectMetadataException('Field cannot be used as image identifier because it is deactivated', _objectmetadataexception.ObjectMetadataExceptionCode.INVALID_OBJECT_INPUT);
        }
    }
    const isStandardObject = (0, _belongstotwentystandardapputil.belongsToTwentyStandardApp)(existingFlatObjectMetadata);
    const { overrides, updatedEditableObjectProperties } = (0, _sanitizerawupdateobjectinput.sanitizeRawUpdateObjectInput)({
        existingFlatObjectMetadata,
        rawUpdateObjectInput
    });
    const toFlatObjectMetadata = {
        ...(0, _mergeupdateinexistingrecordutil.mergeUpdateInExistingRecord)({
            existing: existingFlatObjectMetadata,
            properties: _flatobjectmetadataeditablepropertiesconstant.FLAT_OBJECT_METADATA_EDITABLE_PROPERTIES[isStandardObject ? 'standard' : 'custom'],
            update: updatedEditableObjectProperties
        }),
        overrides
    };
    if ((0, _utils.isDefined)(updatedEditableObjectProperties.labelIdentifierFieldMetadataId)) {
        const flatFieldMetadata = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityMaps: flatFieldMetadataMaps,
            flatEntityId: updatedEditableObjectProperties.labelIdentifierFieldMetadataId
        });
        toFlatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier = flatFieldMetadata?.universalIdentifier;
    }
    if ('imageIdentifierFieldMetadataId' in updatedEditableObjectProperties) {
        const { imageIdentifierFieldMetadataId } = updatedEditableObjectProperties;
        toFlatObjectMetadata.imageIdentifierFieldMetadataUniversalIdentifier = (0, _utils.isDefined)(imageIdentifierFieldMetadataId) ? (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityMaps: flatFieldMetadataMaps,
            flatEntityId: imageIdentifierFieldMetadataId
        }).universalIdentifier : null;
    }
    const { flatIndexMetadatasToUpdate, flatViewFieldsToCreate, flatViewFieldsToUpdate, otherObjectFlatFieldMetadatasToUpdate, searchFieldMetadatasToCreate } = (0, _handleflatobjectmetadataupdatesideeffectutil.handleFlatObjectMetadataUpdateSideEffect)({
        fromFlatObjectMetadata: existingFlatObjectMetadata,
        toFlatObjectMetadata,
        flatFieldMetadataMaps,
        flatObjectMetadataMaps: existingFlatObjectMetadataMaps,
        flatIndexMaps,
        flatViewFieldMaps,
        flatViewMaps,
        flatSearchFieldMetadataMaps
    });
    return {
        flatIndexMetadatasToUpdate,
        flatObjectMetadataToUpdate: toFlatObjectMetadata,
        flatViewFieldsToCreate,
        flatViewFieldsToUpdate,
        otherObjectFlatFieldMetadatasToUpdate,
        searchFieldMetadatasToCreate
    };
};

//# sourceMappingURL=from-update-object-input-to-flat-object-metadata-and-related-flat-entities.util.js.map