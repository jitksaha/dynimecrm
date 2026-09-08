"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RelationNestedQueries", {
    enumerable: true,
    get: function() {
        return RelationNestedQueries;
    }
});
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _relationtypeinterface = require("../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../../metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const _isfieldmetadataoftypeutil = require("../../../utils/is-field-metadata-of-type.util");
const _twentyormexception = require("../../exceptions/twenty-orm.exception");
const _formatConnectRecordNotFoundErrorMessageutil = require("./utils/formatConnectRecordNotFoundErrorMessage.util");
const _computerelationconnectqueryconfigsutil = require("../../utils/compute-relation-connect-query-configs.util");
const _createsqlwheretupleinclauseutils = require("../../utils/create-sql-where-tuple-in-clause.utils");
const _extractnestedrelationfieldsbyentityindexutil = require("../../utils/extract-nested-relation-fields-by-entity-index.util");
const _getassociatedrelationfieldnameutil = require("../../utils/get-associated-relation-field-name.util");
const _getobjectmetadatafromentitytargetutil = require("../../utils/get-object-metadata-from-entity-target.util");
const _getnestedrelationfieldnamesutil = require("../../utils/get-nested-relation-field-names.util");
let RelationNestedQueries = class RelationNestedQueries {
    prepareNestedRelationQueries(entities, target) {
        const entitiesArray = Array.isArray(entities) ? entities : [
            entities
        ];
        const objectMetadata = (0, _getobjectmetadatafromentitytargetutil.getObjectMetadataFromEntityTarget)(target, this.internalContext);
        const { relationConnectQueryFieldsByEntityIndex, relationCreateQueryFieldsByEntityIndex, relationDisconnectQueryFieldsByEntityIndex } = (0, _extractnestedrelationfieldsbyentityindexutil.extractNestedRelationFieldsByEntityIndex)(entitiesArray, (0, _getnestedrelationfieldnamesutil.getNestedRelationFieldNames)({
            flatObjectMetadata: objectMetadata,
            flatFieldMetadataMaps: this.internalContext.flatFieldMetadataMaps
        }));
        const connectConfig = this.prepareRelationConnect(entitiesArray, target, relationConnectQueryFieldsByEntityIndex);
        return connectConfig.length > 0 || Object.keys(relationCreateQueryFieldsByEntityIndex).length > 0 || Object.keys(relationDisconnectQueryFieldsByEntityIndex).length > 0 ? [
            connectConfig,
            relationDisconnectQueryFieldsByEntityIndex,
            relationCreateQueryFieldsByEntityIndex
        ] : null;
    }
    prepareRelationConnect(entities, target, relationConnectQueryFieldsByEntityIndex) {
        const objectMetadata = (0, _getobjectmetadatafromentitytargetutil.getObjectMetadataFromEntityTarget)(target, this.internalContext);
        const relationConnectQueryConfigs = (0, _computerelationconnectqueryconfigsutil.computeRelationConnectQueryConfigs)(entities, objectMetadata, this.internalContext.flatObjectMetadataMaps, this.internalContext.flatFieldMetadataMaps, this.internalContext.flatIndexMaps, relationConnectQueryFieldsByEntityIndex);
        return relationConnectQueryConfigs;
    }
    async processRelationNestedQueries({ entities, relationNestedConfig, createRecords, target }) {
        const entitiesArray = Array.isArray(entities) ? entities : [
            entities
        ];
        const [relationConnectQueryConfigs, relationDisconnectQueryFieldsByEntityIndex, relationCreateQueryFieldsByEntityIndex] = relationNestedConfig;
        const updatedEntitiesWithDisconnect = this.processRelationDisconnect({
            entities: entitiesArray,
            relationDisconnectQueryFieldsByEntityIndex
        });
        const updatedEntitiesWithCreate = await this.processRelationCreate({
            entities: updatedEntitiesWithDisconnect,
            target,
            relationCreateQueryFieldsByEntityIndex,
            createRecords
        });
        const updatedEntitiesWithConnect = await this.processRelationConnect({
            entities: updatedEntitiesWithCreate,
            relationConnectQueryConfigs
        });
        return updatedEntitiesWithConnect;
    }
    async processRelationCreate({ entities, target, relationCreateQueryFieldsByEntityIndex, createRecords }) {
        if (Object.keys(relationCreateQueryFieldsByEntityIndex).length === 0) {
            return entities;
        }
        if (!(0, _utils.isDefined)(createRecords)) {
            throw new _twentyormexception.TwentyOrmException('Nested relation create is not supported in this operation', _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
        }
        const objectMetadata = (0, _getobjectmetadatafromentitytargetutil.getObjectMetadataFromEntityTarget)(target, this.internalContext);
        const { fieldIdByName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(this.internalContext.flatFieldMetadataMaps, objectMetadata);
        const groups = new Map();
        for (const [entityIndex, fields] of Object.entries(relationCreateQueryFieldsByEntityIndex)){
            for (const [fieldName, createObject] of Object.entries(fields)){
                const fieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                    flatEntityId: fieldIdByName[fieldName],
                    flatEntityMaps: this.internalContext.flatFieldMetadataMaps
                });
                if (!(0, _utils.isDefined)(fieldMetadata) || !(0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(fieldMetadata, _types.FieldMetadataType.RELATION) && !(0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(fieldMetadata, _types.FieldMetadataType.MORPH_RELATION) || fieldMetadata.settings?.relationType !== _relationtypeinterface.RelationType.MANY_TO_ONE || !(0, _utils.isDefined)(fieldMetadata.relationTargetObjectMetadataId)) {
                    throw new _twentyormexception.TwentyOrmException(`Create is not allowed for ${fieldName} on ${objectMetadata.nameSingular}`, _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
                }
                const joinColumnName = (0, _getassociatedrelationfieldnameutil.getAssociatedRelationFieldName)(fieldName);
                const entity = entities[Number(entityIndex)];
                const entityRecord = entity;
                if ((0, _utils.isDefined)(entityRecord[joinColumnName])) {
                    throw new _twentyormexception.TwentyOrmException(`Cannot provide both ${fieldName}.create and ${joinColumnName}`, _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
                }
                const targetObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                    flatEntityId: fieldMetadata.relationTargetObjectMetadataId,
                    flatEntityMaps: this.internalContext.flatObjectMetadataMaps
                });
                if (!(0, _utils.isDefined)(targetObjectMetadata)) {
                    throw new _twentyormexception.TwentyOrmException(`Target object metadata not found for ${fieldName}`, _twentyormexception.TwentyOrmExceptionCode.MALFORMED_METADATA);
                }
                const group = groups.get(targetObjectMetadata.id) ?? {
                    targetObjectMetadata,
                    entries: []
                };
                group.entries.push({
                    entityIndex: Number(entityIndex),
                    fieldName,
                    record: createObject[_constants.RELATION_NESTED_QUERY_KEYWORDS.CREATE]
                });
                groups.set(targetObjectMetadata.id, group);
            }
        }
        const updatedEntities = entities.map((entity)=>({
                ...entity
            }));
        for (const { targetObjectMetadata, entries } of groups.values()){
            const recordsWithIds = entries.map(({ record })=>({
                    ...record,
                    id: record.id ?? (0, _uuid.v4)()
                }));
            const createdRecords = await createRecords({
                targetObjectMetadata,
                records: recordsWithIds
            });
            if (createdRecords.length !== entries.length) {
                throw new _twentyormexception.TwentyOrmException(`Expected ${entries.length} created ${targetObjectMetadata.namePlural} records, received ${createdRecords.length}`, _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
            }
            const createdRecordIds = new Set(createdRecords.map(({ id })=>id).filter(_utils.isDefined));
            entries.forEach(({ entityIndex, fieldName }, index)=>{
                const createdRecordId = recordsWithIds[index].id;
                if (!createdRecordIds.has(createdRecordId)) {
                    throw new _twentyormexception.TwentyOrmException(`Created ${targetObjectMetadata.nameSingular} record ${createdRecordId} was not returned`, _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
                }
                updatedEntities[entityIndex] = {
                    ...updatedEntities[entityIndex],
                    [(0, _getassociatedrelationfieldnameutil.getAssociatedRelationFieldName)(fieldName)]: createdRecordId,
                    [fieldName]: null
                };
            });
        }
        return updatedEntities;
    }
    async processRelationConnect({ entities, relationConnectQueryConfigs }) {
        if (relationConnectQueryConfigs.length === 0) return entities;
        const recordsToConnectWithConfig = await this.executeConnectQueries(relationConnectQueryConfigs);
        const updatedEntities = this.updateEntitiesWithRecordToConnectId(entities, recordsToConnectWithConfig);
        return updatedEntities;
    }
    async executeConnectQueries(relationConnectQueryConfigs) {
        const allRecordsToConnectWithConfig = [];
        for (const connectQueryConfig of relationConnectQueryConfigs){
            const { clause, parameters } = (0, _createsqlwheretupleinclauseutils.createSqlWhereTupleInClause)(connectQueryConfig.recordToConnectConditions, connectQueryConfig.targetObjectName);
            const recordsToConnect = await this.fetchRecordsToConnect({
                connectQueryConfig,
                clause,
                parameters
            });
            allRecordsToConnectWithConfig.push([
                connectQueryConfig,
                recordsToConnect
            ]);
        }
        return allRecordsToConnectWithConfig;
    }
    async fetchRecordsToConnect({ connectQueryConfig, clause, parameters }) {
        const targetObjectName = connectQueryConfig.targetObjectName;
        const targetObjectMetadataId = this.internalContext.objectIdByNameSingular[targetObjectName];
        if (!(0, _utils.isDefined)(targetObjectMetadataId)) {
            throw new _twentyormexception.TwentyOrmException(`Target object metadata not found for ${targetObjectName}`, _twentyormexception.TwentyOrmExceptionCode.MALFORMED_METADATA);
        }
        const targetQueryBuilder = this.repository.getRepositoryForObjectMetadataId(targetObjectMetadataId).createQueryBuilder(targetObjectName);
        targetQueryBuilder.select([]);
        targetQueryBuilder.addSelect(`"${targetObjectName}"."id"`, 'id');
        for (const [field] of connectQueryConfig.recordToConnectConditions[0]){
            targetQueryBuilder.addSelect(`"${targetObjectName}"."${field}"`, field);
        }
        return targetQueryBuilder.where(clause, parameters).getRawMany();
    }
    updateEntitiesWithRecordToConnectId(entities, recordsToConnectWithConfig) {
        return entities.map((entity, index)=>{
            for (const [connectQueryConfig, recordsToConnect] of recordsToConnectWithConfig){
                if ((0, _utils.isDefined)(connectQueryConfig.recordToConnectConditionByEntityIndex[index])) {
                    const recordToConnect = recordsToConnect.filter((record)=>connectQueryConfig.recordToConnectConditionByEntityIndex[index].every(([field, value])=>record[field] === value));
                    if (recordToConnect.length !== 1) {
                        const { errorMessage, userFriendlyMessage } = (0, _formatConnectRecordNotFoundErrorMessageutil.formatConnectRecordNotFoundErrorMessage)(connectQueryConfig.connectFieldName, recordToConnect.length, connectQueryConfig.recordToConnectConditionByEntityIndex[index]);
                        throw new _twentyormexception.TwentyOrmException(errorMessage, _twentyormexception.TwentyOrmExceptionCode.CONNECT_RECORD_NOT_FOUND, {
                            userFriendlyMessage
                        });
                    }
                    entity = {
                        ...entity,
                        [connectQueryConfig.relationFieldName]: recordToConnect[0]['id'],
                        [connectQueryConfig.connectFieldName]: null
                    };
                }
            }
            return entity;
        });
    }
    processRelationDisconnect({ entities, relationDisconnectQueryFieldsByEntityIndex }) {
        return entities.map((entity, index)=>{
            const nestedRelationDisconnectFields = relationDisconnectQueryFieldsByEntityIndex[index];
            if (!(0, _utils.isDefined)(nestedRelationDisconnectFields)) return entity;
            for (const [disconnectFieldName, disconnectObject] of Object.entries(nestedRelationDisconnectFields ?? {})){
                entity = {
                    ...entity,
                    [disconnectFieldName]: undefined,
                    ...disconnectObject[_constants.RELATION_NESTED_QUERY_KEYWORDS.DISCONNECT] === true ? {
                        [(0, _getassociatedrelationfieldnameutil.getAssociatedRelationFieldName)(disconnectFieldName)]: null
                    } : {}
                };
            }
            return entity;
        });
    }
    constructor(repository){
        this.repository = repository;
        this.internalContext = repository.getInternalContext();
    }
};

//# sourceMappingURL=relation-nested-queries.js.map