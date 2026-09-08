"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReconcileSearchVectorGinIndexUniversalIdentifierCommand", {
    enumerable: true,
    get: function() {
        return ReconcileSearchVectorGinIndexUniversalIdentifierCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildsearchvectorginindexbackfilloperationsutil = require("./utils/build-search-vector-gin-index-backfill-operations.util");
const _buildsearchvectorginindexreownoperationsutil = require("./utils/build-search-vector-gin-index-re-own-operations.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _getmetadataserializedrelationnamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-serialized-relation-names.util");
const _indexmetadataentity = require("../../../../engine/metadata-modules/index-metadata/index-metadata.entity");
const _workspacemetadataversionservice = require("../../../../engine/metadata-modules/workspace-metadata-version/services/workspace-metadata-version.service");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
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
let ReconcileSearchVectorGinIndexUniversalIdentifierCommand = class ReconcileSearchVectorGinIndexUniversalIdentifierCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { indexUniversalIdentifierUpdates, flatIndexesToCreateByApplicationUniversalIdentifier } = await this.computeOperations({
            workspaceId
        });
        const totalIndexesToBackfill = Object.values(flatIndexesToCreateByApplicationUniversalIdentifier).reduce((total, flatIndexes)=>total + flatIndexes.length, 0);
        if (indexUniversalIdentifierUpdates.length === 0 && totalIndexesToBackfill === 0) {
            this.logger.log(`No searchVector GIN index to reconcile for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Reconciling ${indexUniversalIdentifierUpdates.length} searchVector GIN index universal identifier(s) and creating ${totalIndexesToBackfill} missing index(es) across ${Object.keys(flatIndexesToCreateByApplicationUniversalIdentifier).length} application(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        await this.applyOperations({
            workspaceId,
            indexUniversalIdentifierUpdates,
            flatIndexesToCreateByApplicationUniversalIdentifier
        });
        this.logger.log(`Reconciled searchVector GIN indexes for workspace ${workspaceId}`);
    }
    async computeOperations({ workspaceId }) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps, flatApplicationMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatIndexMaps',
            'flatApplicationMaps'
        ]);
        const { twentyStandardFlatApplication, workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const applicationUniversalIdentifierById = new Map(Object.values(flatApplicationMaps.byId).filter(_utils.isDefined).map((flatApplication)=>[
                flatApplication.id,
                flatApplication.universalIdentifier
            ]));
        const indexUniversalIdentifierUpdates = (0, _buildsearchvectorginindexreownoperationsutil.buildSearchVectorGinIndexReOwnOperations)({
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            flatIndexMaps,
            applicationUniversalIdentifierById
        });
        const flatIndexesToCreateByApplicationUniversalIdentifier = (0, _buildsearchvectorginindexbackfilloperationsutil.buildSearchVectorGinIndexBackfillOperations)({
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            flatIndexMaps,
            twentyStandardApplicationId: twentyStandardFlatApplication.id,
            workspaceCustomApplicationId: workspaceCustomFlatApplication.id
        });
        return {
            indexUniversalIdentifierUpdates,
            flatIndexesToCreateByApplicationUniversalIdentifier
        };
    }
    async applyOperations({ workspaceId, indexUniversalIdentifierUpdates, flatIndexesToCreateByApplicationUniversalIdentifier }) {
        // Re-own before backfill: a deterministic index created next to a surviving legacy
        // row would collide on the unique universal identifier constraint.
        await this.applyReOwn({
            workspaceId,
            indexUniversalIdentifierUpdates
        });
        await this.applyBackfill({
            workspaceId,
            flatIndexesToCreateByApplicationUniversalIdentifier
        });
    }
    async applyReOwn({ workspaceId, indexUniversalIdentifierUpdates }) {
        if (indexUniversalIdentifierUpdates.length === 0) {
            return;
        }
        try {
            await this.indexMetadataRepository.manager.transaction(async (entityManager)=>{
                const transactionalIndexMetadataRepository = entityManager.getRepository(_indexmetadataentity.IndexMetadataEntity);
                for (const { id, deterministicUniversalIdentifier } of indexUniversalIdentifierUpdates){
                    await transactionalIndexMetadataRepository.update({
                        id,
                        workspaceId
                    }, {
                        universalIdentifier: deterministicUniversalIdentifier
                    });
                }
            });
        } catch (error) {
            // Abort before backfill: creating a deterministic index next to a surviving legacy
            // row (re-own rolled back) would collide on the unique universal identifier
            // constraint.
            this.logger.error(`Failed to re-own ${indexUniversalIdentifierUpdates.length} searchVector GIN index universal identifier(s) for workspace ${workspaceId}, aborting: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
        await this.flushIndexCacheAndBumpMetadataVersion(workspaceId);
    }
    async applyBackfill({ workspaceId, flatIndexesToCreateByApplicationUniversalIdentifier }) {
        for (const [applicationUniversalIdentifier, flatIndexesToCreate] of Object.entries(flatIndexesToCreateByApplicationUniversalIdentifier)){
            if (flatIndexesToCreate.length === 0) {
                continue;
            }
            const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
                isSystemBuild: true,
                allFlatEntityOperationByMetadataName: {
                    index: {
                        flatEntityToCreate: flatIndexesToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    }
                },
                workspaceId,
                applicationUniversalIdentifier
            });
            if (validateAndBuildResult.status === 'fail') {
                this.logger.error(`Failed to create searchVector GIN index(es) for application ${applicationUniversalIdentifier}:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
                throw new Error(`Failed to create searchVector GIN index(es) for workspace ${workspaceId}`);
            }
        }
    }
    async flushIndexCacheAndBumpMetadataVersion(workspaceId) {
        const indexRelatedMetadataNames = [
            'index',
            ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('index'),
            ...(0, _getmetadataserializedrelationnamesutil.getMetadataSerializedRelationNames)('index')
        ];
        const cacheKeysToFlush = [
            ...new Set(indexRelatedMetadataNames.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey))
        ];
        await this.workspaceCacheService.flush(workspaceId, cacheKeysToFlush);
        await this.workspaceMetadataVersionService.incrementMetadataVersion(workspaceId);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMetadataVersionService, workspaceMigrationValidateBuildAndRunService, // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    indexMetadataRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMetadataVersionService = workspaceMetadataVersionService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService, this.indexMetadataRepository = indexMetadataRepository;
    }
};
ReconcileSearchVectorGinIndexUniversalIdentifierCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.20.0', 1783529458169),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-20:reconcile-search-vector-gin-index-universal-identifier',
        description: 'Converge every searchVector GIN index universal identifier to its deterministic derivation (re-own, all applications) and create the missing GIN index for installed-app objects (backfill). Idempotent, re-own runs before backfill.'
    }),
    _ts_param(5, (0, _typeorm.InjectRepository)(_indexmetadataentity.IndexMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemetadataversionservice.WorkspaceMetadataVersionService === "undefined" ? Object : _workspacemetadataversionservice.WorkspaceMetadataVersionService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ReconcileSearchVectorGinIndexUniversalIdentifierCommand);

//# sourceMappingURL=2-20-workspace-command-1783529458169-reconcile-search-vector-gin-index-universal-identifier.command.js.map