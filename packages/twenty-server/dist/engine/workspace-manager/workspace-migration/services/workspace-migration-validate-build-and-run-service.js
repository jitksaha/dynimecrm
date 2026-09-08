"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceMigrationValidateBuildAndRunService", {
    enumerable: true,
    get: function() {
        return WorkspaceMigrationValidateBuildAndRunService;
    }
});
const _common = require("@nestjs/common");
const _metadata = require("twenty-shared/metadata");
const _loggerservice = require("../../../core-modules/logger/logger.service");
const _workspacemigrationactioncountbucketboundariesconstant = require("../../../core-modules/metrics/constants/workspace-migration-action-count-bucket-boundaries.constant");
const _workspacemigrationdurationmsbucketboundariesconstant = require("../../../core-modules/metrics/constants/workspace-migration-duration-ms-bucket-boundaries.constant");
const _metricsservice = require("../../../core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../core-modules/metrics/types/metrics-keys.type");
const _twentyconfigservice = require("../../../core-modules/twenty-config/twenty-config.service");
const _getflatentitymapsexceptioncontextutil = require("../../../metadata-modules/flat-entity/utils/get-flat-entity-maps-exception-context.util");
const _transpileflatentityoperationarraytorecordutil = require("../../../metadata-modules/flat-entity/utils/transpile-flat-entity-operation-array-to-record.util");
const _metadatasideeffectengineservice = require("../../../metadata-modules/metadata-side-effect/services/metadata-side-effect-engine.service");
const _metadataeventemitter = require("../../../subscriptions/metadata-event/metadata-event-emitter");
const _workspacemigrationexception = require("../../workspace-migration.exception");
const _enrichcreateworkspacemigrationactionwithidsutil = require("./utils/enrich-create-workspace-migration-action-with-ids.util");
const _workspacemigrationbuildorchestratorservice = require("./workspace-migration-build-orchestrator.service");
const _workspacemigrationflatentitymapsservice = require("./workspace-migration-flat-entity-maps.service");
const _workspacemigrationrunnerservice = require("../workspace-migration-runner/services/workspace-migration-runner.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkspaceMigrationValidateBuildAndRunService = class WorkspaceMigrationValidateBuildAndRunService {
    async validateBuildAndRunWorkspaceMigrationFromTo(args) {
        const { idByUniversalIdentifierByMetadataName, dryRun, ...buildArgs } = args;
        const buildStart = performance.now();
        const validateAndBuildResult = await this.workspaceMigrationBuildOrchestratorService.buildWorkspaceMigration(buildArgs).catch((error)=>{
            this.metricsService.recordHistogram({
                key: _metricskeystype.MetricsKeys.WorkspaceMigrationBuildDurationMs,
                value: performance.now() - buildStart,
                unit: 'ms',
                attributes: {
                    status: 'error'
                },
                bucketBoundaries: _workspacemigrationdurationmsbucketboundariesconstant.WORKSPACE_MIGRATION_DURATION_MS_BUCKET_BOUNDARIES
            });
            this.logger.error(error, WorkspaceMigrationValidateBuildAndRunService.name);
            throw new _workspacemigrationexception.WorkspaceMigrationV2Exception(error.message, _metadata.WorkspaceMigrationV2ExceptionCode.BUILDER_INTERNAL_SERVER_ERROR, {
                context: (0, _getflatentitymapsexceptioncontextutil.getFlatEntityMapsExceptionContext)(error)
            });
        });
        const buildMs = performance.now() - buildStart;
        this.metricsService.recordHistogram({
            key: _metricskeystype.MetricsKeys.WorkspaceMigrationBuildDurationMs,
            value: buildMs,
            unit: 'ms',
            attributes: {
                status: validateAndBuildResult.status
            },
            bucketBoundaries: _workspacemigrationdurationmsbucketboundariesconstant.WORKSPACE_MIGRATION_DURATION_MS_BUCKET_BOUNDARIES
        });
        this.logger.perf(`[install-perf] buildWorkspaceMigration took ${buildMs.toFixed(1)}ms (status=${validateAndBuildResult.status})`, WorkspaceMigrationValidateBuildAndRunService.name);
        if (validateAndBuildResult.status === 'fail') {
            if (this.isDebugEnabled) {
                this.logger.debug?.(JSON.stringify(validateAndBuildResult, null, 2), WorkspaceMigrationValidateBuildAndRunService.name);
            }
            return validateAndBuildResult;
        }
        const workspaceMigration = (0, _enrichcreateworkspacemigrationactionwithidsutil.enrichCreateWorkspaceMigrationActionsWithIds)({
            idByUniversalIdentifierByMetadataName: idByUniversalIdentifierByMetadataName ?? {},
            workspaceMigration: validateAndBuildResult.workspaceMigration
        });
        if (dryRun === true || workspaceMigration.actions.length === 0) {
            return {
                status: 'success',
                workspaceMigration,
                hasSchemaMetadataChanged: false
            };
        }
        const actionCountsByTypeAndMetadataName = {};
        for (const action of workspaceMigration.actions){
            const key = `${action.type}:${action.metadataName}`;
            actionCountsByTypeAndMetadataName[key] = (actionCountsByTypeAndMetadataName[key] ?? 0) + 1;
        }
        this.logger.perf(`[install-perf] validateBuildAndRunWorkspaceMigrationFromTo running ${workspaceMigration.actions.length} actions: ${JSON.stringify(actionCountsByTypeAndMetadataName)}`, WorkspaceMigrationValidateBuildAndRunService.name);
        this.metricsService.recordHistogram({
            key: _metricskeystype.MetricsKeys.WorkspaceMigrationActionCount,
            value: workspaceMigration.actions.length,
            bucketBoundaries: _workspacemigrationactioncountbucketboundariesconstant.WORKSPACE_MIGRATION_ACTION_COUNT_BUCKET_BOUNDARIES
        });
        const runStart = performance.now();
        const { hasSchemaMetadataChanged, metadataEvents } = await this.workspaceMigrationRunnerService.run({
            workspaceId: args.workspaceId,
            workspaceMigration
        });
        const runMs = performance.now() - runStart;
        this.logger.perf(`[install-perf] workspaceMigrationRunnerService.run took ${runMs.toFixed(1)}ms for ${workspaceMigration.actions.length} actions`, WorkspaceMigrationValidateBuildAndRunService.name);
        this.metadataEventEmitter.emitMetadataEvents({
            metadataEvents: metadataEvents,
            workspaceId: args.workspaceId
        });
        return {
            status: 'success',
            workspaceMigration,
            hasSchemaMetadataChanged
        };
    }
    async validateBuildAndRunWorkspaceMigration({ allFlatEntityOperationByMetadataName, workspaceId, isSystemBuild = false, applicationUniversalIdentifier, dryRun }) {
        return await this.validateBuildAndRunWorkspaceMigrationFromRecord({
            allFlatEntityOperationRecordByMetadataName: (0, _transpileflatentityoperationarraytorecordutil.transpileFlatEntityOperationArrayToRecord)(allFlatEntityOperationByMetadataName),
            workspaceId,
            isSystemBuild,
            applicationUniversalIdentifier,
            dryRun
        });
    }
    async validateBuildAndRunWorkspaceMigrationFromRecord(args) {
        return await this.validateBuildAndRunWorkspaceMigrationFromRecordInternal({
            ...args,
            skipSideEffectExpandEngine: false
        });
    }
    /**
   * @deprecated Legacy path for upgrade commands authored before the metadata
   * side-effect engine landed in v2.19. These commands declare their operation
   * matrix literally and must not flow through expandWithSideEffects, which
   * would inject engine-owned companions and collide on reserved identifiers.
   * See packages/twenty-server/docs/UPGRADE_COMMANDS.md.
   */ async validateBuildAndRunLegacyWorkspaceMigration({ allFlatEntityOperationByMetadataName, workspaceId, isSystemBuild = false, applicationUniversalIdentifier, dryRun }) {
        return await this.validateBuildAndRunWorkspaceMigrationFromRecordInternal({
            allFlatEntityOperationRecordByMetadataName: (0, _transpileflatentityoperationarraytorecordutil.transpileFlatEntityOperationArrayToRecord)(allFlatEntityOperationByMetadataName),
            workspaceId,
            isSystemBuild,
            applicationUniversalIdentifier,
            dryRun,
            skipSideEffectExpandEngine: true
        });
    }
    async validateBuildAndRunWorkspaceMigrationFromRecordInternal({ allFlatEntityOperationRecordByMetadataName, workspaceId, isSystemBuild = false, applicationUniversalIdentifier, dryRun, skipSideEffectExpandEngine }) {
        const callerMetadataNames = Object.keys(allFlatEntityOperationRecordByMetadataName);
        const { flatApplicationMaps, allRelatedFlatEntityMaps, allMetadataNameCacheToCompute } = await this.workspaceMigrationFlatEntityMapsService.getOrRecomputeAllRelatedFlatEntityMaps({
            workspaceId,
            callerMetadataNames
        });
        let resolvedFlatEntityOperationRecordByMetadataName = allFlatEntityOperationRecordByMetadataName;
        if (!skipSideEffectExpandEngine) {
            const sideEffectExpansionResult = this.metadataSideEffectEngineService.expandWithSideEffects({
                allFlatEntityOperationRecordByMetadataName,
                sideEffectRelatedFlatEntityMaps: allRelatedFlatEntityMaps,
                context: {
                    buildOptions: {
                        isSystemBuild,
                        applicationUniversalIdentifier
                    }
                }
            });
            if (sideEffectExpansionResult.status === 'fail') {
                return sideEffectExpansionResult;
            }
            resolvedFlatEntityOperationRecordByMetadataName = sideEffectExpansionResult.allFlatEntityOperationRecordByMetadataName;
        }
        return await this.computeAndRunWorkspaceMigrationFromResolvedOperations({
            allFlatEntityOperationRecordByMetadataName: resolvedFlatEntityOperationRecordByMetadataName,
            workspaceId,
            isSystemBuild,
            applicationUniversalIdentifier,
            dryRun,
            flatApplicationMaps,
            allRelatedFlatEntityMaps,
            allMetadataNameCacheToCompute
        });
    }
    async computeAndRunWorkspaceMigrationFromResolvedOperations({ allFlatEntityOperationRecordByMetadataName, workspaceId, isSystemBuild, applicationUniversalIdentifier, dryRun, flatApplicationMaps, allRelatedFlatEntityMaps, allMetadataNameCacheToCompute }) {
        const { fromToAllFlatEntityMaps, inferDeletionFromMissingEntities, dependencyAllFlatEntityMaps, additionalCacheDataMaps, idByUniversalIdentifierByMetadataName } = this.workspaceMigrationFlatEntityMapsService.computeFromToAllFlatEntityMapsAndBuildOptions({
            allFlatEntityOperationRecordByMetadataName,
            applicationUniversalIdentifier,
            flatApplicationMaps,
            allRelatedFlatEntityMaps,
            allMetadataNameCacheToCompute
        });
        return await this.validateBuildAndRunWorkspaceMigrationFromTo({
            buildOptions: {
                isSystemBuild,
                inferDeletionFromMissingEntities,
                applicationUniversalIdentifier
            },
            fromToAllFlatEntityMaps,
            workspaceId,
            dependencyAllFlatEntityMaps,
            additionalCacheDataMaps,
            idByUniversalIdentifierByMetadataName,
            dryRun
        });
    }
    constructor(workspaceMigrationRunnerService, workspaceMigrationBuildOrchestratorService, workspaceMigrationFlatEntityMapsService, metadataEventEmitter, metadataSideEffectEngineService, metricsService, logger, twentyConfigService){
        this.workspaceMigrationRunnerService = workspaceMigrationRunnerService;
        this.workspaceMigrationBuildOrchestratorService = workspaceMigrationBuildOrchestratorService;
        this.workspaceMigrationFlatEntityMapsService = workspaceMigrationFlatEntityMapsService;
        this.metadataEventEmitter = metadataEventEmitter;
        this.metadataSideEffectEngineService = metadataSideEffectEngineService;
        this.metricsService = metricsService;
        this.logger = logger;
        const logLevels = twentyConfigService.get('LOG_LEVELS');
        this.isDebugEnabled = logLevels.includes('debug');
    }
};
WorkspaceMigrationValidateBuildAndRunService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService,
        typeof _workspacemigrationbuildorchestratorservice.WorkspaceMigrationBuildOrchestratorService === "undefined" ? Object : _workspacemigrationbuildorchestratorservice.WorkspaceMigrationBuildOrchestratorService,
        typeof _workspacemigrationflatentitymapsservice.WorkspaceMigrationFlatEntityMapsService === "undefined" ? Object : _workspacemigrationflatentitymapsservice.WorkspaceMigrationFlatEntityMapsService,
        typeof _metadataeventemitter.MetadataEventEmitter === "undefined" ? Object : _metadataeventemitter.MetadataEventEmitter,
        typeof _metadatasideeffectengineservice.MetadataSideEffectEngineService === "undefined" ? Object : _metadatasideeffectengineservice.MetadataSideEffectEngineService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService,
        typeof _loggerservice.LoggerService === "undefined" ? Object : _loggerservice.LoggerService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], WorkspaceMigrationValidateBuildAndRunService);

//# sourceMappingURL=workspace-migration-validate-build-and-run-service.js.map