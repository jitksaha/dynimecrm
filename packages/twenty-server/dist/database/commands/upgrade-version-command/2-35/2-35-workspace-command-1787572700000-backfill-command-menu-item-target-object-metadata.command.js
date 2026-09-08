"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillCommandMenuItemTargetObjectMetadataCommand", {
    enumerable: true,
    get: function() {
        return BackfillCommandMenuItemTargetObjectMetadataCommand;
    }
});
const _nestcommander = require("nest-commander");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _computeobjectnavigationtargetbackfillutil = require("./utils/compute-object-navigation-target-backfill.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
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
let BackfillCommandMenuItemTargetObjectMetadataCommand = class BackfillCommandMenuItemTargetObjectMetadataCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatCommandMenuItemMaps, flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatCommandMenuItemMaps',
            'flatObjectMetadataMaps'
        ]);
        const { flatCommandMenuItemsToUpdate, flatCommandMenuItemsToDelete } = (0, _computeobjectnavigationtargetbackfillutil.computeObjectNavigationTargetBackfill)({
            flatCommandMenuItemMaps,
            flatObjectMetadataMaps,
            now: new Date().toISOString()
        });
        if (flatCommandMenuItemsToDelete.length > 0) {
            this.logger.warn(`${isDryRun ? '[DRY RUN] Would delete' : 'Deleting'} ${flatCommandMenuItemsToDelete.length} orphaned navigation command menu item(s) in workspace ${workspaceId}, their payload points at a missing object: ${flatCommandMenuItemsToDelete.map(({ id })=>id).join(', ')}`);
        }
        if (flatCommandMenuItemsToUpdate.length === 0 && flatCommandMenuItemsToDelete.length === 0) {
            this.logger.log(`Navigation command menu item targets already backfilled for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] Would backfill' : 'Backfilling'} ${flatCommandMenuItemsToUpdate.length} navigation command menu item target(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: flatCommandMenuItemsToDelete,
                    flatEntityToUpdate: flatCommandMenuItemsToUpdate
                }
            },
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to backfill navigation command menu item targets:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to backfill navigation command menu item targets for workspace ${workspaceId}`);
        }
        this.logger.log(`Successfully backfilled ${flatCommandMenuItemsToUpdate.length} and deleted ${flatCommandMenuItemsToDelete.length} navigation command menu item(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
BackfillCommandMenuItemTargetObjectMetadataCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.35.0', 1787572700000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-35:backfill-command-menu-item-target-object-metadata',
        description: 'Derive commandMenuItem.navigationTargetObjectMetadataId from the object navigation payload'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], BackfillCommandMenuItemTargetObjectMetadataCommand);

//# sourceMappingURL=2-35-workspace-command-1787572700000-backfill-command-menu-item-target-object-metadata.command.js.map