"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeFlatIndexNameOrThrow", {
    enumerable: true,
    get: function() {
        return computeFlatIndexNameOrThrow;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _computecolumnnameutil = require("../../field-metadata/utils/compute-column-name.util");
const _computemorphorrelationfieldjoincolumnnameutil = require("../../field-metadata/utils/compute-morph-or-relation-field-join-column-name.util");
const _iscompositefieldmetadatatypeutil = require("../../field-metadata/utils/is-composite-field-metadata-type.util");
const _flatentitymapsexception = require("../../flat-entity/exceptions/flat-entity-maps.exception");
const _ismorphorrelationflatfieldmetadatautil = require("../../flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const _generatedeterministicindexname = require("./generate-deterministic-index-name");
const computeFlatIndexNameOrThrow = ({ flatObjectMetadata, objectFlatFieldMetadatas, indexFields, isUnique, indexWhereClause })=>{
    const orderedIndexColumnNames = [
        ...indexFields
    ].sort((a, b)=>a.order - b.order).map((flatIndexField)=>{
        const relatedFlatFieldMetadata = objectFlatFieldMetadatas.find((flatFieldMetadata)=>flatFieldMetadata.universalIdentifier === flatIndexField.fieldMetadataUniversalIdentifier);
        if (!(0, _utils.isDefined)(relatedFlatFieldMetadata)) {
            throw new _flatentitymapsexception.FlatEntityMapsException('Could not find flat index field related field in cache', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
        }
        if ((0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(relatedFlatFieldMetadata.type) && (0, _utils.isDefined)(flatIndexField.subFieldName)) {
            const property = _types.compositeTypeDefinitions.get(relatedFlatFieldMetadata.type)?.properties.find((compositeProperty)=>compositeProperty.name === flatIndexField.subFieldName);
            if (!(0, _utils.isDefined)(property)) {
                throw new _flatentitymapsexception.FlatEntityMapsException(`Composite sub-field "${flatIndexField.subFieldName}" not found on ${relatedFlatFieldMetadata.name}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
            }
            return (0, _computecolumnnameutil.computeCompositeColumnName)({
                name: relatedFlatFieldMetadata.name,
                type: relatedFlatFieldMetadata.type
            }, property);
        }
        const isManyToOneRelation = (0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationUniversalFlatFieldMetadata)(relatedFlatFieldMetadata) && relatedFlatFieldMetadata.universalSettings?.relationType === _types.RelationType.MANY_TO_ONE;
        return isManyToOneRelation ? (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
            name: relatedFlatFieldMetadata.name
        }) : relatedFlatFieldMetadata.name;
    });
    return (0, _generatedeterministicindexname.generateDeterministicIndexName)({
        flatObjectMetadata,
        orderedIndexColumnNames,
        isUnique,
        indexWhereClause
    });
};

//# sourceMappingURL=compute-flat-index-name.util.js.map