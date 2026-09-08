"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReconcileSearchFieldMetadataCommand", {
    enumerable: true,
    get: function() {
        return ReconcileSearchFieldMetadataCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildsearchfieldmetadatabackfilloperationsutil = require("./utils/build-search-field-metadata-backfill-operations.util");
const _buildsearchfieldmetadatareownoperationsutil = require("./utils/build-search-field-metadata-re-own-operations.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _getmetadataserializedrelationnamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-serialized-relation-names.util");
const _searchfieldmetadataentity = require("../../../../engine/metadata-modules/search-field-metadata/search-field-metadata.entity");
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
let ReconcileSearchFieldMetadataCommand = class ReconcileSearchFieldMetadataCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { searchFieldMetadataUniversalIdentifierUpdates, flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier } = await this.computeOperations({
            workspaceId
        });
        const totalRowsToBackfill = Object.values(flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier).reduce((total, flatSearchFieldMetadatas)=>total + flatSearchFieldMetadatas.length, 0);
        if (searchFieldMetadataUniversalIdentifierUpdates.length === 0 && totalRowsToBackfill === 0) {
            this.logger.log(`No searchFieldMetadata to reconcile for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Reconciling ${searchFieldMetadataUniversalIdentifierUpdates.length} searchFieldMetadata universal identifier(s) and creating ${totalRowsToBackfill} missing row(s) across ${Object.keys(flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier).length} application(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        await this.applyOperations({
            workspaceId,
            searchFieldMetadataUniversalIdentifierUpdates,
            flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier
        });
        this.logger.log(`Reconciled searchFieldMetadata for workspace ${workspaceId}`);
    }
    async computeOperations({ workspaceId }) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatSearchFieldMetadataMaps, flatApplicationMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatSearchFieldMetadataMaps',
            'flatApplicationMaps'
        ]);
        const { twentyStandardFlatApplication, workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const applicationUniversalIdentifierById = new Map(Object.values(flatApplicationMaps.byId).filter(_utils.isDefined).map((flatApplication)=>[
                flatApplication.id,
                flatApplication.universalIdentifier
            ]));
        const searchFieldMetadataUniversalIdentifierUpdates = (0, _buildsearchfieldmetadatareownoperationsutil.buildSearchFieldMetadataReOwnOperations)({
            flatFieldMetadataMaps,
            flatSearchFieldMetadataMaps,
            applicationUniversalIdentifierById
        });
        const flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier = (0, _buildsearchfieldmetadatabackfilloperationsutil.buildSearchFieldMetadataBackfillOperations)({
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            flatSearchFieldMetadataMaps,
            applicationUniversalIdentifierById,
            twentyStandardApplicationId: twentyStandardFlatApplication.id,
            workspaceCustomApplicationId: workspaceCustomFlatApplication.id
        });
        return {
            searchFieldMetadataUniversalIdentifierUpdates,
            flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier
        };
    }
    async applyOperations({ workspaceId, searchFieldMetadataUniversalIdentifierUpdates, flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier }) {
        // Re-own before backfill: a deterministic row created next to a surviving legacy v4
        // row (which the deletion-inference short-circuit keeps alive) would collide on the
        // unique universal identifier constraint.
        await this.applyReOwn({
            workspaceId,
            searchFieldMetadataUniversalIdentifierUpdates
        });
        await this.applyBackfill({
            workspaceId,
            flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier
        });
    }
    async applyReOwn({ workspaceId, searchFieldMetadataUniversalIdentifierUpdates }) {
        if (searchFieldMetadataUniversalIdentifierUpdates.length === 0) {
            return;
        }
        try {
            await this.searchFieldMetadataRepository.manager.transaction(async (entityManager)=>{
                const transactionalSearchFieldMetadataRepository = entityManager.getRepository(_searchfieldmetadataentity.SearchFieldMetadataEntity);
                for (const { id, deterministicUniversalIdentifier } of searchFieldMetadataUniversalIdentifierUpdates){
                    await transactionalSearchFieldMetadataRepository.update({
                        id,
                        workspaceId
                    }, {
                        universalIdentifier: deterministicUniversalIdentifier
                    });
                }
            });
        } catch (error) {
            // Abort before backfill: creating a deterministic row next to a surviving legacy
            // row (re-own rolled back) would collide on the unique universal identifier
            // constraint.
            this.logger.error(`Failed to re-own ${searchFieldMetadataUniversalIdentifierUpdates.length} searchFieldMetadata universal identifier(s) for workspace ${workspaceId}, aborting: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
        await this.flushSearchFieldMetadataCacheAndBumpMetadataVersion(workspaceId);
    }
    async applyBackfill({ workspaceId, flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier }) {
        for (const [applicationUniversalIdentifier, flatSearchFieldMetadatasToCreate] of Object.entries(flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier)){
            if (flatSearchFieldMetadatasToCreate.length === 0) {
                continue;
            }
            const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
                isSystemBuild: true,
                allFlatEntityOperationByMetadataName: {
                    searchFieldMetadata: {
                        flatEntityToCreate: flatSearchFieldMetadatasToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    }
                },
                workspaceId,
                applicationUniversalIdentifier
            });
            if (validateAndBuildResult.status === 'fail') {
                this.logger.error(`Failed to create searchFieldMetadata row(s) for application ${applicationUniversalIdentifier}:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
                throw new Error(`Failed to create searchFieldMetadata row(s) for workspace ${workspaceId}`);
            }
        }
    }
    async flushSearchFieldMetadataCacheAndBumpMetadataVersion(workspaceId) {
        const searchFieldMetadataRelatedMetadataNames = [
            'searchFieldMetadata',
            ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('searchFieldMetadata'),
            ...(0, _getmetadataserializedrelationnamesutil.getMetadataSerializedRelationNames)('searchFieldMetadata')
        ];
        const cacheKeysToFlush = [
            ...new Set(searchFieldMetadataRelatedMetadataNames.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey))
        ];
        await this.workspaceCacheService.flush(workspaceId, cacheKeysToFlush);
        await this.workspaceMetadataVersionService.incrementMetadataVersion(workspaceId);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMetadataVersionService, workspaceMigrationValidateBuildAndRunService, // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    searchFieldMetadataRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMetadataVersionService = workspaceMetadataVersionService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService, this.searchFieldMetadataRepository = searchFieldMetadataRepository;
    }
};
ReconcileSearchFieldMetadataCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.20.0', 1783529458170),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-20:reconcile-search-field-metadata',
        description: 'Converge every searchFieldMetadata universal identifier to its deterministic derivation (re-own, all applications) and create the missing searchFieldMetadata row for installed-app searchable objects (backfill). Idempotent, re-own runs before backfill to avoid a unique-identifier collision.'
    }),
    _ts_param(5, (0, _typeorm.InjectRepository)(_searchfieldmetadataentity.SearchFieldMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemetadataversionservice.WorkspaceMetadataVersionService === "undefined" ? Object : _workspacemetadataversionservice.WorkspaceMetadataVersionService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ReconcileSearchFieldMetadataCommand);

//# sourceMappingURL=2-20-workspace-command-1783529458170-reconcile-search-field-metadata.command.js.map