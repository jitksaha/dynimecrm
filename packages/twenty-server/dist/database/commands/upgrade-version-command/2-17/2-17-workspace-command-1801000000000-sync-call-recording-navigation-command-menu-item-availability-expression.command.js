"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SyncCallRecordingNavigationCommandMenuItemAvailabilityExpressionCommand", {
    enumerable: true,
    get: function() {
        return SyncCallRecordingNavigationCommandMenuItemAvailabilityExpressionCommand;
    }
});
const _nestcommander = require("nest-commander");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil = require("./utils/build-call-recording-navigation-command-menu-item-availability-expression-sync-operations.util");
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
let SyncCallRecordingNavigationCommandMenuItemAvailabilityExpressionCommand = class SyncCallRecordingNavigationCommandMenuItemAvailabilityExpressionCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatCommandMenuItemMaps, flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatCommandMenuItemMaps',
            'flatObjectMetadataMaps'
        ]);
        const commandMenuItemOperations = (0, _buildcallrecordingnavigationcommandmenuitemavailabilityexpressionsyncoperationsutil.buildCallRecordingNavigationCommandMenuItemAvailabilityExpressionSyncOperations)({
            existingFlatCommandMenuItemMaps: flatCommandMenuItemMaps,
            existingFlatObjectMetadataMaps: flatObjectMetadataMaps,
            now: new Date().toISOString()
        });
        const commandMenuItemsToUpdate = commandMenuItemOperations.flatEntityToUpdate;
        if (commandMenuItemsToUpdate.length === 0) {
            this.logger.log(`CallRecording navigation command menu item availability expression already synced for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Syncing ${commandMenuItemsToUpdate.length} CallRecording navigation command menu item availability expression(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: commandMenuItemOperations
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to sync CallRecording navigation command menu item availability expression:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to sync CallRecording navigation command menu item availability expression for workspace ${workspaceId}`);
        }
        this.logger.log(`Successfully synced ${commandMenuItemsToUpdate.length} CallRecording navigation command menu item availability expression(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
SyncCallRecordingNavigationCommandMenuItemAvailabilityExpressionCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.17.0', 1801000000000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-17:sync-call-recording-navigation-command-menu-item-availability-expression',
        description: 'Remove the retired call recording feature-flag gate from existing CallRecording navigation command menu items'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], SyncCallRecordingNavigationCommandMenuItemAvailabilityExpressionCommand);

//# sourceMappingURL=2-17-workspace-command-1801000000000-sync-call-recording-navigation-command-menu-item-availability-expression.command.js.map