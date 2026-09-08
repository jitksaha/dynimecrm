"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateWorkspaceSchemaDdl", {
    enumerable: true,
    get: function() {
        return generateWorkspaceSchemaDdl;
    }
});
const _types = require("twenty-shared/types");
const _isflatfieldmetadataoftypeutil = require("../../../../engine/metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
const _derivesearchvectorasexpressionfortsvectorfieldutil = require("../../../../engine/metadata-modules/flat-search-field-metadata/utils/derive-search-vector-as-expression-for-ts-vector-field.util");
const _gettargetsearchfieldmetadatasfortsvectorfieldutil = require("../../../../engine/metadata-modules/flat-search-field-metadata/utils/get-target-search-field-metadatas-for-ts-vector-field.util");
const _searchvectorfieldconstants = require("../../../../engine/metadata-modules/search-field-metadata/constants/search-vector-field.constants");
const _buildsqlcolumndefinitionutil = require("../../../../engine/twenty-orm/workspace-schema-manager/utils/build-sql-column-definition.util");
const _computetablenameutil = require("../../../../engine/utils/compute-table-name.util");
const _twentystandardapplications = require("../../../../engine/workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
const _removesqlinjectionutil = require("../../../../engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util");
const _generatecolumndefinitionsutil = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/generate-column-definitions.util");
const _workspaceschemaenumoperationsutil = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/workspace-schema-enum-operations.util");
const buildSearchFieldMetadataDerivationInputs = ({ fieldMetadatas, objectSearchFieldMetadatas })=>{
    const indexedFieldById = new Map(fieldMetadatas.map((fieldMetadata)=>[
            fieldMetadata.id,
            {
                name: fieldMetadata.name,
                type: fieldMetadata.type
            }
        ]));
    const searchVectorFieldId = fieldMetadatas.find((fieldMetadata)=>fieldMetadata.type === _types.FieldMetadataType.TS_VECTOR && fieldMetadata.name === _searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name)?.id;
    const byUniversalIdentifier = Object.fromEntries(objectSearchFieldMetadatas.map((searchFieldMetadata)=>[
            searchFieldMetadata.universalIdentifier,
            {
                ...searchFieldMetadata,
                tsVectorFieldMetadataId: searchFieldMetadata.tsVectorFieldMetadataId ?? searchVectorFieldId
            }
        ]));
    return {
        indexedFieldById,
        flatSearchFieldMetadataMaps: {
            byUniversalIdentifier,
            universalIdentifierById: {},
            universalIdentifiersByApplicationId: {}
        }
    };
};
const generateWorkspaceSchemaDdl = (workspaceId, schemaName, objectMetadatas, fieldsByObjectId, searchFieldMetadatasByObjectId)=>{
    const statements = [];
    for (const objectMetadata of objectMetadatas){
        if (!objectMetadata.isActive) continue;
        const tableName = (0, _computetablenameutil.computeTableName)(objectMetadata.nameSingular, objectMetadata.application?.universalIdentifier !== _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier);
        const fieldMetadatas = fieldsByObjectId.get(objectMetadata.id) ?? [];
        const flatFieldMetadatas = fieldMetadatas;
        const flatObjectMetadata = objectMetadata;
        const { indexedFieldById, flatSearchFieldMetadataMaps } = buildSearchFieldMetadataDerivationInputs({
            fieldMetadatas,
            objectSearchFieldMetadatas: searchFieldMetadatasByObjectId.get(objectMetadata.id) ?? []
        });
        const enumOperations = (0, _workspaceschemaenumoperationsutil.collectEnumOperationsForObject)({
            tableName,
            operation: _workspaceschemaenumoperationsutil.EnumOperation.CREATE,
            flatFieldMetadatas
        });
        for (const enumOperation of enumOperations){
            const createOp = enumOperation;
            const escapedValues = createOp.values.map(_removesqlinjectionutil.escapeLiteral).join(', ');
            statements.push(`CREATE TYPE ${(0, _removesqlinjectionutil.escapeIdentifier)(schemaName)}.${(0, _removesqlinjectionutil.escapeIdentifier)(createOp.enumName)} AS ENUM (${escapedValues});`);
        }
        const columnDefinitions = flatFieldMetadatas.flatMap((flatFieldMetadata)=>(0, _generatecolumndefinitionsutil.generateColumnDefinitions)({
                flatFieldMetadata,
                flatObjectMetadata,
                workspaceId,
                searchVectorAsExpression: (0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(flatFieldMetadata, _types.FieldMetadataType.TS_VECTOR) ? (0, _derivesearchvectorasexpressionfortsvectorfieldutil.deriveSearchVectorAsExpressionForTsVectorField)({
                    targetSearchFieldMetadatas: (0, _gettargetsearchfieldmetadatasfortsvectorfieldutil.getTargetSearchFieldMetadatasForTsVectorField)({
                        tsVectorFieldMetadataId: flatFieldMetadata.id,
                        flatSearchFieldMetadataMaps
                    }),
                    indexedFieldById
                }) : undefined
            }));
        if (columnDefinitions.length === 0) continue;
        const columnsSql = columnDefinitions.map((columnDefinition)=>`  ${(0, _buildsqlcolumndefinitionutil.buildSqlColumnDefinition)(columnDefinition)}`).join(',\n');
        statements.push(`CREATE TABLE ${(0, _removesqlinjectionutil.escapeIdentifier)(schemaName)}.${(0, _removesqlinjectionutil.escapeIdentifier)(tableName)} (\n${columnsSql}\n);`);
    }
    return statements;
};

//# sourceMappingURL=generate-workspace-schema-ddl.util.js.map