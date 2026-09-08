"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildWorkspaceTableShape", {
    enumerable: true,
    get: function() {
        return buildWorkspaceTableShape;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getflatfieldsforflatobjectmetadatautil = require("../../../api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _relationtypeinterface = require("../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _computecolumnnameutil = require("../../../metadata-modules/field-metadata/utils/compute-column-name.util");
const _computemorphorrelationfieldjoincolumnnameutil = require("../../../metadata-modules/field-metadata/utils/compute-morph-or-relation-field-join-column-name.util");
const _iscompositefieldmetadatatypeutil = require("../../../metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const _twentyormexception = require("../../exceptions/twenty-orm.exception");
const _computeobjecttargettableutil = require("../../../utils/compute-object-target-table.util");
const _getworkspaceschemanameutil = require("../../../workspace-datasource/utils/get-workspace-schema-name.util");
const buildWorkspaceTableShape = ({ workspaceId, flatObjectMetadata, flatFieldMetadataMaps })=>{
    const flatFieldMetadatas = (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObjectMetadata, flatFieldMetadataMaps);
    const columnShapeByColumnName = {};
    const relationShapeByFieldName = {};
    for (const flatFieldMetadata of flatFieldMetadatas){
        if ((0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(flatFieldMetadata)) {
            const relationType = flatFieldMetadata.settings?.relationType;
            if (!(0, _utils.isDefined)(relationType)) {
                continue;
            }
            const isOwningSide = relationType === _relationtypeinterface.RelationType.MANY_TO_ONE;
            const joinColumnName = isOwningSide ? (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
                name: flatFieldMetadata.name
            }) : undefined;
            relationShapeByFieldName[flatFieldMetadata.name] = {
                fieldName: flatFieldMetadata.name,
                fieldMetadataId: flatFieldMetadata.id,
                relationType,
                targetObjectMetadataId: flatFieldMetadata.relationTargetObjectMetadataId,
                targetFieldMetadataId: flatFieldMetadata.relationTargetFieldMetadataId ?? null,
                joinColumnName
            };
            if ((0, _utils.isDefined)(joinColumnName)) {
                columnShapeByColumnName[joinColumnName] = {
                    columnName: joinColumnName,
                    fieldMetadataId: flatFieldMetadata.id,
                    fieldName: flatFieldMetadata.name,
                    fieldMetadataType: flatFieldMetadata.type
                };
            }
            continue;
        }
        if ((0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(flatFieldMetadata.type)) {
            const compositeType = _types.compositeTypeDefinitions.get(flatFieldMetadata.type);
            if (!(0, _utils.isDefined)(compositeType)) {
                throw new _twentyormexception.TwentyOrmException(`Composite type "${flatFieldMetadata.type}" has no definition, so the columns for field "${flatFieldMetadata.name}" cannot be derived`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_COLUMN);
            }
            for (const compositeProperty of compositeType.properties){
                const columnName = (0, _computecolumnnameutil.computeCompositeColumnName)(flatFieldMetadata.name, compositeProperty);
                columnShapeByColumnName[columnName] = {
                    columnName,
                    fieldMetadataId: flatFieldMetadata.id,
                    fieldName: flatFieldMetadata.name,
                    fieldMetadataType: compositeProperty.type,
                    compositeParentFieldName: flatFieldMetadata.name
                };
            }
            continue;
        }
        columnShapeByColumnName[flatFieldMetadata.name] = {
            columnName: flatFieldMetadata.name,
            fieldMetadataId: flatFieldMetadata.id,
            fieldName: flatFieldMetadata.name,
            fieldMetadataType: flatFieldMetadata.type
        };
    }
    return {
        objectMetadataId: flatObjectMetadata.id,
        nameSingular: flatObjectMetadata.nameSingular,
        schemaName: (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId),
        tableName: (0, _computeobjecttargettableutil.computeObjectTargetTable)(flatObjectMetadata),
        columnShapeByColumnName,
        columnNames: Object.keys(columnShapeByColumnName),
        relationShapeByFieldName,
        hasDeletedAtColumn: (0, _utils.isDefined)(columnShapeByColumnName['deletedAt'])
    };
};

//# sourceMappingURL=build-workspace-table-shape.util.js.map