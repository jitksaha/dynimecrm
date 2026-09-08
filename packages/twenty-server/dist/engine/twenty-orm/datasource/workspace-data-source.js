"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceDataSource", {
    enumerable: true,
    get: function() {
        return WorkspaceDataSource;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _clientqueryexecutor = require("../executor/client-query-executor");
const _poolqueryexecutor = require("../executor/pool-query-executor");
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const _runinrollbacksafetransactionutil = require("./utils/run-in-rollback-safe-transaction.util");
const _workspacerepository = require("../repository/workspace-repository");
const _buildworkspacetableshapeutil = require("../table-shape/utils/build-workspace-table-shape.util");
const _resolveobjectrecordspermissionsutil = require("../utils/resolve-object-records-permissions.util");
const tableShapeCacheByFlatObjectMetadataMaps = new WeakMap();
let WorkspaceDataSource = class WorkspaceDataSource {
    getRepository(nameSingular, rolePermissionConfig, repositoryOptions) {
        return this.buildRepository({
            nameSingular,
            rolePermissionConfig,
            executor: new _poolqueryexecutor.PoolQueryExecutor({
                pool: this.pool
            }),
            shouldSkipEventEmission: repositoryOptions?.shouldSkipEventEmission ?? false
        });
    }
    async transaction(work) {
        const afterCommitCallbacks = [];
        const afterCommit = (callback)=>afterCommitCallbacks.push(callback);
        const transactionalInternalContext = {
            ...this.internalContext,
            eventEmitterService: {
                emitDatabaseBatchEvent: (event)=>afterCommit(()=>this.internalContext.eventEmitterService.emitDatabaseBatchEvent(event))
            }
        };
        const result = await this.runInClientTransaction((executor)=>work({
                getRepository: (nameSingular, rolePermissionConfig, repositoryOptions)=>this.buildRepository({
                        nameSingular,
                        rolePermissionConfig,
                        executor,
                        isTransactional: true,
                        shouldSkipEventEmission: repositoryOptions?.shouldSkipEventEmission ?? false,
                        internalContext: transactionalInternalContext
                    }),
                executeRawQuery: (sql, parameters = [])=>executor.execute({
                        text: sql,
                        values: parameters
                    }),
                afterCommit
            }));
        for (const callback of afterCommitCallbacks){
            try {
                await callback();
            } catch (error) {
                this.logger.error(`After-commit callback failed for workspace ${this.internalContext.workspaceId}`, error);
            }
        }
        return result;
    }
    async runInClientTransaction(work) {
        return (0, _runinrollbacksafetransactionutil.runInRollbackSafeTransaction)({
            pool: this.pool,
            work: (client)=>work(new _clientqueryexecutor.ClientQueryExecutor({
                    client
                }))
        });
    }
    buildRepository({ nameSingular, rolePermissionConfig, executor, isTransactional = false, shouldSkipEventEmission = false, internalContext = this.internalContext }) {
        const objectMetadataId = internalContext.objectIdByNameSingular[nameSingular];
        if (!(0, _utils.isDefined)(objectMetadataId)) {
            throw new _twentyormexception.TwentyOrmException(`Object "${nameSingular}" does not exist in this workspace`, _twentyormexception.TwentyOrmExceptionCode.UNKNOWN_OBJECT);
        }
        return this.buildRepositoryForObjectMetadataId({
            objectMetadataId,
            rolePermissionConfig,
            executor,
            isTransactional,
            shouldSkipEventEmission,
            internalContext
        });
    }
    buildRepositoryForObjectMetadataId({ objectMetadataId, rolePermissionConfig, executor, isTransactional = false, shouldSkipEventEmission = false, internalContext = this.internalContext }) {
        const flatObjectMetadata = this.getFlatObjectMetadataOrThrow(objectMetadataId);
        const { objectRecordsPermissions, shouldBypassPermissionChecks } = (0, _resolveobjectrecordspermissionsutil.resolveObjectRecordsPermissions)({
            rolePermissionConfig,
            objectPermissionsByRoleId: this.objectPermissionsByRoleId
        });
        return new _workspacerepository.WorkspaceRepository({
            tableShape: this.getTableShape(objectMetadataId),
            flatObjectMetadata,
            internalContext,
            authContext: this.authContext,
            executor,
            objectRecordsPermissions,
            shouldBypassPermissionChecks,
            shouldSkipEventEmission: shouldSkipEventEmission ?? false,
            tableShapeByObjectMetadataId: (targetObjectMetadataId)=>this.getTableShape(targetObjectMetadataId),
            flatObjectMetadataByObjectMetadataId: (targetObjectMetadataId)=>this.getFlatObjectMetadataOrThrow(targetObjectMetadataId),
            getRepositoryForObjectMetadataId: (targetObjectMetadataId)=>this.buildRepositoryForObjectMetadataId({
                    objectMetadataId: targetObjectMetadataId,
                    rolePermissionConfig,
                    executor,
                    isTransactional,
                    shouldSkipEventEmission,
                    internalContext
                }),
            isTransactional,
            runInNewTransaction: (work)=>this.transaction((transactionScope)=>work(transactionScope.getRepository(flatObjectMetadata.nameSingular, rolePermissionConfig, {
                        shouldSkipEventEmission
                    })))
        });
    }
    getTableShape(objectMetadataId) {
        const cacheKey = this.internalContext.flatObjectMetadataMaps;
        const cachedShapes = tableShapeCacheByFlatObjectMetadataMaps.get(cacheKey) ?? new Map();
        tableShapeCacheByFlatObjectMetadataMaps.set(cacheKey, cachedShapes);
        const cachedShape = cachedShapes.get(objectMetadataId);
        if ((0, _utils.isDefined)(cachedShape)) {
            return cachedShape;
        }
        const tableShape = (0, _buildworkspacetableshapeutil.buildWorkspaceTableShape)({
            workspaceId: this.internalContext.workspaceId,
            flatObjectMetadata: this.getFlatObjectMetadataOrThrow(objectMetadataId),
            flatFieldMetadataMaps: this.internalContext.flatFieldMetadataMaps
        });
        cachedShapes.set(objectMetadataId, tableShape);
        return tableShape;
    }
    getFlatObjectMetadataOrThrow(objectMetadataId) {
        return (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: objectMetadataId,
            flatEntityMaps: this.internalContext.flatObjectMetadataMaps
        });
    }
    constructor({ pool, internalContext, authContext, objectPermissionsByRoleId }){
        this.logger = new _common.Logger(WorkspaceDataSource.name);
        this.pool = pool;
        this.internalContext = internalContext;
        this.authContext = authContext;
        this.objectPermissionsByRoleId = objectPermissionsByRoleId;
    }
};

//# sourceMappingURL=workspace-data-source.js.map