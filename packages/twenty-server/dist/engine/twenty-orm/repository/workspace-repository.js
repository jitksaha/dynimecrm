"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceRepository", {
    enumerable: true,
    get: function() {
        return WorkspaceRepository;
    }
});
const _guards = require("@sniptt/guards");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _databaseeventaction = require("../../api/graphql/graphql-query-runner/enums/database-event-action");
const _filesfieldsync = require("../field-operations/files-field-sync/files-field-sync");
const _permissionsutils = require("./permissions.utils");
const _formatdatautil = require("../utils/format-data.util");
const _formatresultutil = require("../utils/format-result.util");
const _formattwentyormeventtodatabasebatcheventutil = require("../utils/format-twenty-orm-event-to-database-batch-event.util");
const _mergerecordswithupdatevaluesutil = require("../utils/merge-records-with-update-values.util");
const _renderrowlevelpermissionfiltertosqlutil = require("../utils/render-row-level-permission-filter-to-sql.util");
const _resolverowlevelpermissionrecordfilterutil = require("../utils/resolve-row-level-permission-record-filter.util");
const _validaterlspredicatesforrecordsutil = require("../utils/validate-rls-predicates-for-records.util");
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const _buildinsertstatementutil = require("../sql/utils/build-insert-statement.util");
const _relationtypeinterface = require("../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _applyfindoptionsutil = require("../query-builder/utils/apply-find-options.util");
const _applymutationcriteriautil = require("../query-builder/utils/apply-mutation-criteria.util");
const _attachrelationsutil = require("./utils/attach-relations.util");
const _resolvesaveandupsertutil = require("./utils/resolve-save-and-upsert.util");
const _updateeventrecordsutil = require("./utils/update-event-records.util");
const _workspaceselectquerybuilder = require("../query-builder/workspace-select-query-builder");
const _compilenamedparametersutil = require("../sql/utils/compile-named-parameters.util");
const _removesqlinjectionutil = require("../../workspace-manager/workspace-migration/utils/remove-sql-injection.util");
const _serializejsonbwritevalueutil = require("../sql/utils/serialize-jsonb-write-value.util");
const MUTATION_EVENT_ACTIONS_BY_KIND = {
    delete: [
        _databaseeventaction.DatabaseEventAction.DESTROYED
    ],
    restore: [
        _databaseeventaction.DatabaseEventAction.RESTORED
    ],
    'soft-delete': [
        _databaseeventaction.DatabaseEventAction.DELETED
    ],
    update: [
        _databaseeventaction.DatabaseEventAction.UPDATED,
        _databaseeventaction.DatabaseEventAction.UPSERTED
    ]
};
let WorkspaceRepository = class WorkspaceRepository {
    get filesFieldSync() {
        return this._filesFieldSync ??= new _filesfieldsync.FilesFieldSync(this.options.internalContext);
    }
    async executeRaw(sql, parameters) {
        const compiled = (0, _compilenamedparametersutil.compileNamedParameters)(sql, parameters);
        return this.options.executor.execute(compiled);
    }
    createQueryBuilder(alias) {
        return new _workspaceselectquerybuilder.WorkspaceSelectQueryBuilder(alias ?? this.options.tableShape.nameSingular, {
            tableShape: this.options.tableShape,
            executor: this.options.executor,
            objectRecordsPermissions: this.options.objectRecordsPermissions,
            tableShapeByObjectMetadataId: this.options.tableShapeByObjectMetadataId,
            onBeforeExecute: (queryBuilder)=>this.onBeforeExecute(queryBuilder),
            formatResult: (records)=>this.formatResult(records)
        });
    }
    createPermissionBypassingQueryBuilder() {
        return this.buildBypassingEventSelectQueryBuilder(this.options.tableShape.nameSingular);
    }
    formatResult(records) {
        return (0, _formatresultutil.formatResult)(records, this.options.flatObjectMetadata, this.options.internalContext.flatObjectMetadataMaps, this.options.internalContext.flatFieldMetadataMaps);
    }
    // TypeORM drops undefined properties before it validates or writes anything;
    // strip them here so they neither throw on an unknown field nor bind as NULL
    formatWriteData(data) {
        const definedData = Object.fromEntries(Object.entries(data).filter(([, value])=>value !== undefined));
        return (0, _formatdatautil.formatData)(definedData, this.options.flatObjectMetadata, this.options.internalContext.flatFieldMetadataMaps);
    }
    applyWriteRowLevelPermissions(queryBuilder) {
        this.applyRowLevelPermissionPredicates(queryBuilder);
    }
    getInternalContext() {
        return this.options.internalContext;
    }
    get internalContext() {
        return this.options.internalContext;
    }
    getRepositoryForObjectMetadataId(objectMetadataId) {
        return this.options.getRepositoryForObjectMetadataId(objectMetadataId);
    }
    async find(options) {
        const records = await (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(this.createQueryBuilder(), options).getMany();
        if ((0, _utils.isDefined)(options?.relations)) {
            await this.loadRelations(records, (0, _applyfindoptionsutil.normalizeFindOptionsRelations)(options.relations), options.withDeleted ?? false, (0, _applyfindoptionsutil.splitFindOptionsOrder)(this.options.tableShape, options.order).orderByRelationFieldName);
        }
        return records;
    }
    async findBy(where) {
        return this.find({
            where
        });
    }
    async findAndCount(options) {
        const records = await this.find(options);
        const totalCount = await this.count(options);
        return [
            records,
            totalCount
        ];
    }
    async findAndCountBy(where) {
        return this.findAndCount({
            where
        });
    }
    async findOne(options) {
        if (!(0, _utils.isDefined)(options?.where)) {
            throw new _twentyormexception.TwentyOrmException('findOne requires a "where" condition', _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
        }
        const record = await (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(this.createQueryBuilder(), options).getOne();
        if ((0, _utils.isDefined)(record) && (0, _utils.isDefined)(options?.relations)) {
            await this.loadRelations([
                record
            ], (0, _applyfindoptionsutil.normalizeFindOptionsRelations)(options.relations), options.withDeleted ?? false, (0, _applyfindoptionsutil.splitFindOptionsOrder)(this.options.tableShape, options.order).orderByRelationFieldName);
        }
        return record;
    }
    async findOneBy(where) {
        return this.findOne({
            where
        });
    }
    async findOneOrFail(options) {
        const record = await this.findOne(options);
        if (!(0, _utils.isDefined)(record)) {
            throw new _twentyormexception.TwentyOrmException(`No "${this.options.tableShape.nameSingular}" record matches the given criteria`, _twentyormexception.TwentyOrmExceptionCode.ENTITY_NOT_FOUND);
        }
        return record;
    }
    async findOneByOrFail(where) {
        return this.findOneOrFail({
            where
        });
    }
    async count(options) {
        return (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(this.createQueryBuilder(), options).getCount();
    }
    async countBy(where) {
        return this.count({
            where
        });
    }
    async exists(options) {
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(this.createQueryBuilder(), {
            where: options?.where,
            withDeleted: options?.withDeleted
        });
        queryBuilder.select([
            'id'
        ]);
        return (0, _utils.isDefined)(await queryBuilder.getRawOne());
    }
    async existsBy(where) {
        return this.exists({
            where
        });
    }
    async minimum(columnName, where) {
        return this.aggregate('MIN', columnName, where);
    }
    async maximum(columnName, where) {
        return this.aggregate('MAX', columnName, where);
    }
    async sum(columnName, where) {
        return this.aggregate('SUM', columnName, where);
    }
    async average(columnName, where) {
        return this.aggregate('AVG', columnName, where);
    }
    async aggregate(sqlFunction, columnName, where) {
        if (!(0, _utils.isDefined)(this.options.tableShape.columnShapeByColumnName[columnName])) {
            throw new _twentyormexception.TwentyOrmException(`Column "${columnName}" does not exist on "${this.options.tableShape.nameSingular}"`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_COLUMN);
        }
        const queryBuilder = (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(this.createQueryBuilder(), (0, _utils.isDefined)(where) ? {
            where
        } : undefined);
        queryBuilder.select([]);
        queryBuilder.addSelect(`${sqlFunction}(${(0, _removesqlinjectionutil.escapeIdentifier)(this.options.tableShape.nameSingular)}.${(0, _removesqlinjectionutil.escapeIdentifier)(columnName)})`, 'value');
        const row = await queryBuilder.getRawOne();
        return (0, _utils.isDefined)(row?.value) ? Number(row.value) : null;
    }
    async loadRelations(records, relations, withDeleted, orderByRelationFieldName = {}) {
        if (records.length === 0) {
            return;
        }
        for (const [fieldName, nested] of Object.entries(relations)){
            if (nested === false) {
                continue;
            }
            const relationShape = this.options.tableShape.relationShapeByFieldName[fieldName];
            if (!(0, _utils.isDefined)(relationShape)) {
                throw new _twentyormexception.TwentyOrmException(`Relation "${fieldName}" does not exist on "${this.options.tableShape.nameSingular}"`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_RELATION);
            }
            const nestedRelations = typeof nested === 'object' ? nested : undefined;
            const targetRepository = this.options.getRepositoryForObjectMetadataId(relationShape.targetObjectMetadataId);
            if (relationShape.relationType === _relationtypeinterface.RelationType.MANY_TO_ONE) {
                await this.attachToOneRelation({
                    records,
                    fieldName,
                    joinColumnName: relationShape.joinColumnName,
                    targetRepository,
                    nestedRelations
                });
            } else if (relationShape.relationType === _relationtypeinterface.RelationType.ONE_TO_MANY) {
                await this.attachToManyRelation({
                    records,
                    fieldName,
                    relationShape,
                    targetRepository,
                    nestedRelations,
                    withDeleted,
                    order: orderByRelationFieldName[fieldName]
                });
            } else {
                throw new _twentyormexception.TwentyOrmException(`Loading "${relationShape.relationType}" relations through find is not supported yet`, _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION);
            }
        }
    }
    async attachToOneRelation({ records, fieldName, joinColumnName, targetRepository, nestedRelations }) {
        if (!(0, _utils.isDefined)(joinColumnName)) {
            throw new _twentyormexception.TwentyOrmException(`Relation "${fieldName}" has no join column to resolve`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_RELATION);
        }
        const foreignKeys = (0, _attachrelationsutil.collectForeignKeys)(records, joinColumnName);
        const targets = foreignKeys.length > 0 ? await targetRepository.find({
            where: {
                id: (0, _typeorm.In)(foreignKeys)
            },
            withDeleted: true,
            relations: nestedRelations
        }) : [];
        (0, _attachrelationsutil.attachToOneRelationToRecords)({
            records,
            fieldName,
            joinColumnName,
            targets
        });
    }
    async attachToManyRelation({ records, fieldName, relationShape, targetRepository, nestedRelations, withDeleted, order }) {
        const inverseForeignKeyColumnName = this.resolveInverseForeignKeyColumnName(relationShape);
        const parentIds = (0, _attachrelationsutil.collectRecordIds)(records);
        const children = parentIds.length > 0 ? await targetRepository.find({
            where: {
                [inverseForeignKeyColumnName]: (0, _typeorm.In)(parentIds)
            },
            relations: nestedRelations,
            withDeleted,
            order
        }) : [];
        (0, _attachrelationsutil.attachToManyRelationToRecords)({
            records,
            fieldName,
            inverseForeignKeyColumnName,
            children
        });
    }
    resolveInverseForeignKeyColumnName(relationShape) {
        const targetTableShape = this.options.tableShapeByObjectMetadataId(relationShape.targetObjectMetadataId);
        const inverseRelationShape = Object.values(targetTableShape.relationShapeByFieldName).find((candidate)=>candidate.fieldMetadataId === relationShape.targetFieldMetadataId);
        if (!(0, _utils.isDefined)(inverseRelationShape?.joinColumnName)) {
            throw new _twentyormexception.TwentyOrmException(`Could not resolve the inverse foreign key for a to-many relation on "${this.options.tableShape.nameSingular}"`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_RELATION);
        }
        return inverseRelationShape.joinColumnName;
    }
    async insert(entityOrEntities, options) {
        const records = Array.isArray(entityOrEntities) ? entityOrEntities : [
            entityOrEntities
        ];
        const { identifiers, generatedMaps, raw } = await this.runInsert({
            records,
            columnsToReturn: this.options.shouldBypassPermissionChecks ? Object.keys(this.options.tableShape.columnShapeByColumnName) : [
                'id'
            ],
            onConflictDoNothing: options?.onConflictDoNothing
        });
        const insertResult = new _typeorm.InsertResult();
        insertResult.identifiers = identifiers;
        insertResult.generatedMaps = generatedMaps;
        insertResult.raw = raw;
        return insertResult;
    }
    async update(criteria, partialEntity) {
        const records = await this.runMutation({
            selectQueryBuilder: (0, _applymutationcriteriautil.applyMutationCriteriaToQueryBuilder)(this.createQueryBuilder(), criteria),
            rowLevelPermissionsApplied: false,
            kind: 'update',
            columnsToReturn: [
                'id'
            ],
            data: partialEntity
        });
        return this.buildUpdateResult(records);
    }
    async updateMany(inputs) {
        if (inputs.length > _constants.QUERY_MAX_RECORDS) {
            throw new _twentyormexception.TwentyOrmException(`Cannot update more than ${_constants.QUERY_MAX_RECORDS} records at once`, _twentyormexception.TwentyOrmExceptionCode.TOO_MANY_RECORDS_TO_UPDATE, {
                userFriendlyMessage: /*i18n*/ {
                    id: "4ysDL0",
                    message: "You can only update up to {QUERY_MAX_RECORDS} records at once.",
                    values: {
                        QUERY_MAX_RECORDS: _constants.QUERY_MAX_RECORDS
                    }
                }
            });
        }
        const { generatedMaps, raw } = await this.runBatchUpdate({
            inputs: inputs.map((input)=>({
                    id: input.criteria,
                    data: input.partialEntity
                })),
            columnsToReturn: [
                'id'
            ]
        });
        const updateResult = new _typeorm.UpdateResult();
        updateResult.raw = raw;
        updateResult.affected = raw.length;
        updateResult.generatedMaps = generatedMaps;
        return updateResult;
    }
    async delete(criteria) {
        const records = await this.runMutation({
            selectQueryBuilder: (0, _applymutationcriteriautil.applyMutationCriteriaToQueryBuilder)(this.createQueryBuilder(), criteria),
            rowLevelPermissionsApplied: false,
            kind: 'delete',
            columnsToReturn: [
                'id'
            ]
        });
        const deleteResult = new _typeorm.DeleteResult();
        deleteResult.raw = records;
        deleteResult.affected = records.length;
        return deleteResult;
    }
    async softDelete(criteria) {
        const records = await this.runMutation({
            selectQueryBuilder: (0, _applymutationcriteriautil.applyMutationCriteriaToQueryBuilder)(this.createQueryBuilder(), criteria),
            rowLevelPermissionsApplied: false,
            kind: 'soft-delete',
            columnsToReturn: [
                'id'
            ]
        });
        return this.buildUpdateResult(records);
    }
    async restore(criteria) {
        const records = await this.runMutation({
            selectQueryBuilder: (0, _applymutationcriteriautil.applyMutationCriteriaToQueryBuilder)(this.createQueryBuilder(), criteria),
            rowLevelPermissionsApplied: false,
            kind: 'restore',
            columnsToReturn: [
                'id'
            ]
        });
        return this.buildUpdateResult(records);
    }
    buildUpdateResult(records) {
        const updateResult = new _typeorm.UpdateResult();
        updateResult.raw = records;
        updateResult.affected = records.length;
        updateResult.generatedMaps = records;
        return updateResult;
    }
    runAtomically(work) {
        return this.options.isTransactional ? work(this) : this.options.runInNewTransaction(work);
    }
    async findExistingIds(ids) {
        if (ids.length === 0) {
            return new Set();
        }
        const { schemaName, tableName } = this.options.tableShape;
        const rows = await this.executeRaw(`SELECT "id" FROM ${(0, _removesqlinjectionutil.escapeIdentifier)(schemaName)}.${(0, _removesqlinjectionutil.escapeIdentifier)(tableName)} WHERE "id" IN (:...ids)`, {
            ids
        });
        return new Set(rows.map((row)=>row.id));
    }
    async save(entityOrEntities) {
        const entities = Array.isArray(entityOrEntities) ? entityOrEntities : [
            entityOrEntities
        ];
        this.assertNoNestedRelationObjects(entities);
        if (entities.length === 0) {
            return [];
        }
        return this.runAtomically(async (repository)=>{
            const existingIds = await repository.findExistingIds(entities.map((entity)=>entity.id).filter(_guards.isNonEmptyString));
            const { toUpdate, toInsert } = (0, _resolvesaveandupsertutil.partitionEntitiesForSave)(entities, existingIds);
            if (toUpdate.length > 0) {
                await repository.runBatchUpdate({
                    inputs: toUpdate.flatMap((entity)=>(0, _guards.isNonEmptyString)(entity.id) ? [
                            {
                                id: entity.id,
                                data: entity
                            }
                        ] : []),
                    columnsToReturn: [
                        'id'
                    ]
                });
            }
            const insertedIds = toInsert.length > 0 ? (await repository.runInsert({
                records: toInsert,
                columnsToReturn: [
                    'id'
                ]
            })).identifiers.map((identifier)=>identifier.id) : [];
            const savedIds = [
                ...toUpdate.map((entity)=>entity.id).filter(_guards.isNonEmptyString),
                ...insertedIds.filter(_guards.isNonEmptyString)
            ];
            const savedById = new Map(savedIds.length > 0 ? (await repository.find({
                where: {
                    id: (0, _typeorm.In)(savedIds)
                },
                withDeleted: true
            })).map((record)=>[
                    record.id,
                    record
                ]) : []);
            let insertCursor = 0;
            return entities.flatMap((entity)=>{
                const savedId = (0, _guards.isNonEmptyString)(entity.id) && existingIds.has(entity.id) ? entity.id : insertedIds[insertCursor++];
                const record = (0, _guards.isNonEmptyString)(savedId) ? savedById.get(savedId) : undefined;
                return (0, _utils.isDefined)(record) ? [
                    record
                ] : [];
            });
        });
    }
    async upsert(entityOrEntities, conflictPathsOrOptions) {
        const entities = Array.isArray(entityOrEntities) ? entityOrEntities : [
            entityOrEntities
        ];
        this.assertNoNestedRelationObjects(entities);
        const conflictPaths = Array.isArray(conflictPathsOrOptions) ? conflictPathsOrOptions : conflictPathsOrOptions.conflictPaths;
        if (conflictPaths.length === 0) {
            throw new _twentyormexception.TwentyOrmException('upsert requires at least one conflict path', _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
        }
        if (entities.length === 0) {
            return new _typeorm.InsertResult();
        }
        return this.runAtomically(async (repository)=>{
            const conflictWhere = entities.map((entity)=>Object.fromEntries(conflictPaths.map((path)=>[
                        path,
                        entity[path] ?? null
                    ])));
            const existingRecords = await (0, _applyfindoptionsutil.applyFindOptionsToQueryBuilder)(repository.createPermissionBypassingQueryBuilder(), {
                where: conflictWhere,
                withDeleted: true
            }).getMany();
            const { toUpdate, toInsert } = (0, _resolvesaveandupsertutil.matchEntitiesForUpsert)(entities, existingRecords, conflictPaths);
            const emptyOutcome = {
                identifiers: [],
                generatedMaps: [],
                raw: []
            };
            const updateOutcome = toUpdate.length > 0 ? await repository.runBatchUpdate({
                inputs: toUpdate.map((match)=>({
                        id: match.id,
                        data: match.entity
                    })),
                columnsToReturn: [
                    'id'
                ]
            }) : emptyOutcome;
            const insertOutcome = toInsert.length > 0 ? await repository.runInsert({
                records: toInsert,
                columnsToReturn: [
                    'id'
                ]
            }) : emptyOutcome;
            const insertResult = new _typeorm.InsertResult();
            insertResult.identifiers = [
                ...updateOutcome.identifiers,
                ...insertOutcome.identifiers
            ];
            insertResult.generatedMaps = [
                ...updateOutcome.generatedMaps,
                ...insertOutcome.generatedMaps
            ];
            insertResult.raw = [
                ...updateOutcome.raw,
                ...insertOutcome.raw
            ];
            return insertResult;
        });
    }
    assertNoNestedRelationObjects(entities) {
        for (const entity of entities){
            for (const key of Object.keys(entity)){
                const value = entity[key];
                if ((0, _utils.isDefined)(this.options.tableShape.relationShapeByFieldName[key]) && typeof value === 'object' && value !== null) {
                    throw new _twentyormexception.TwentyOrmException(`Writing nested relation "${key}" through the ORM v2 repository is not supported yet`, _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION);
                }
            }
        }
    }
    async runInsert({ records, columnsToReturn, onConflictDoNothing }) {
        if (records.length === 0) {
            return {
                identifiers: [],
                generatedMaps: [],
                raw: []
            };
        }
        const filesFieldDiff = this.filesFieldSync.computeFilesFieldDiffBeforeInsert(records, this.options.tableShape.nameSingular);
        let filesFieldFileIds = null;
        let recordsToInsert = records;
        if ((0, _utils.isDefined)(filesFieldDiff)) {
            const enriched = await this.filesFieldSync.enrichFilesFields({
                entities: records,
                filesFieldDiffByEntityIndex: filesFieldDiff,
                workspaceId: this.options.internalContext.workspaceId,
                target: this.options.tableShape.nameSingular
            });
            filesFieldFileIds = enriched.fileIds;
            recordsToInsert = enriched.entities;
        }
        const { columnNames, rows, parameters, insertedColumns, formattedRecords } = this.buildInsertRows(recordsToInsert);
        this.validateWriteIsPermitted({
            operationType: 'insert',
            columnsToReturn,
            updatedColumns: insertedColumns
        });
        this.validateRLSPredicatesForWrittenRecords(this.formatResult(formattedRecords));
        const sql = (0, _buildinsertstatementutil.buildInsertStatement)({
            tableShape: this.options.tableShape,
            columnNames,
            rows,
            returningColumns: columnsToReturn,
            onConflictDoNothing
        });
        const rawRows = await this.executeRaw(sql, parameters);
        if ((0, _utils.isDefined)(filesFieldFileIds)) {
            await this.filesFieldSync.updateFileEntityRecords(filesFieldFileIds);
        }
        const generatedMaps = this.formatResult(rawRows);
        const insertedIds = rawRows.map((row)=>row.id).filter(_guards.isNonEmptyString);
        await this.emitCreateEvents(insertedIds);
        return {
            identifiers: insertedIds.map((id)=>({
                    id
                })),
            generatedMaps,
            raw: rawRows
        };
    }
    async runBatchUpdate({ inputs, columnsToReturn }) {
        if (inputs.length === 0) {
            return {
                identifiers: [],
                generatedMaps: [],
                raw: []
            };
        }
        const recordsBefore = [];
        const recordsAfter = [];
        const generatedMaps = [];
        const updateEventColumnsToReturn = (0, _updateeventrecordsutil.getUpdateEventColumnsToReturn)(columnsToReturn, this.options.tableShape);
        const rawBeforeByInputIndex = [];
        const existingRecordsMapById = {};
        for (const input of inputs){
            const rawBefore = await this.buildIdsEventSnapshotQueryBuilder([
                input.id
            ]).getMany({
                noFormatting: true
            });
            rawBeforeByInputIndex.push(rawBefore);
            for (const formattedRecord of this.formatResult(rawBefore)){
                if ((0, _utils.isDefined)(formattedRecord.id)) {
                    existingRecordsMapById[formattedRecord.id] = formattedRecord;
                }
            }
        }
        let dataByInputIndex = inputs.map((input)=>input.data);
        let filesFieldFileIds = null;
        const filesFieldDiff = this.filesFieldSync.computeFilesFieldDiffBeforeUpsert(dataByInputIndex, this.options.tableShape.nameSingular, existingRecordsMapById);
        if ((0, _utils.isDefined)(filesFieldDiff)) {
            const enriched = await this.filesFieldSync.enrichFilesFields({
                entities: dataByInputIndex,
                filesFieldDiffByEntityIndex: filesFieldDiff,
                workspaceId: this.options.internalContext.workspaceId,
                target: this.options.tableShape.nameSingular
            });
            filesFieldFileIds = enriched.fileIds;
            dataByInputIndex = enriched.entities;
        }
        for (const [index, input] of inputs.entries()){
            const { id: _id, ...setColumns } = this.formatWriteData(dataByInputIndex[index]);
            this.validateWriteIsPermitted({
                operationType: 'update',
                columnsToReturn,
                updatedColumns: Object.keys(setColumns)
            });
            const rawBeforeForInput = rawBeforeByInputIndex[index];
            recordsBefore.push(...rawBeforeForInput);
            this.validateRLSPredicatesForWrittenRecords(this.formatResult(rawBeforeForInput.map((record)=>({
                    ...record,
                    ...setColumns
                }))), 'Updated record does not satisfy row-level security constraints of your current role');
            const selectQueryBuilder = this.createQueryBuilder().where({
                id: input.id
            });
            this.applyRowLevelPermissionPredicates(selectQueryBuilder);
            const result = await selectQueryBuilder.update().set(setColumns).returning(updateEventColumnsToReturn).execute();
            generatedMaps.push(...result.generatedMaps);
            const recordsAfterWrite = this.options.shouldSkipEventEmission ? [] : await this.buildIdsEventSnapshotQueryBuilder([
                input.id
            ]).getMany({
                noFormatting: true
            });
            recordsAfter.push(...(0, _updateeventrecordsutil.mergeReturnedUpdateTimestamps)((0, _mergerecordswithupdatevaluesutil.mergeRecordsWithUpdateValues)((0, _mergerecordswithupdatevaluesutil.getUpdateEventRecords)(rawBeforeForInput, recordsAfterWrite), setColumns), result.generatedMaps));
        }
        if ((0, _utils.isDefined)(filesFieldFileIds)) {
            await this.filesFieldSync.updateFileEntityRecords(filesFieldFileIds);
        }
        this.emitMutationEvent({
            kind: 'update',
            recordsBefore,
            recordsAfter
        });
        return {
            identifiers: generatedMaps.map((record)=>({
                    id: String(record.id)
                })),
            generatedMaps,
            raw: generatedMaps
        };
    }
    buildInsertRows(records) {
        const formattedRecords = records.map((record)=>this.formatWriteData(record));
        const columnNameSet = new Set();
        for (const record of formattedRecords){
            for (const columnName of Object.keys(record)){
                if (!(0, _utils.isDefined)(this.options.tableShape.columnShapeByColumnName[columnName])) {
                    throw new _twentyormexception.TwentyOrmException(`Column "${columnName}" does not exist on "${this.options.tableShape.nameSingular}"`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_COLUMN);
                }
                columnNameSet.add(columnName);
            }
        }
        const columnNames = [
            ...columnNameSet
        ];
        const parameters = {};
        let parameterSequence = 0;
        const rows = formattedRecords.map((record)=>{
            const valueByColumnName = {
                ...record
            };
            return columnNames.map((columnName)=>{
                if (!(columnName in valueByColumnName)) {
                    return {
                        kind: 'default'
                    };
                }
                const parameterName = `ormInsert_${parameterSequence++}`;
                parameters[parameterName] = (0, _serializejsonbwritevalueutil.serializeJsonbWriteValue)(this.options.tableShape.columnShapeByColumnName[columnName], valueByColumnName[columnName]);
                return {
                    kind: 'parameter',
                    parameterName
                };
            });
        });
        return {
            columnNames,
            rows,
            parameters,
            insertedColumns: columnNames,
            formattedRecords
        };
    }
    async emitCreateEvents(insertedIds) {
        if (insertedIds.length === 0 || this.options.shouldSkipEventEmission) {
            return;
        }
        const recordsAfter = await this.buildIdsEventSnapshotQueryBuilder(insertedIds).getMany({
            noFormatting: true
        });
        const formattedAfter = this.formatResult(recordsAfter);
        for (const action of [
            _databaseeventaction.DatabaseEventAction.CREATED,
            _databaseeventaction.DatabaseEventAction.UPSERTED
        ]){
            const event = (0, _formattwentyormeventtodatabasebatcheventutil.formatTwentyOrmEventToDatabaseBatchEvent)({
                action,
                objectMetadataItem: this.options.flatObjectMetadata,
                flatFieldMetadataMaps: this.options.internalContext.flatFieldMetadataMaps,
                workspaceId: this.options.internalContext.workspaceId,
                recordsAfter: formattedAfter,
                authContext: this.options.authContext
            });
            if ((0, _utils.isDefined)(event)) {
                this.options.internalContext.eventEmitterService.emitDatabaseBatchEvent(event);
            }
        }
    }
    buildBypassingEventSelectQueryBuilder(alias) {
        return new _workspaceselectquerybuilder.WorkspaceSelectQueryBuilder(alias, {
            tableShape: this.options.tableShape,
            executor: this.options.executor,
            objectRecordsPermissions: this.options.objectRecordsPermissions,
            tableShapeByObjectMetadataId: this.options.tableShapeByObjectMetadataId,
            onBeforeExecute: ()=>undefined,
            formatResult: (records)=>this.formatResult(records)
        });
    }
    buildIdsEventSnapshotQueryBuilder(ids) {
        return this.buildBypassingEventSelectQueryBuilder(this.options.tableShape.nameSingular).where({
            id: (0, _typeorm.In)(ids)
        }).withDeleted();
    }
    async runMutation({ selectQueryBuilder, rowLevelPermissionsApplied, kind, columnsToReturn, data }) {
        if (!rowLevelPermissionsApplied) {
            this.applyRowLevelPermissionPredicates(selectQueryBuilder);
        }
        const eventSelectQueryBuilder = this.buildEventSnapshotQueryBuilder(selectQueryBuilder);
        const recordsBefore = kind === 'delete' ? [
            await eventSelectQueryBuilder.getOne({
                noFormatting: true
            })
        ].filter(_utils.isDefined) : await eventSelectQueryBuilder.getMany({
            noFormatting: true
        });
        if (kind === 'update' && recordsBefore.length > _constants.QUERY_MAX_RECORDS) {
            throw new _twentyormexception.TwentyOrmException(`Cannot update more than ${_constants.QUERY_MAX_RECORDS} records at once`, _twentyormexception.TwentyOrmExceptionCode.TOO_MANY_RECORDS_TO_UPDATE, {
                userFriendlyMessage: /*i18n*/ {
                    id: "4ysDL0",
                    message: "You can only update up to {QUERY_MAX_RECORDS} records at once.",
                    values: {
                        QUERY_MAX_RECORDS: _constants.QUERY_MAX_RECORDS
                    }
                }
            });
        }
        let filesFieldFileIds = null;
        let dataToWrite = data;
        if (kind === 'update' && (0, _utils.isDefined)(data)) {
            const formattedBefore = this.formatResult(recordsBefore);
            const filesFieldDiff = this.filesFieldSync.computeFilesFieldDiffBeforeUpdateOne(data, this.options.tableShape.nameSingular, formattedBefore);
            if ((0, _utils.isDefined)(filesFieldDiff)) {
                const enriched = await this.filesFieldSync.enrichFilesFields({
                    entities: formattedBefore.map(()=>data),
                    filesFieldDiffByEntityIndex: filesFieldDiff,
                    workspaceId: this.options.internalContext.workspaceId,
                    target: this.options.tableShape.nameSingular
                });
                filesFieldFileIds = enriched.fileIds;
                dataToWrite = enriched.entities[0];
            }
        }
        let setColumns;
        if (kind === 'update' && (0, _utils.isDefined)(dataToWrite)) {
            const { id: _id, ...columns } = this.formatWriteData(dataToWrite);
            setColumns = columns;
        }
        this.validateWriteIsPermitted({
            operationType: kind,
            columnsToReturn,
            updatedColumns: (0, _utils.isDefined)(setColumns) ? Object.keys(setColumns) : []
        });
        if (kind === 'update' && (0, _utils.isDefined)(setColumns)) {
            this.validateRLSPredicatesForWrittenRecords(this.formatResult(recordsBefore.map((record)=>({
                    ...record,
                    ...setColumns
                }))), 'Updated record does not satisfy row-level security constraints of your current role');
        }
        const mutationResult = await this.morphAndExecute({
            selectQueryBuilder,
            kind,
            columnsToReturn: kind === 'update' ? (0, _updateeventrecordsutil.getUpdateEventColumnsToReturn)(columnsToReturn, this.options.tableShape) : columnsToReturn,
            setColumns
        });
        if ((0, _utils.isDefined)(filesFieldFileIds)) {
            await this.filesFieldSync.updateFileEntityRecords(filesFieldFileIds);
        }
        const recordsAfterWrite = kind === 'delete' || this.options.shouldSkipEventEmission ? undefined : await eventSelectQueryBuilder.getMany({
            noFormatting: true
        });
        const recordsAfter = kind === 'update' && (0, _utils.isDefined)(setColumns) ? (0, _updateeventrecordsutil.mergeReturnedUpdateTimestamps)((0, _mergerecordswithupdatevaluesutil.mergeRecordsWithUpdateValues)((0, _mergerecordswithupdatevaluesutil.getUpdateEventRecords)(recordsBefore, recordsAfterWrite ?? []), setColumns), mutationResult.generatedMaps) : recordsAfterWrite;
        this.emitMutationEvent({
            kind,
            recordsBefore,
            recordsAfter
        });
        return mutationResult.generatedMaps;
    }
    async morphAndExecute({ selectQueryBuilder, kind, columnsToReturn, setColumns }) {
        if (kind === 'update') {
            return selectQueryBuilder.update().set(setColumns ?? {}).returning(columnsToReturn).execute();
        }
        const mutationQueryBuilder = kind === 'soft-delete' ? selectQueryBuilder.softDelete() : kind === 'restore' ? selectQueryBuilder.restore() : selectQueryBuilder.delete();
        return mutationQueryBuilder.returning(columnsToReturn).execute();
    }
    buildEventSnapshotQueryBuilder(source) {
        return this.buildBypassingEventSelectQueryBuilder(source.alias).copyWhereFrom(source).withDeleted();
    }
    validateWriteIsPermitted({ operationType, columnsToReturn, updatedColumns }) {
        if (this.options.shouldBypassPermissionChecks) {
            return;
        }
        (0, _permissionsutils.validateOperationIsPermittedOrThrow)({
            entityName: this.options.tableShape.nameSingular,
            operationType,
            objectsPermissions: this.options.objectRecordsPermissions,
            flatObjectMetadataMaps: this.options.internalContext.flatObjectMetadataMaps,
            flatFieldMetadataMaps: this.options.internalContext.flatFieldMetadataMaps,
            objectIdByNameSingular: this.options.internalContext.objectIdByNameSingular,
            selectedColumns: columnsToReturn,
            allFieldsSelected: false,
            updatedColumns,
            authContext: this.options.authContext
        });
    }
    validateRLSPredicatesForWrittenRecords(records, errorMessage) {
        (0, _validaterlspredicatesforrecordsutil.validateRLSPredicatesForRecords)({
            records,
            objectMetadata: this.options.flatObjectMetadata,
            internalContext: this.options.internalContext,
            authContext: this.options.authContext,
            shouldBypassPermissionChecks: this.options.shouldBypassPermissionChecks,
            ...(0, _utils.isDefined)(errorMessage) ? {
                errorMessage
            } : {}
        });
    }
    emitMutationEvent({ kind, recordsBefore, recordsAfter }) {
        if (this.options.shouldSkipEventEmission) {
            return;
        }
        const actions = MUTATION_EVENT_ACTIONS_BY_KIND[kind];
        const formattedBefore = this.formatResult(recordsBefore);
        const formattedAfter = (0, _utils.isDefined)(recordsAfter) ? this.formatResult(recordsAfter) : undefined;
        for (const action of actions){
            const event = (0, _formattwentyormeventtodatabasebatcheventutil.formatTwentyOrmEventToDatabaseBatchEvent)({
                action,
                objectMetadataItem: this.options.flatObjectMetadata,
                flatFieldMetadataMaps: this.options.internalContext.flatFieldMetadataMaps,
                workspaceId: this.options.internalContext.workspaceId,
                recordsBefore: formattedBefore,
                recordsAfter: formattedAfter,
                authContext: this.options.authContext
            });
            if ((0, _utils.isDefined)(event)) {
                this.options.internalContext.eventEmitterService.emitDatabaseBatchEvent(event);
            }
        }
    }
    onBeforeExecute(queryBuilder) {
        this.applyRowLevelPermissionPredicates(queryBuilder);
        this.validateQueryIsPermitted(queryBuilder);
    }
    validateQueryIsPermitted(queryBuilder) {
        if (this.options.shouldBypassPermissionChecks) {
            return;
        }
        const columnNamesByAlias = queryBuilder.getReferencedColumnNamesByAlias();
        for (const [alias, columnNames] of Object.entries(columnNamesByAlias)){
            const nameSingular = alias === queryBuilder.alias ? this.options.tableShape.nameSingular : queryBuilder.getJoinedTableShape(alias)?.nameSingular;
            if (!(0, _utils.isDefined)(nameSingular)) {
                continue;
            }
            (0, _permissionsutils.validateOperationIsPermittedOrThrow)({
                entityName: nameSingular,
                operationType: 'select',
                objectsPermissions: this.options.objectRecordsPermissions,
                flatObjectMetadataMaps: this.options.internalContext.flatObjectMetadataMaps,
                flatFieldMetadataMaps: this.options.internalContext.flatFieldMetadataMaps,
                objectIdByNameSingular: this.options.internalContext.objectIdByNameSingular,
                selectedColumns: columnNames,
                allFieldsSelected: false,
                updatedColumns: []
            });
        }
    }
    applyRowLevelPermissionPredicates(queryBuilder) {
        if (this.options.shouldBypassPermissionChecks) {
            return;
        }
        this.applyRowLevelPermissionPredicateForAlias({
            queryBuilder,
            alias: queryBuilder.alias,
            flatObjectMetadata: this.options.flatObjectMetadata
        });
        for (const joinAlias of queryBuilder.getJoinAliases()){
            const joinedTableShape = queryBuilder.getJoinedTableShape(joinAlias.name);
            if (!(0, _utils.isDefined)(joinedTableShape)) {
                continue;
            }
            this.applyRowLevelPermissionPredicateForAlias({
                queryBuilder,
                alias: joinAlias.name,
                flatObjectMetadata: this.options.flatObjectMetadataByObjectMetadataId(joinedTableShape.objectMetadataId)
            });
        }
    }
    applyRowLevelPermissionPredicateForAlias({ queryBuilder, alias, flatObjectMetadata }) {
        if (!queryBuilder.markRowLevelPermissionApplied(alias)) {
            return;
        }
        const recordFilter = (0, _resolverowlevelpermissionrecordfilterutil.resolveRowLevelPermissionRecordFilter)({
            internalContext: this.options.internalContext,
            authContext: this.options.authContext,
            objectMetadata: flatObjectMetadata
        });
        if (!(0, _utils.isDefined)(recordFilter)) {
            return;
        }
        const renderedCondition = (0, _renderrowlevelpermissionfiltertosqlutil.renderRowLevelPermissionFilterToSql)({
            recordFilter,
            tableAlias: alias,
            objectMetadata: flatObjectMetadata,
            flatFieldMetadataMaps: this.options.internalContext.flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(renderedCondition)) {
            return;
        }
        if (alias === queryBuilder.alias) {
            queryBuilder.andWhere(renderedCondition.sql, renderedCondition.parameters);
            return;
        }
        queryBuilder.addJoinCondition(alias, renderedCondition.sql);
        queryBuilder.setParameters(renderedCondition.parameters);
    }
    constructor(options){
        this.options = options;
        this.objectRecordsPermissions = options.objectRecordsPermissions;
    }
};

//# sourceMappingURL=workspace-repository.js.map