"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProcessNestedRelationsHelper", {
    enumerable: true,
    get: function() {
        return ProcessNestedRelationsHelper;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _computemorphorrelationfieldjoincolumnnameutil = require("../../../metadata-modules/field-metadata/utils/compute-morph-or-relation-field-join-column-name.util");
const _relationtypeinterface = require("../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _createconcurrencylimiterutil = require("./utils/create-concurrency-limiter.util");
const _getuniquerelationidsutil = require("./utils/get-unique-relation-ids.util");
const _standarderrormessageconstant = require("../common-query-runners/errors/standard-error-message.constant");
const _graphqlqueryrunnerexception = require("../../graphql/graphql-query-runner/errors/graphql-query-runner.exception");
const _processaggregatehelper = require("../../graphql/graphql-query-runner/helpers/process-aggregate.helper");
const _buildcolumnstoselect = require("../../graphql/graphql-query-runner/utils/build-columns-to-select");
const _gettargetobjectmetadatautil = require("../../graphql/graphql-query-runner/utils/get-target-object-metadata.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../../metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const _workspaceormmanager = require("../../../twenty-orm/workspace-orm.manager");
const _isfieldmetadataoftypeutil = require("../../../utils/is-field-metadata-of-type.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const EMPTY_RELATION_SENTINEL_RECORD_ID = '00000000-0000-0000-0000-000000000000';
const NESTED_RELATION_QUERY_MAX_CONCURRENCY = 4;
let ProcessNestedRelationsHelper = class ProcessNestedRelationsHelper {
    async processNestedRelations(args) {
        await this.processNestedRelationsWithLimiter(args, (0, _createconcurrencylimiterutil.createConcurrencyLimiter)(NESTED_RELATION_QUERY_MAX_CONCURRENCY));
    }
    async processNestedRelationsWithLimiter({ flatObjectMetadataMaps, flatFieldMetadataMaps, parentObjectMetadataItem, parentObjectRecords, parentObjectRecordsAggregatedValues = {}, relations, aggregate = {}, limit, authContext, useReplica = false, rolePermissionConfig, repository, selectedFields }, relationQueryLimiter) {
        const processRelationTasks = Object.entries(relations).map(([sourceFieldName, nestedRelations])=>this.processRelation({
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                parentObjectMetadataItem,
                parentObjectRecords,
                parentObjectRecordsAggregatedValues,
                sourceFieldName,
                nestedRelations,
                aggregate,
                limit,
                authContext,
                useReplica,
                rolePermissionConfig,
                repository,
                relationQueryLimiter,
                selectedFields: selectedFields[sourceFieldName] instanceof Object ? selectedFields[sourceFieldName] : undefined
            }));
        await Promise.all(processRelationTasks);
    }
    async processRelation({ flatObjectMetadataMaps, flatFieldMetadataMaps, parentObjectMetadataItem, parentObjectRecords, parentObjectRecordsAggregatedValues, sourceFieldName, nestedRelations, aggregate, limit, authContext, useReplica, rolePermissionConfig, repository, relationQueryLimiter, selectedFields }) {
        const fieldMaps = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, parentObjectMetadataItem);
        const sourceFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: fieldMaps.fieldIdByName[sourceFieldName],
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!sourceFieldMetadata) {
            return;
        }
        if (!(0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(sourceFieldMetadata, _types.FieldMetadataType.RELATION) && !(0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(sourceFieldMetadata, _types.FieldMetadataType.MORPH_RELATION)) {
            return;
        }
        if (!sourceFieldMetadata.settings) {
            throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(`Relation settings not found for field ${sourceFieldName}`, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.RELATION_SETTINGS_NOT_FOUND, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        const relationType = sourceFieldMetadata.settings.relationType;
        const { targetRelationName, targetObjectMetadata, targetRelation } = this.getTargetObjectMetadata({
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            parentObjectMetadataItem,
            sourceFieldName,
            fieldMaps
        });
        const targetObjectRepository = repository ? repository.getRepositoryForObjectMetadataId(targetObjectMetadata.id) : this.workspaceOrmManager.getRepository(targetObjectMetadata.nameSingular, rolePermissionConfig, {
            useReplica
        });
        const targetObjectNameSingular = targetObjectMetadata.nameSingular;
        let targetObjectQueryBuilder = targetObjectRepository.createQueryBuilder(targetObjectNameSingular);
        const columnsToSelect = (0, _buildcolumnstoselect.buildColumnsToSelect)({
            select: selectedFields,
            relations: nestedRelations,
            flatObjectMetadata: targetObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
        if (relationType === _relationtypeinterface.RelationType.MANY_TO_ONE) {
            columnsToSelect.deletedAt = true;
            targetObjectQueryBuilder = targetObjectQueryBuilder.withDeleted();
        }
        targetObjectQueryBuilder = targetObjectQueryBuilder.setFindOptions({
            select: columnsToSelect
        });
        const joinColumnName = (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
            name: sourceFieldName
        });
        const relationIds = (0, _getuniquerelationidsutil.getUniqueRelationIds)({
            records: parentObjectRecords,
            idField: relationType === _relationtypeinterface.RelationType.ONE_TO_MANY ? 'id' : joinColumnName
        });
        if (relationType === _relationtypeinterface.RelationType.ONE_TO_MANY && !(0, _utils.isDefined)(targetRelationName)) {
            throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(`Could not resolve target relation for one-to-many field ${sourceFieldName}`, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.RELATION_TARGET_OBJECT_METADATA_NOT_FOUND, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        const fieldMetadataTargetRelationColumnName = (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
            name: targetRelation && (0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(targetRelation, _types.FieldMetadataType.MORPH_RELATION) ? targetRelation.name : targetRelationName
        });
        const { relationResults, relationAggregatedFieldsResult } = await relationQueryLimiter(()=>this.findRelations({
                referenceQueryBuilder: targetObjectQueryBuilder,
                targetObjectRepository,
                column: relationType === _relationtypeinterface.RelationType.ONE_TO_MANY ? `"${fieldMetadataTargetRelationColumnName}"` : 'id',
                ids: relationIds,
                relationType,
                perParentLimit: limit,
                parentRecordsCount: parentObjectRecords.length,
                aggregate,
                sourceFieldName,
                targetObjectNameSingular
            }));
        this.assignRelationResults({
            parentRecords: parentObjectRecords,
            parentObjectRecordsAggregatedValues,
            relationResults,
            relationAggregatedFieldsResult,
            sourceFieldName,
            joinField: relationType === _relationtypeinterface.RelationType.ONE_TO_MANY ? `${fieldMetadataTargetRelationColumnName}` : 'id',
            joinColumnName,
            relationType,
            selectedFields
        });
        if (Object.keys(nestedRelations).length > 0) {
            await this.processNestedRelationsWithLimiter({
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                parentObjectMetadataItem: targetObjectMetadata,
                parentObjectRecords: relationResults,
                parentObjectRecordsAggregatedValues: relationAggregatedFieldsResult,
                relations: nestedRelations,
                aggregate,
                limit,
                authContext,
                useReplica,
                rolePermissionConfig,
                repository,
                selectedFields
            }, relationQueryLimiter);
        }
    }
    getTargetObjectMetadata({ flatObjectMetadataMaps, flatFieldMetadataMaps, parentObjectMetadataItem, sourceFieldName, fieldMaps }) {
        const targetFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: fieldMaps.fieldIdByName[sourceFieldName],
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!targetFieldMetadata) {
            throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(`Field ${sourceFieldName} not found on object ${parentObjectMetadataItem.nameSingular}`, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.FIELD_NOT_FOUND, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        const targetObjectMetadata = (0, _gettargetobjectmetadatautil.getTargetObjectMetadataOrThrow)(targetFieldMetadata, flatObjectMetadataMaps);
        if (!targetFieldMetadata.relationTargetObjectMetadataId || !targetFieldMetadata.relationTargetFieldMetadataId) {
            throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(`Relation target object metadata id or field metadata id not found for field ${sourceFieldName}`, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.RELATION_TARGET_OBJECT_METADATA_NOT_FOUND, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        const targetRelation = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: targetFieldMetadata.relationTargetFieldMetadataId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        const targetRelationName = targetRelation?.name;
        return {
            targetRelationName,
            targetObjectMetadata,
            targetRelation
        };
    }
    async findRelations({ referenceQueryBuilder, targetObjectRepository, column, ids, relationType, perParentLimit, parentRecordsCount, aggregate, sourceFieldName, targetObjectNameSingular }) {
        if (ids.length === 0) {
            return {
                relationResults: [],
                relationAggregatedFieldsResult: {}
            };
        }
        const aggregateForRelation = aggregate[sourceFieldName];
        // oxlint-disable-next-line typescript/no-explicit-any
        let relationAggregatedFieldsResult = {};
        if (aggregateForRelation) {
            const aggregateQueryBuilder = referenceQueryBuilder.clone();
            _processaggregatehelper.ProcessAggregateHelper.addSelectedAggregatedFieldsQueriesToQueryBuilder({
                selectedAggregatedFields: aggregateForRelation,
                queryBuilder: aggregateQueryBuilder,
                objectMetadataNameSingular: targetObjectNameSingular
            });
            const aggregatedFieldsValues = await aggregateQueryBuilder.addSelect(column, column.replace(/["']/g, '')).where(`${column} IN (:...ids)`, {
                ids
            }).groupBy(column).getRawMany();
            relationAggregatedFieldsResult = aggregatedFieldsValues.reduce((acc, item)=>{
                const columnWithoutQuotes = column.replace(/["']/g, '');
                const key = String(item[columnWithoutQuotes]);
                const { [column]: _, ...itemWithoutColumn } = item;
                acc[key] = itemWithoutColumn;
                return acc;
            }, {});
        }
        const queryBuilderOptions = referenceQueryBuilder.getFindOptions();
        const columnWithoutQuotes = column.replace(/["']/g, '');
        const findOptionsWithJoinColumn = {
            ...queryBuilderOptions,
            select: {
                ...queryBuilderOptions.select,
                [columnWithoutQuotes]: true
            }
        };
        if (relationType !== _relationtypeinterface.RelationType.ONE_TO_MANY) {
            const result = await referenceQueryBuilder.setFindOptions(findOptionsWithJoinColumn).where(`${column} IN (:...ids)`, {
                ids
            }).take(perParentLimit * parentRecordsCount).getMany();
            return {
                relationResults: result,
                relationAggregatedFieldsResult
            };
        }
        const allowedRelationRecordIds = await this.findRelationRecordIdsLimitedPerParent({
            targetObjectRepository,
            targetObjectNameSingular,
            column,
            ids,
            perParentLimit
        });
        const recordIdsToHydrate = allowedRelationRecordIds.length > 0 ? allowedRelationRecordIds : [
            EMPTY_RELATION_SENTINEL_RECORD_ID
        ];
        const result = await referenceQueryBuilder.setFindOptions(findOptionsWithJoinColumn).where(`id IN (:...recordIdsToHydrate)`, {
            recordIdsToHydrate
        }).getMany();
        return {
            relationResults: result,
            relationAggregatedFieldsResult
        };
    }
    async findRelationRecordIdsLimitedPerParent({ targetObjectRepository, targetObjectNameSingular, column, ids, perParentLimit }) {
        const sanitizedIds = ids.filter(_utils.isValidUuid);
        if (sanitizedIds.length === 0) {
            return [];
        }
        const perParentRecordIdsQueryBuilder = targetObjectRepository.createQueryBuilder(targetObjectNameSingular).select(`"${targetObjectNameSingular}"."id"`, 'id').where(`${column} = "lateralParents"."parentId"`);
        perParentRecordIdsQueryBuilder.applyRowLevelPermissions();
        const perParentRecordIdsSql = `${perParentRecordIdsQueryBuilder.getQuery()} LIMIT ${Number(perParentLimit)}`;
        const parentValues = sanitizedIds.map((id)=>`('${id}'::uuid)`).join(', ');
        const lateralSql = `SELECT "limited_relation_records"."id" AS "id" FROM (` + `SELECT "lateralRecords"."id" AS "id" ` + `FROM (VALUES ${parentValues}) AS "lateralParents"("parentId") ` + `CROSS JOIN LATERAL (${perParentRecordIdsSql}) AS "lateralRecords"` + `) AS "limited_relation_records"`;
        const limitedRecords = await targetObjectRepository.executeRaw(lateralSql, perParentRecordIdsQueryBuilder.getParameters());
        return limitedRecords.map((limitedRecord)=>limitedRecord.id);
    }
    assignRelationResults({ parentRecords, parentObjectRecordsAggregatedValues, relationResults, relationAggregatedFieldsResult, sourceFieldName, joinField, joinColumnName, relationType, selectedFields }) {
        parentRecords.forEach((item)=>{
            if (relationType === _relationtypeinterface.RelationType.ONE_TO_MANY) {
                item[sourceFieldName] = relationResults.filter((rel)=>rel[joinField] === item.id);
            } else {
                const matchedRelation = relationResults.find((rel)=>rel.id === item[joinColumnName]);
                if ((0, _utils.isDefined)(matchedRelation?.deletedAt)) {
                    item[sourceFieldName] = null;
                    item[joinColumnName] = null;
                } else if ((0, _utils.isDefined)(matchedRelation)) {
                    if (selectedFields?.deletedAt !== true) {
                        const { deletedAt: _, ...rest } = matchedRelation;
                        item[sourceFieldName] = rest;
                    } else {
                        item[sourceFieldName] = matchedRelation;
                    }
                } else {
                    item[sourceFieldName] = null;
                }
            }
        });
        parentObjectRecordsAggregatedValues[sourceFieldName] = relationAggregatedFieldsResult;
    }
    constructor(workspaceOrmManager){
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
ProcessNestedRelationsHelper = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], ProcessNestedRelationsHelper);

//# sourceMappingURL=process-nested-relations.helper.js.map