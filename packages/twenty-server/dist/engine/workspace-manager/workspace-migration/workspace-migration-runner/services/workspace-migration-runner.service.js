"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceMigrationRunnerService", {
    enumerable: true,
    get: function() {
        return WorkspaceMigrationRunnerService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _loggerservice = require("../../../../core-modules/logger/logger.service");
const _workspacemigrationdurationmsbucketboundariesconstant = require("../../../../core-modules/metrics/constants/workspace-migration-duration-ms-bucket-boundaries.constant");
const _metricsservice = require("../../../../core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../core-modules/metrics/types/metrics-keys.type");
const _twentyconfigservice = require("../../../../core-modules/twenty-config/twenty-config.service");
const _workspacemanyorallflatentitymapscacheservice = require("../../../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _getflatentitymapsexceptioncontextutil = require("../../../../metadata-modules/flat-entity/utils/get-flat-entity-maps-exception-context.util");
const _getmetadataflatentitymapskeyutil = require("../../../../metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesforvalidationutil = require("../../../../metadata-modules/flat-entity/utils/get-metadata-related-metadata-names-for-validation.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _getmetadataserializedrelationnamesutil = require("../../../../metadata-modules/flat-entity/utils/get-metadata-serialized-relation-names.util");
const _withderivedfieldmetadatamapsutil = require("../../../../metadata-modules/flat-entity/utils/with-derived-field-metadata-maps.util");
const _createsearchfieldmetadatasbytsvectorfieldidaccessorutil = require("../../../../metadata-modules/flat-search-field-metadata/utils/create-search-field-metadatas-by-ts-vector-field-id-accessor.util");
const _workspacemetadataversionservice = require("../../../../metadata-modules/workspace-metadata-version/services/workspace-metadata-version.service");
const _workspacecacheservice = require("../../../../workspace-cache/services/workspace-cache.service");
const _workspacemigrationrunnerexception = require("../exceptions/workspace-migration-runner.exception");
const _workspacemigrationrunneractionhandlerregistryservice = require("../registry/workspace-migration-runner-action-handler-registry.service");
const _buildpreallocatedidbyuniversalidentifierfromactionsutil = require("../utils/build-preallocated-id-by-universal-identifier-from-actions.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let WorkspaceMigrationRunnerService = class WorkspaceMigrationRunnerService {
    getLegacyCacheInvalidation(allFlatEntityMapsKeys) {
        const flatMapsKeysSet = new Set(allFlatEntityMapsKeys);
        const legacyCacheKeyNames = [];
        const shouldIncrementMetadataGraphqlSchemaVersion = flatMapsKeysSet.has('flatObjectMetadataMaps') || flatMapsKeysSet.has('flatFieldMetadataMaps');
        if (shouldIncrementMetadataGraphqlSchemaVersion) {
            legacyCacheKeyNames.push('ORMEntityMetadatas', 'graphQLResolverNameMap');
        }
        const shouldInvalidateRoleMapCache = flatMapsKeysSet.has('flatRoleMaps') || flatMapsKeysSet.has('flatRoleTargetMaps');
        const shouldInvalidateRolesPermissionsCache = flatMapsKeysSet.has('flatObjectPermissionMaps') || flatMapsKeysSet.has('flatFieldPermissionMaps') || flatMapsKeysSet.has('flatRolePermissionFlagMaps');
        if (shouldInvalidateRoleMapCache || shouldInvalidateRolesPermissionsCache) {
            legacyCacheKeyNames.push('rolesPermissions', 'userWorkspaceRoleMap', 'flatRoleTargetMaps', 'apiKeyRoleMap', 'flatRoleTargetByAgentIdMaps');
        }
        if (flatMapsKeysSet.has('flatApplicationVariableMaps')) {
            legacyCacheKeyNames.push('applicationVariableMaps');
        }
        return {
            shouldIncrementMetadataGraphqlSchemaVersion,
            legacyCacheKeyNames
        };
    }
    async invalidateCache({ allFlatEntityMapsKeys, workspaceId }) {
        this.logger.perfTime('Runner', `Cache invalidation ${allFlatEntityMapsKeys.join()}`);
        const { shouldIncrementMetadataGraphqlSchemaVersion, legacyCacheKeyNames } = this.getLegacyCacheInvalidation(allFlatEntityMapsKeys);
        const cacheKeyNamesToInvalidate = [
            ...new Set([
                ...(0, _withderivedfieldmetadatamapsutil.withDerivedFieldMetadataMaps)(allFlatEntityMapsKeys),
                ...legacyCacheKeyNames
            ])
        ];
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, cacheKeyNamesToInvalidate);
        if (shouldIncrementMetadataGraphqlSchemaVersion) {
            await this.workspaceMetadataVersionService.incrementMetadataVersion(workspaceId);
        }
        this.logger.perfTimeEnd('Runner', `Cache invalidation ${allFlatEntityMapsKeys.join()}`);
    }
    recordRunPhaseMetric({ phase, status, value }) {
        this.metricsService.recordHistogram({
            key: _metricskeystype.MetricsKeys.WorkspaceMigrationRunPhaseDurationMs,
            value,
            unit: 'ms',
            attributes: {
                phase,
                status
            },
            bucketBoundaries: _workspacemigrationdurationmsbucketboundariesconstant.WORKSPACE_MIGRATION_DURATION_MS_BUCKET_BOUNDARIES
        });
    }
    async logBlockingDbActivity() {
        try {
            // Metadata only (no query text) to avoid logging literals from other sessions.
            const rows = await this.coreDataSource.query(`SELECT pid, state, wait_event_type, wait_event,
                now() - query_start AS running_for, pg_blocking_pids(pid) AS blocked_by
         FROM pg_stat_activity
         WHERE datname = current_database()
           AND state <> 'idle'
           AND pid <> pg_backend_pid()
         ORDER BY query_start ASC`);
            this.logger.error(`[install-perf] active DB sessions at failure: ${JSON.stringify(rows)}`, 'Runner');
        } catch (snapshotError) {
            this.logger.error(`[install-perf] could not snapshot pg_stat_activity: ${snapshotError instanceof Error ? snapshotError.message : String(snapshotError)}`, 'Runner');
        }
    }
    constructor(flatEntityMapsCacheService, coreDataSource, workspaceMigrationRunnerActionHandlerRegistry, workspaceMetadataVersionService, workspaceCacheService, metricsService, logger, twentyConfigService){
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.coreDataSource = coreDataSource;
        this.workspaceMigrationRunnerActionHandlerRegistry = workspaceMigrationRunnerActionHandlerRegistry;
        this.workspaceMetadataVersionService = workspaceMetadataVersionService;
        this.workspaceCacheService = workspaceCacheService;
        this.metricsService = metricsService;
        this.logger = logger;
        this.twentyConfigService = twentyConfigService;
        this.run = async (args)=>{
            const runStart = performance.now();
            try {
                const result = await this.executeRun(args);
                this.metricsService.recordHistogram({
                    key: _metricskeystype.MetricsKeys.WorkspaceMigrationRunDurationMs,
                    value: performance.now() - runStart,
                    unit: 'ms',
                    attributes: {
                        status: 'success'
                    },
                    bucketBoundaries: _workspacemigrationdurationmsbucketboundariesconstant.WORKSPACE_MIGRATION_DURATION_MS_BUCKET_BOUNDARIES
                });
                return result;
            } catch (error) {
                this.metricsService.recordHistogram({
                    key: _metricskeystype.MetricsKeys.WorkspaceMigrationRunDurationMs,
                    value: performance.now() - runStart,
                    unit: 'ms',
                    attributes: {
                        status: 'fail'
                    },
                    bucketBoundaries: _workspacemigrationdurationmsbucketboundariesconstant.WORKSPACE_MIGRATION_DURATION_MS_BUCKET_BOUNDARIES
                });
                throw error;
            }
        };
        this.executeRun = async ({ workspaceMigration: { actions, applicationUniversalIdentifier }, workspaceId })=>{
            if (this.twentyConfigService.get('WORKSPACE_SCHEMA_DDL_LOCKED')) {
                throw new _workspacemigrationrunnerexception.WorkspaceMigrationRunnerException({
                    message: 'Workspace schema DDL changes are locked. This is typically set during hot upgrades.',
                    code: _workspacemigrationrunnerexception.WorkspaceMigrationRunnerExceptionCode.DDL_LOCKED
                });
            }
            this.logger.perfTime('Runner', 'Total execution');
            this.logger.perfTime('Runner', 'Initial cache retrieval');
            const initialCacheRetrievalStart = performance.now();
            const queryRunner = this.coreDataSource.createQueryRunner();
            const actionMetadataNames = [
                ...new Set(actions.flatMap((action)=>action.metadataName))
            ];
            const hasSearchVectorRebuildAction = actions.some((action)=>action.metadataName === 'fieldMetadata' && action.type === 'update' && action.rebuildSearchVector === true);
            const searchVectorRebuildMetadataNames = hasSearchVectorRebuildAction ? [
                'index'
            ] : [];
            const actionsMetadataAndRelatedMetadataNames = [
                ...new Set([
                    ...actionMetadataNames,
                    ...actionMetadataNames.flatMap(_getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames),
                    ...actionMetadataNames.flatMap(_getmetadataserializedrelationnamesutil.getMetadataSerializedRelationNames),
                    ...actionMetadataNames.flatMap(_getmetadatarelatedmetadatanamesforvalidationutil.getMetadataRelatedMetadataNamesForValidation),
                    ...searchVectorRebuildMetadataNames
                ])
            ];
            const allFlatEntityMapsKeys = actionsMetadataAndRelatedMetadataNames.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey);
            let allFlatEntityMaps = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                workspaceId,
                flatMapsKeys: allFlatEntityMapsKeys
            });
            this.logger.perfTimeEnd('Runner', 'Initial cache retrieval');
            const initialCacheRetrievalMs = performance.now() - initialCacheRetrievalStart;
            this.recordRunPhaseMetric({
                phase: 'initial-cache-retrieval',
                status: 'success',
                value: initialCacheRetrievalMs
            });
            this.logger.perf(`[install-perf] Runner initial cache retrieval (getOrRecomputeManyOrAllFlatEntityMaps) took ${initialCacheRetrievalMs.toFixed(1)}ms for ${allFlatEntityMapsKeys.length} flat-maps keys`, 'Runner');
            const { flatApplicationMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
                'flatApplicationMaps'
            ]);
            const applicationId = flatApplicationMaps.idByUniversalIdentifier[applicationUniversalIdentifier];
            const flatApplication = (0, _utils.isDefined)(applicationId) ? flatApplicationMaps.byId[applicationId] : undefined;
            if (!(0, _utils.isDefined)(applicationId) || !(0, _utils.isDefined)(flatApplication)) {
                throw new _workspacemigrationrunnerexception.WorkspaceMigrationRunnerException({
                    message: `Could not find application for application with universal identifier: ${applicationUniversalIdentifier}`,
                    code: _workspacemigrationrunnerexception.WorkspaceMigrationRunnerExceptionCode.APPLICATION_NOT_FOUND
                });
            }
            const preallocatedIdByUniversalIdentifierByMetadataName = (0, _buildpreallocatedidbyuniversalidentifierfromactionsutil.buildPreallocatedIdByUniversalIdentifierFromActions)(actions);
            this.logger.perfTime('Runner', 'Transaction execution');
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const allMetadataEvents = [];
            const allAfterCommitSideEffects = [];
            const transactionStart = performance.now();
            let slowestActionMs = 0;
            let slowestActionLabel = 'n/a';
            let actionCount = 0;
            const searchFieldMetadatasByTsVectorFieldIdAccessor = (0, _createsearchfieldmetadatasbytsvectorfieldidaccessorutil.createSearchFieldMetadatasByTsVectorFieldIdAccessor)(()=>allFlatEntityMaps.flatSearchFieldMetadataMaps);
            try {
                await queryRunner.query(`SET LOCAL lock_timeout = '8s'`);
                for (const action of actions){
                    const actionStart = performance.now();
                    const { partialOptimisticCache, metadataEvents, afterCommitSideEffects } = await this.workspaceMigrationRunnerActionHandlerRegistry.executeActionHandler({
                        action,
                        context: {
                            flatApplication,
                            action,
                            allFlatEntityMaps,
                            queryRunner,
                            workspaceId,
                            preallocatedIdByUniversalIdentifierByMetadataName,
                            getSearchFieldMetadatasByTsVectorFieldId: searchFieldMetadatasByTsVectorFieldIdAccessor.get
                        }
                    });
                    const actionMs = performance.now() - actionStart;
                    actionCount += 1;
                    if (actionMs > slowestActionMs) {
                        slowestActionMs = actionMs;
                        slowestActionLabel = `${action.type}:${action.metadataName}`;
                    }
                    if (actionMs > 50) {
                        this.logger.perf(`[install-perf] slow action ${action.type}:${action.metadataName} took ${actionMs.toFixed(1)}ms`, 'Runner');
                    }
                    allFlatEntityMaps = {
                        ...allFlatEntityMaps,
                        ...partialOptimisticCache
                    };
                    if (action.metadataName === 'searchFieldMetadata') {
                        searchFieldMetadatasByTsVectorFieldIdAccessor.invalidate();
                    }
                    allMetadataEvents.push(...metadataEvents);
                    allAfterCommitSideEffects.push(...afterCommitSideEffects);
                }
                const commitStart = performance.now();
                await queryRunner.commitTransaction();
                const commitMs = performance.now() - commitStart;
                const transactionMs = performance.now() - transactionStart;
                this.recordRunPhaseMetric({
                    phase: 'action-execution',
                    status: 'success',
                    value: transactionMs - commitMs
                });
                this.recordRunPhaseMetric({
                    phase: 'commit',
                    status: 'success',
                    value: commitMs
                });
                this.logger.perf(`[install-perf] Runner transaction summary: ${actionCount} actions, total transaction ${transactionMs.toFixed(1)}ms (commit ${commitMs.toFixed(1)}ms), slowest action ${slowestActionLabel} ${slowestActionMs.toFixed(1)}ms`, 'Runner');
                this.logger.perfTimeEnd('Runner', 'Transaction execution');
            } catch (error) {
                this.recordRunPhaseMetric({
                    phase: 'action-execution',
                    status: 'fail',
                    value: performance.now() - transactionStart
                });
                this.logger.error(`[install-perf] migration failed after ${actionCount} action(s): ${error instanceof Error ? error.message : String(error)}`, 'Runner');
                await this.logBlockingDbActivity();
                if (queryRunner.isTransactionActive && !queryRunner.isReleased) {
                    await queryRunner.rollbackTransaction().catch((rollbackError)=>this.logger.error(`[install-perf] rollback failed: ${rollbackError.message}`, 'Runner'));
                } else {
                    this.logger.error(`[install-perf] skipping rollback (txnActive=${queryRunner.isTransactionActive} released=${queryRunner.isReleased})`, 'Runner');
                }
                const invertedActions = [
                    ...actions
                ].reverse();
                for (const invertedAction of invertedActions){
                    await this.workspaceMigrationRunnerActionHandlerRegistry.executeActionRollbackHandler({
                        action: invertedAction,
                        context: {
                            flatApplication,
                            action: invertedAction,
                            allFlatEntityMaps,
                            workspaceId
                        }
                    });
                }
                try {
                    await this.invalidateCache({
                        allFlatEntityMapsKeys,
                        workspaceId
                    });
                } catch (cacheError) {
                    this.logger.error(`Cache invalidation failed after rollback: ${cacheError}`, 'Runner');
                }
                if (error instanceof _workspacemigrationrunnerexception.WorkspaceMigrationRunnerException) {
                    throw error;
                }
                throw new _workspacemigrationrunnerexception.WorkspaceMigrationRunnerException({
                    message: error.message,
                    code: _workspacemigrationrunnerexception.WorkspaceMigrationRunnerExceptionCode.INTERNAL_SERVER_ERROR,
                    context: (0, _getflatentitymapsexceptioncontextutil.getFlatEntityMapsExceptionContext)(error)
                });
            } finally{
                await queryRunner.release();
            }
            const postCommitInvalidateStart = performance.now();
            try {
                await this.invalidateCache({
                    allFlatEntityMapsKeys,
                    workspaceId
                });
                this.recordRunPhaseMetric({
                    phase: 'cache-invalidation',
                    status: 'success',
                    value: performance.now() - postCommitInvalidateStart
                });
            } catch (cacheError) {
                this.recordRunPhaseMetric({
                    phase: 'cache-invalidation',
                    status: 'fail',
                    value: performance.now() - postCommitInvalidateStart
                });
                this.logger.error(`Cache invalidation failed after committed transaction: ${cacheError}`, 'Runner');
            }
            const postCommitInvalidateMs = performance.now() - postCommitInvalidateStart;
            this.logger.perf(`[install-perf] Runner post-commit invalidateCache took ${postCommitInvalidateMs.toFixed(1)}ms for ${allFlatEntityMapsKeys.length} flat-maps keys`, 'Runner');
            const sideEffectResults = await Promise.allSettled(allAfterCommitSideEffects.map((sideEffect)=>Promise.resolve().then(()=>sideEffect.run())));
            sideEffectResults.forEach((result, index)=>{
                if (result.status === 'rejected') {
                    this.logger.warn(`After-commit side effect failed (${allAfterCommitSideEffects[index].description}): ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`, 'Runner');
                }
            });
            const hasSchemaMetadataChanged = allFlatEntityMapsKeys.includes('flatObjectMetadataMaps') || allFlatEntityMapsKeys.includes('flatFieldMetadataMaps');
            this.logger.perfTimeEnd('Runner', 'Total execution');
            return {
                allFlatEntityMaps,
                metadataEvents: allMetadataEvents,
                hasSchemaMetadataChanged
            };
        };
    }
};
WorkspaceMigrationRunnerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _workspacemigrationrunneractionhandlerregistryservice.WorkspaceMigrationRunnerActionHandlerRegistryService === "undefined" ? Object : _workspacemigrationrunneractionhandlerregistryservice.WorkspaceMigrationRunnerActionHandlerRegistryService,
        typeof _workspacemetadataversionservice.WorkspaceMetadataVersionService === "undefined" ? Object : _workspacemetadataversionservice.WorkspaceMetadataVersionService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService,
        typeof _loggerservice.LoggerService === "undefined" ? Object : _loggerservice.LoggerService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], WorkspaceMigrationRunnerService);

//# sourceMappingURL=workspace-migration-runner.service.js.map