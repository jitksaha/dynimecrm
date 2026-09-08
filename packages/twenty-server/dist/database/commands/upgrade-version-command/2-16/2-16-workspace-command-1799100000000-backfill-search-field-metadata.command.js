"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillSearchFieldMetadataCommand", {
    enumerable: true,
    get: function() {
        return BackfillSearchFieldMetadataCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildsearchfieldmetadatabackfilloperationsutil = require("./utils/build-search-field-metadata-backfill-operations.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
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
let BackfillSearchFieldMetadataCommand = class BackfillSearchFieldMetadataCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        // The migration runner only invalidates the flat-maps keys a migration touched,
        // so during a cross-version upgrade earlier commands can leave these maps stale.
        // The existing-rows dedupe below compares (objectMetadataId, fieldMetadataId)
        // pairs across maps: candidate ids resolved from a stale object/field map won't
        // match the fresh search map's ids, so already-created rows are re-emitted and
        // the runner (which re-resolves universal identifiers against fresh maps) trips
        // IDX_SEARCH_FIELD_METADATA_OBJECT_FIELD_UNIQUE. Recompute every map the dedupe
        // depends on from the database before deriving the create-set.
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatSearchFieldMetadataMaps'
        ]);
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatSearchFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatSearchFieldMetadataMaps'
        ]);
        const { twentyStandardFlatApplication, workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        // The standard-application sync does not run during upgrades, so standard objects'
        // rows are backfilled from the same definition provisioning uses
        // (SEARCH_FIELDS_FOR_*), not by parsing the searchVector asExpression.
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const { flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier } = (0, _buildsearchfieldmetadatabackfilloperationsutil.buildSearchFieldMetadataBackfillOperations)({
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            flatSearchFieldMetadataMaps,
            standardFlatSearchFieldMetadataMaps: standardAllFlatEntityMaps.flatSearchFieldMetadataMaps,
            customApplicationId: workspaceCustomFlatApplication.id
        });
        const applicationUniversalIdentifiers = Object.keys(flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier);
        const totalRowsToCreate = applicationUniversalIdentifiers.reduce((total, applicationUniversalIdentifier)=>total + (flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier[applicationUniversalIdentifier]?.length ?? 0), 0);
        if (totalRowsToCreate === 0) {
            this.logger.log(`No missing searchFieldMetadata rows for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Found ${totalRowsToCreate} missing searchFieldMetadata row(s) for workspace ${workspaceId} across ${applicationUniversalIdentifiers.length} application(s)`);
        if (isDryRun) {
            return;
        }
        // One migration per application: the runner assigns applicationId from the single
        // application passed here, keeping custom-object rows tied to the custom application.
        for (const applicationUniversalIdentifier of applicationUniversalIdentifiers){
            const flatSearchFieldMetadataToCreate = flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier[applicationUniversalIdentifier];
            if (!(0, _utils.isDefined)(flatSearchFieldMetadataToCreate) || flatSearchFieldMetadataToCreate.length === 0) {
                continue;
            }
            const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
                isSystemBuild: true,
                allFlatEntityOperationByMetadataName: {
                    searchFieldMetadata: {
                        flatEntityToCreate: flatSearchFieldMetadataToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    }
                },
                workspaceId,
                applicationUniversalIdentifier
            });
            if (validateAndBuildResult.status === 'fail') {
                this.logger.error(`Failed to persist searchFieldMetadata rows for application ${applicationUniversalIdentifier}:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
                throw new Error(`Failed to persist searchFieldMetadata rows for workspace ${workspaceId}`);
            }
        }
        this.logger.log(`Successfully backfilled ${totalRowsToCreate} searchFieldMetadata row(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceMigrationValidateBuildAndRunService, workspaceCacheService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService, this.workspaceCacheService = workspaceCacheService;
    }
};
BackfillSearchFieldMetadataCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.16.0', 1799100000000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-16:backfill-search-field-metadata',
        description: 'Backfill searchFieldMetadata rows for every object whose searchVector indexes a meaningful field (not only the globally searchable ones). Standard objects mirror their SEARCH_FIELDS_FOR_* set; custom objects get their label-identifier field. Idempotent: existing rows are skipped.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], BackfillSearchFieldMetadataCommand);

//# sourceMappingURL=2-16-workspace-command-1799100000000-backfill-search-field-metadata.command.js.map