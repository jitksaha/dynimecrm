"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromDeleteFieldInputToFlatFieldMetadatasToDelete", {
    enumerable: true,
    get: function() {
        return fromDeleteFieldInputToFlatFieldMetadatasToDelete;
    }
});
const _utils = require("twenty-shared/utils");
const _fieldmetadataexception = require("../../field-metadata/field-metadata.exception");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _findflatentitybyuniversalidentifierorthrowutil = require("../../flat-entity/utils/find-flat-entity-by-universal-identifier-or-throw.util");
const _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil = require("../../flat-entity/utils/find-many-flat-entity-by-universal-identifier-in-universal-flat-entity-maps-or-throw.util");
const _computeflatfieldmetadatarelatedflatfieldmetadatautil = require("./compute-flat-field-metadata-related-flat-field-metadata.util");
const _ismorphorrelationflatfieldmetadatautil = require("./is-morph-or-relation-flat-field-metadata.util");
const _issystemuniqueflatindexmetadatautil = require("../../flat-index-metadata/utils/is-system-unique-flat-index-metadata.util");
const _generateflatindexutil = require("../../index-metadata/utils/generate-flat-index.util");
const _belongstotwentystandardapputil = require("../../utils/belongs-to-twenty-standard-app.util");
const fromDeleteFieldInputToFlatFieldMetadatasToDelete = ({ flatObjectMetadataMaps: existingFlatObjectMetadataMaps, deleteOneFieldInput: rawDeleteOneInput, flatIndexMaps: existingFlatIndexMaps, flatFieldMetadataMaps: existingFlatFieldMetadataMaps })=>{
    const { id: fieldMetadataToDeleteId } = (0, _utils.trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties)(rawDeleteOneInput, [
        'id'
    ]);
    const flatFieldMetadataToDelete = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: fieldMetadataToDeleteId,
        flatEntityMaps: existingFlatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(flatFieldMetadataToDelete)) {
        throw new _fieldmetadataexception.FieldMetadataException('Field to delete not found', _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_METADATA_NOT_FOUND);
    }
    if ((0, _belongstotwentystandardapputil.belongsToTwentyStandardApp)(flatFieldMetadataToDelete) || flatFieldMetadataToDelete.isSystem) {
        throw new _fieldmetadataexception.FieldMetadataException(`Cannot delete standard field "${flatFieldMetadataToDelete.name}"`, _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_MUTATION_NOT_ALLOWED);
    }
    if (flatFieldMetadataToDelete.isSystemSideEffect === true) {
        throw new _fieldmetadataexception.FieldMetadataException(`Cannot delete system-managed field "${flatFieldMetadataToDelete.name}"`, _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_MUTATION_NOT_ALLOWED);
    }
    const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: flatFieldMetadataToDelete.objectMetadataId,
        flatEntityMaps: existingFlatObjectMetadataMaps
    });
    if (!(0, _utils.isDefined)(flatObjectMetadata)) {
        throw new _fieldmetadataexception.FieldMetadataException('Field to delete object metadata not found', _fieldmetadataexception.FieldMetadataExceptionCode.OBJECT_METADATA_NOT_FOUND);
    }
    const relatedFlatFieldMetadataToDelete = (0, _computeflatfieldmetadatarelatedflatfieldmetadatautil.computeFlatFieldMetadataRelatedFlatFieldMetadata)({
        flatFieldMetadata: flatFieldMetadataToDelete,
        flatFieldMetadataMaps: existingFlatFieldMetadataMaps,
        flatObjectMetadata
    });
    const flatFieldMetadatasToDelete = [
        flatFieldMetadataToDelete,
        ...relatedFlatFieldMetadataToDelete
    ];
    const isEngineOwnedBackingUniqueIndex = (flatIndexMetadata)=>{
        if (!(0, _issystemuniqueflatindexmetadatautil.isSystemUniqueFlatIndexMetadata)(flatIndexMetadata) || flatIndexMetadata.flatIndexFieldMetadatas.length !== 1) {
            return false;
        }
        const backingFlatFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: flatIndexMetadata.flatIndexFieldMetadatas[0].fieldMetadataId,
            flatEntityMaps: existingFlatFieldMetadataMaps
        });
        return (0, _utils.isDefined)(backingFlatFieldMetadata) && backingFlatFieldMetadata.isUnique === true && !(0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(backingFlatFieldMetadata);
    };
    const flatIndexMap = new Map();
    const allFlatIndexes = Object.values(existingFlatIndexMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatIndexMetadata)=>!isEngineOwnedBackingUniqueIndex(flatIndexMetadata));
    for (const flatFieldMetadata of flatFieldMetadatasToDelete){
        allFlatIndexes.forEach((flatIndex)=>{
            const flatIndexFromMap = flatIndexMap.get(flatIndex.id);
            if ((0, _utils.isDefined)(flatIndexFromMap)) {
                const updatedFlatIndexFields = flatIndexFromMap.flatIndexFieldMetadatas.filter((flatIndexField)=>flatIndexField.fieldMetadataId !== flatFieldMetadata.id);
                flatIndexMap.set(flatIndexFromMap.id, {
                    ...flatIndexFromMap,
                    flatIndexFieldMetadatas: updatedFlatIndexFields
                });
                return;
            }
            if (flatIndex.objectMetadataId !== flatFieldMetadata.objectMetadataId || !flatIndex.flatIndexFieldMetadatas.some((flatIndexField)=>flatIndexField.fieldMetadataId === flatFieldMetadata.id)) {
                return;
            }
            const updatedFlatIndexFields = flatIndex.flatIndexFieldMetadatas.filter((flatIndexField)=>flatIndexField.fieldMetadataId !== flatFieldMetadata.id);
            flatIndexMap.set(flatIndex.id, {
                ...flatIndex,
                flatIndexFieldMetadatas: updatedFlatIndexFields
            });
        });
    }
    const { flatIndexesToDelete, flatIndexesToUpdate } = [
        ...flatIndexMap.values()
    ].reduce((acc, flatIndex)=>{
        if (flatIndex.flatIndexFieldMetadatas.length === 0) {
            return {
                ...acc,
                flatIndexesToDelete: [
                    ...acc.flatIndexesToDelete,
                    flatIndex
                ]
            };
        }
        const flatObjectMetadata = (0, _findflatentitybyuniversalidentifierorthrowutil.findFlatEntityByUniversalIdentifierOrThrow)({
            flatEntityMaps: existingFlatObjectMetadataMaps,
            universalIdentifier: flatIndex.objectMetadataUniversalIdentifier
        });
        const objectFlatFieldMetadatas = (0, _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil.findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMapsOrThrow)({
            flatEntityMaps: existingFlatFieldMetadataMaps,
            universalIdentifiers: flatObjectMetadata.fieldUniversalIdentifiers
        });
        const newIndex = (0, _generateflatindexutil.generateFlatIndexMetadataWithNameOrThrow)({
            flatObjectMetadata,
            flatIndex,
            objectFlatFieldMetadatas
        });
        return {
            ...acc,
            flatIndexesToUpdate: [
                ...acc.flatIndexesToUpdate,
                newIndex
            ]
        };
    }, {
        flatIndexesToDelete: [],
        flatIndexesToUpdate: []
    });
    return {
        flatFieldMetadatasToDelete,
        flatIndexesToDelete,
        flatIndexesToUpdate
    };
};

//# sourceMappingURL=from-delete-field-input-to-flat-field-metadatas-to-delete.util.js.map