"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommonCreateManyQueryRunnerService", {
    enumerable: true,
    get: function() {
        return CommonCreateManyQueryRunnerService;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _commonbasequeryrunnerservice = require("../common-base-query-runner.service");
const _buildwhereconditionsutil = require("./utils/build-where-conditions.util");
const _categorizerecordsutil = require("./utils/categorize-records.util");
const _getconflictingfieldsutil = require("./utils/get-conflicting-fields.util");
const _commonqueryrunnerexception = require("../errors/common-query-runner.exception");
const _standarderrormessageconstant = require("../errors/standard-error-message.constant");
const _commonqueryargstype = require("../../types/common-query-args.type");
const _buildcolumnstoreturn = require("../../../graphql/graphql-query-runner/utils/build-columns-to-return");
const _buildcolumnstoselect = require("../../../graphql/graphql-query-runner/utils/build-columns-to-select");
const _assertisvaliduuidutil = require("../../../graphql/workspace-query-runner/utils/assert-is-valid-uuid.util");
const _getallselectablecolumnnamesutils = require("../../../utils/get-all-selectable-column-names.utils");
const _recordpositionservice = require("../../../../core-modules/record-position/services/record-position.service");
const _findflatentitybyidinflatentitymapsutil = require("../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../../../metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const _assertmutationnotonremoteobjectutil = require("../../../../metadata-modules/object-metadata/utils/assert-mutation-not-on-remote-object.util");
const _containsnestedrelationcreateutil = require("../../../../twenty-orm/utils/contains-nested-relation-create.util");
const _getnestedrelationfieldnamesutil = require("../../../../twenty-orm/utils/get-nested-relation-field-names.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const MAX_NESTED_RELATION_CREATE_DEPTH = 5;
let CommonCreateManyQueryRunnerService = class CommonCreateManyQueryRunnerService extends _commonbasequeryrunnerservice.CommonBaseQueryRunnerService {
    async run(args, queryRunnerContext) {
        if (!(0, _utils.isDefined)(queryRunnerContext.transactionScope) && (0, _containsnestedrelationcreateutil.containsNestedRelationCreate)(args.data, (0, _getnestedrelationfieldnamesutil.getNestedRelationFieldNames)({
            flatObjectMetadata: queryRunnerContext.flatObjectMetadata,
            flatFieldMetadataMaps: queryRunnerContext.flatFieldMetadataMaps
        }))) {
            return this.workspaceOrmManager.runInWorkspaceTransaction((transactionScope)=>this.run(args, {
                    ...queryRunnerContext,
                    transactionScope,
                    repository: transactionScope.getRepository(queryRunnerContext.flatObjectMetadata.nameSingular, queryRunnerContext.rolePermissionConfig)
                }));
        }
        if (args.data.length > _constants.QUERY_MAX_RECORDS) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Maximum number of records to upsert is ${_constants.QUERY_MAX_RECORDS}.`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.TOO_MANY_RECORDS_TO_UPDATE, {
                userFriendlyMessage: /*i18n*/ {
                    id: "hw7Mwk",
                    message: "Maximum number of records to upsert is {QUERY_MAX_RECORDS}.",
                    values: {
                        QUERY_MAX_RECORDS: _constants.QUERY_MAX_RECORDS
                    }
                }
            });
        }
        const { repository, authContext, rolePermissionConfig, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps } = queryRunnerContext;
        if (!(0, _utils.isDefined)(flatIndexMaps)) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Missing flatIndexMaps in queryRunnerContext`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.MISSING_FLAT_INDEX_MAPS, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        const objectRecords = await this.insertOrUpsertRecords({
            repository,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            flatIndexMaps,
            args,
            workspaceId: authContext.workspace.id,
            queryRunnerContext
        });
        const upsertedRecords = await this.fetchUpsertedRecords({
            objectRecords,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            repository,
            selectedFieldsResult: args.selectedFieldsResult
        });
        await this.processNestedRelationsIfNeeded({
            args,
            records: upsertedRecords,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            authContext,
            rolePermissionConfig,
            repository,
            nestedRelationsReadPathOptions: this.getNestedRelationsReadPathOptions()
        });
        return upsertedRecords;
    }
    async processNestedRelationsIfNeeded({ args, records, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, authContext, rolePermissionConfig, repository, nestedRelationsReadPathOptions }) {
        if (!args.selectedFieldsResult.relations) {
            return;
        }
        await this.processNestedRelationsHelper.processNestedRelations({
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            parentObjectMetadataItem: flatObjectMetadata,
            parentObjectRecords: records,
            relations: args.selectedFieldsResult.relations,
            limit: _constants.QUERY_MAX_RECORDS,
            authContext,
            rolePermissionConfig,
            repository,
            selectedFields: args.selectedFieldsResult.select,
            ...nestedRelationsReadPathOptions
        });
    }
    async computeArgs(args, queryRunnerContext) {
        const { authContext, flatObjectMetadata, flatFieldMetadataMaps, flatObjectMetadataMaps } = queryRunnerContext;
        return {
            ...args,
            data: await this.dataArgProcessor.process({
                partialRecordInputs: args.data,
                authContext,
                flatObjectMetadata,
                flatFieldMetadataMaps,
                flatObjectMetadataMaps,
                shouldBackfillPositionIfUndefined: !args.upsert
            })
        };
    }
    async validate(args, queryRunnerContext) {
        const { flatObjectMetadata } = queryRunnerContext;
        (0, _assertmutationnotonremoteobjectutil.assertMutationNotOnRemoteObject)(flatObjectMetadata);
        args.data.forEach((record)=>{
            if (record?.id) {
                (0, _assertisvaliduuidutil.assertIsValidUuid)(record.id);
            }
        });
    }
    async insertOrUpsertRecords({ repository, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps, args, workspaceId, queryRunnerContext }) {
        const { selectedFieldsResult } = args;
        if (!args.upsert) {
            const selectedColumns = (0, _buildcolumnstoreturn.buildColumnsToReturn)({
                select: selectedFieldsResult.select,
                relations: selectedFieldsResult.relations,
                flatObjectMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            const writeRepository = this.getWriteRepository(queryRunnerContext);
            return writeRepository.runInsert({
                records: await this.resolveNestedRelationsForCreate({
                    records: args.data,
                    queryRunnerContext,
                    writeRepository
                }),
                columnsToReturn: selectedColumns
            });
        }
        return this.performUpsertOperation({
            repository,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            flatIndexMaps,
            args,
            selectedFieldsResult,
            workspaceId,
            queryRunnerContext
        });
    }
    async performUpsertOperation({ repository, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps, args, selectedFieldsResult, workspaceId, queryRunnerContext }) {
        const conflictingFieldGroups = (0, _getconflictingfieldsutil.getConflictingFields)(flatObjectMetadata, flatFieldMetadataMaps, flatIndexMaps);
        const existingRecords = await this.findExistingRecords({
            repository,
            flatObjectMetadata,
            flatFieldMetadataMaps,
            args,
            conflictingFieldGroups
        });
        const { recordsToUpdate, recordsToInsert } = (0, _categorizerecordsutil.categorizeRecords)(args.data, conflictingFieldGroups, existingRecords);
        const recordsToInsertWithPosition = await this.backfillPositionForInserts({
            recordsToInsert,
            flatObjectMetadata,
            flatFieldMetadataMaps,
            workspaceId
        });
        const result = {
            identifiers: [],
            generatedMaps: [],
            raw: []
        };
        const columnsToReturn = (0, _buildcolumnstoreturn.buildColumnsToReturn)({
            select: selectedFieldsResult.select,
            relations: selectedFieldsResult.relations,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
        if (recordsToUpdate.length > 0) {
            await this.processRecordsToUpdate({
                partialRecordsToUpdate: recordsToUpdate,
                flatObjectMetadata,
                flatFieldMetadataMaps,
                result,
                columnsToReturn,
                queryRunnerContext
            });
        }
        await this.processRecordsToInsert({
            recordsToInsert: recordsToInsertWithPosition,
            result,
            columnsToReturn,
            queryRunnerContext
        });
        return result;
    }
    async backfillPositionForInserts({ recordsToInsert, flatObjectMetadata, flatFieldMetadataMaps, workspaceId }) {
        if (recordsToInsert.length === 0) {
            return recordsToInsert;
        }
        const { fieldIdByName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, flatObjectMetadata);
        return this.recordPositionService.overridePositionOnRecords({
            partialRecordInputs: recordsToInsert,
            workspaceId,
            objectMetadata: {
                isCustom: flatObjectMetadata.isCustom ?? false,
                nameSingular: flatObjectMetadata.nameSingular,
                fieldIdByName
            },
            shouldBackfillPositionIfUndefined: true
        });
    }
    async findExistingRecords({ repository, flatObjectMetadata, flatFieldMetadataMaps, args, conflictingFieldGroups }) {
        const queryBuilder = repository.createQueryBuilder(flatObjectMetadata.nameSingular);
        const whereConditions = (0, _buildwhereconditionsutil.buildWhereConditions)(args.data, conflictingFieldGroups);
        if (whereConditions.length === 0) {
            return [];
        }
        queryBuilder.andWhere(new _typeorm.Brackets((qb)=>{
            whereConditions.forEach((condition, index)=>{
                if (index === 0) {
                    qb.where(condition);
                } else {
                    qb.orWhere(condition);
                }
            });
        }));
        const restrictedFields = repository.objectRecordsPermissions?.[flatObjectMetadata.id]?.restrictedFields;
        const selectOptions = (0, _getallselectablecolumnnamesutils.getAllSelectableColumnNames)({
            restrictedFields: restrictedFields ?? {},
            objectMetadata: {
                objectMetadataMapItem: flatObjectMetadata,
                flatFieldMetadataMaps
            }
        });
        return await queryBuilder.withDeleted().setFindOptions({
            select: selectOptions
        }).getMany();
    }
    async processRecordsToUpdate({ partialRecordsToUpdate, flatObjectMetadata, flatFieldMetadataMaps, result, columnsToReturn, queryRunnerContext }) {
        const updateInputs = partialRecordsToUpdate.map((record)=>this.getRecordWithoutCreatedBy(record, flatObjectMetadata, flatFieldMetadataMaps)).map((record)=>({
                id: record.id,
                data: {
                    ...record,
                    deletedAt: null
                }
            }));
        const writeRepository = this.getWriteRepository(queryRunnerContext);
        const resolvedData = await this.resolveNestedRelationsForCreate({
            records: updateInputs.map((input)=>input.data),
            queryRunnerContext,
            writeRepository
        });
        const savedRecords = await writeRepository.runBatchUpdate({
            inputs: updateInputs.map((input, index)=>({
                    id: input.id,
                    data: resolvedData[index]
                })),
            columnsToReturn
        });
        result.identifiers.push(...savedRecords.generatedMaps.map((record)=>({
                id: record.id
            })));
        result.generatedMaps.push(...savedRecords.generatedMaps.map((record)=>({
                id: record.id
            })));
    }
    async processRecordsToInsert({ recordsToInsert, result, columnsToReturn, queryRunnerContext }) {
        if (recordsToInsert.length === 0) {
            return;
        }
        const writeRepository = this.getWriteRepository(queryRunnerContext);
        const insertResult = await writeRepository.runInsert({
            records: await this.resolveNestedRelationsForCreate({
                records: recordsToInsert,
                queryRunnerContext,
                writeRepository
            }),
            columnsToReturn
        });
        result.identifiers.push(...insertResult.identifiers);
        result.generatedMaps.push(...insertResult.generatedMaps);
        result.raw.push(...insertResult.raw);
    }
    resolveNestedRelationsForCreate({ records, queryRunnerContext, writeRepository }) {
        const nestedCreateRecordsCounter = queryRunnerContext.nestedCreateRecordsCounter ??= {
            count: 0
        };
        return this.resolveNestedRelations({
            records,
            queryRunnerContext,
            writeRepository,
            createRecords: async ({ targetObjectMetadata, records: targetRecords })=>{
                nestedCreateRecordsCounter.count += targetRecords.length;
                if (nestedCreateRecordsCounter.count > _constants.QUERY_MAX_RECORDS) {
                    throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Maximum number of nested records to create is ${_constants.QUERY_MAX_RECORDS}.`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.TOO_MANY_RECORDS_TO_UPDATE, {
                        userFriendlyMessage: /*i18n*/ {
                            id: "4asysa",
                            message: "Maximum number of nested records to create is {QUERY_MAX_RECORDS}.",
                            values: {
                                QUERY_MAX_RECORDS: _constants.QUERY_MAX_RECORDS
                            }
                        }
                    });
                }
                const nestedOperationDepth = (queryRunnerContext.nestedOperationDepth ?? 0) + 1;
                if (nestedOperationDepth > MAX_NESTED_RELATION_CREATE_DEPTH) {
                    throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Nested relation create depth cannot exceed ${MAX_NESTED_RELATION_CREATE_DEPTH}`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_DATA, {
                        userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
                    });
                }
                const { results } = await this.execute({
                    data: targetRecords,
                    selectedFields: {
                        id: true
                    }
                }, {
                    ...queryRunnerContext,
                    flatObjectMetadata: targetObjectMetadata,
                    nestedCreateRecordsCounter,
                    nestedOperationDepth
                });
                return results;
            }
        });
    }
    async fetchUpsertedRecords({ objectRecords, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, repository, selectedFieldsResult }) {
        const queryBuilder = repository.createQueryBuilder(flatObjectMetadata.nameSingular);
        const columnsToSelect = (0, _buildcolumnstoselect.buildColumnsToSelect)({
            select: selectedFieldsResult.select,
            relations: selectedFieldsResult.relations,
            flatObjectMetadata,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
        const orderedIds = objectRecords.generatedMaps.map((record)=>record.id);
        const upsertedRecords = await queryBuilder.setFindOptions({
            select: columnsToSelect
        }).where({
            id: (0, _typeorm.In)(orderedIds)
        }).withDeleted().take(_constants.QUERY_MAX_RECORDS).getMany();
        const orderIndex = new Map(orderedIds.map((id, index)=>[
                id,
                index
            ]));
        upsertedRecords.sort((a, b)=>(orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0));
        return upsertedRecords;
    }
    async processQueryResult(queryResult, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, authContext) {
        return await this.commonResultGettersService.processRecordArray(queryResult, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, authContext.workspace.id);
    }
    getRecordWithoutCreatedBy(record, flatObjectMetadata, flatFieldMetadataMaps) {
        let recordWithoutCreatedByUpdate = record;
        const { fieldIdByName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, flatObjectMetadata);
        const createdByFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: fieldIdByName['createdBy'],
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(createdByFieldMetadata)) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Missing createdBy field metadata for object ${flatObjectMetadata.nameSingular}`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.MISSING_SYSTEM_FIELD, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        if ('createdBy' in record && createdByFieldMetadata.isSystem === true) {
            const { createdBy: _createdBy, ...recordWithoutCreatedBy } = record;
            recordWithoutCreatedByUpdate = recordWithoutCreatedBy;
        }
        return recordWithoutCreatedByUpdate;
    }
    constructor(recordPositionService){
        super(), this.recordPositionService = recordPositionService, this.operationName = _commonqueryargstype.CommonQueryNames.CREATE_MANY;
    }
};
CommonCreateManyQueryRunnerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _recordpositionservice.RecordPositionService === "undefined" ? Object : _recordpositionservice.RecordPositionService
    ])
], CommonCreateManyQueryRunnerService);

//# sourceMappingURL=common-create-many-query-runner.service.js.map