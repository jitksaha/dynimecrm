"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getConflictingFields", {
    enumerable: true,
    get: function() {
        return getConflictingFields;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getflatfieldsforflatobjectmetadatautil = require("../../../../graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _computecolumnnameutil = require("../../../../../metadata-modules/field-metadata/utils/compute-column-name.util");
const _computemorphorrelationfieldjoincolumnnameutil = require("../../../../../metadata-modules/field-metadata/utils/compute-morph-or-relation-field-join-column-name.util");
const _iscompositefieldmetadatatypeutil = require("../../../../../metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _findmanyflatentitybyidinflatentitymapsutil = require("../../../../../metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const computeConflictingPropertiesForIndexField = ({ flatFieldMetadata, subFieldName })=>{
    if ((0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(flatFieldMetadata)) {
        if (flatFieldMetadata.settings?.relationType !== _types.RelationType.MANY_TO_ONE) {
            return undefined;
        }
        const joinColumn = (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
            name: flatFieldMetadata.name
        });
        return [
            {
                fullPath: joinColumn,
                column: joinColumn
            }
        ];
    }
    if ((0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(flatFieldMetadata.type)) {
        const compositeType = _types.compositeTypeDefinitions.get(flatFieldMetadata.type);
        if (!(0, _utils.isDefined)(compositeType)) {
            return undefined;
        }
        if ((0, _utils.isDefined)(subFieldName)) {
            const property = compositeType.properties.find((compositeProperty)=>compositeProperty.name === subFieldName);
            if (!(0, _utils.isDefined)(property)) {
                return undefined;
            }
            return [
                {
                    fullPath: `${flatFieldMetadata.name}.${property.name}`,
                    column: (0, _computecolumnnameutil.computeCompositeColumnName)({
                        name: flatFieldMetadata.name,
                        type: flatFieldMetadata.type
                    }, property)
                }
            ];
        }
        return compositeType.properties.filter((property)=>property.isIncludedInUniqueConstraint).map((property)=>({
                fullPath: `${flatFieldMetadata.name}.${property.name}`,
                column: (0, _computecolumnnameutil.computeCompositeColumnName)({
                    name: flatFieldMetadata.name,
                    type: flatFieldMetadata.type
                }, property)
            }));
    }
    return [
        {
            fullPath: flatFieldMetadata.name,
            column: flatFieldMetadata.name
        }
    ];
};
const computeConflictingPropertiesForIndex = ({ flatIndexFieldMetadatas, flatFieldMetadataMaps })=>{
    const orderedIndexFields = [
        ...flatIndexFieldMetadatas
    ].sort((a, b)=>a.order - b.order);
    const baseFields = [];
    const conflictingProperties = [];
    for (const indexField of orderedIndexFields){
        const flatFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: indexField.fieldMetadataId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(flatFieldMetadata)) {
            return undefined;
        }
        const propertiesForField = computeConflictingPropertiesForIndexField({
            flatFieldMetadata,
            subFieldName: indexField.subFieldName
        });
        if (!(0, _utils.isDefined)(propertiesForField) || propertiesForField.length === 0) {
            return undefined;
        }
        if (!baseFields.includes(flatFieldMetadata.name)) {
            baseFields.push(flatFieldMetadata.name);
        }
        conflictingProperties.push(...propertiesForField);
    }
    return {
        baseFields,
        conflictingProperties
    };
};
const getConflictingFields = (flatObjectMetadata, flatFieldMetadataMaps, flatIndexMaps)=>{
    const conflictingFieldGroups = [];
    const idField = (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObjectMetadata, flatFieldMetadataMaps).find((field)=>field.name === 'id');
    if ((0, _utils.isDefined)(idField)) {
        conflictingFieldGroups.push({
            baseFields: [
                'id'
            ],
            conflictingProperties: [
                {
                    fullPath: 'id',
                    column: 'id'
                }
            ]
        });
    }
    const uniqueIndexes = (0, _findmanyflatentitybyidinflatentitymapsutil.findManyFlatEntityByIdInFlatEntityMaps)({
        flatEntityIds: flatObjectMetadata.indexMetadataIds,
        flatEntityMaps: flatIndexMaps
    }).filter((flatIndexMetadata)=>flatIndexMetadata.isUnique);
    for (const flatIndexMetadata of uniqueIndexes){
        const indexConflictingFields = computeConflictingPropertiesForIndex({
            flatIndexFieldMetadatas: flatIndexMetadata.flatIndexFieldMetadatas,
            flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(indexConflictingFields) || indexConflictingFields.conflictingProperties.length === 0) {
            continue;
        }
        conflictingFieldGroups.push({
            baseFields: indexConflictingFields.baseFields,
            conflictingProperties: indexConflictingFields.conflictingProperties
        });
    }
    return conflictingFieldGroups;
};

//# sourceMappingURL=get-conflicting-fields.util.js.map