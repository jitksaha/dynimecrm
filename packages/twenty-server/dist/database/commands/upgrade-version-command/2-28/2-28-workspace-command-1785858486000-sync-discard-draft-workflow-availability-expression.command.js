"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SyncDiscardDraftWorkflowAvailabilityExpressionCommand", {
    enumerable: true,
    get: function() {
        return SyncDiscardDraftWorkflowAvailabilityExpressionCommand;
    }
});
const _nestcommander = require("nest-commander");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildsyncdiscarddraftworkflowavailabilityexpressionsyncoperationsutil = require("./utils/build-sync-discard-draft-workflow-availability-expression-sync-operations.util");
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
let SyncDiscardDraftWorkflowAvailabilityExpressionCommand = class SyncDiscardDraftWorkflowAvailabilityExpressionCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatCommandMenuItemMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatCommandMenuItemMaps'
        ]);
        const commandMenuItemsToUpdate = (0, _buildsyncdiscarddraftworkflowavailabilityexpressionsyncoperationsutil.buildDiscardDraftWorkflowCommandMenuItemsToUpdate)({
            existingFlatCommandMenuItemMaps: flatCommandMenuItemMaps
        });
        if (commandMenuItemsToUpdate.length === 0) {
            this.logger.log(`"Discard Draft" workflow command menu item availability expression already synced for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Syncing "Discard Draft" workflow command menu item availability expression for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: commandMenuItemsToUpdate
                }
            },
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to sync "Discard Draft" workflow command menu item availability expression:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to sync "Discard Draft" workflow command menu item availability expression for workspace ${workspaceId}`);
        }
        this.logger.log(`Successfully synced "Discard Draft" workflow command menu item availability expression for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
SyncDiscardDraftWorkflowAvailabilityExpressionCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.28.0', 1785858486000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-28:sync-discard-draft-workflow-availability-expression',
        description: 'Gate the "Discard Draft" workflow command menu item on lastPublishedVersionId so it is hidden when the draft is the only version in existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], SyncDiscardDraftWorkflowAvailabilityExpressionCommand);

//# sourceMappingURL=2-28-workspace-command-1785858486000-sync-discard-draft-workflow-availability-expression.command.js.map