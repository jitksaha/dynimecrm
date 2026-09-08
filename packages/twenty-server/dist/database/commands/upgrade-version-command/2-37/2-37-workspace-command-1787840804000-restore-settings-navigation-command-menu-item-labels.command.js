"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RestoreSettingsNavigationCommandMenuItemLabelsCommand", {
    enumerable: true,
    get: function() {
        return RestoreSettingsNavigationCommandMenuItemLabelsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _computesettingsnavigationdisplayfieldrestoreutil = require("./utils/compute-settings-navigation-display-field-restore.util");
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
let RestoreSettingsNavigationCommandMenuItemLabelsCommand = class RestoreSettingsNavigationCommandMenuItemLabelsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatCommandMenuItemMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatCommandMenuItemMaps'
        ]);
        const flatCommandMenuItemsToUpdate = (0, _computesettingsnavigationdisplayfieldrestoreutil.computeSettingsNavigationDisplayFieldRestore)({
            flatCommandMenuItemMaps,
            now: new Date().toISOString()
        });
        if (flatCommandMenuItemsToUpdate.length === 0) {
            this.logger.log(`Settings navigation command menu item labels already match the standard definition for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] Would restore' : 'Restoring'} ${flatCommandMenuItemsToUpdate.length} settings navigation command menu item label(s) for workspace ${workspaceId}`);
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
                    flatEntityToUpdate: flatCommandMenuItemsToUpdate
                }
            },
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to restore settings navigation command menu item labels:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to restore settings navigation command menu item labels for workspace ${workspaceId}`);
        }
        this.logger.log(`Successfully restored ${flatCommandMenuItemsToUpdate.length} settings navigation command menu item label(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
RestoreSettingsNavigationCommandMenuItemLabelsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.37.0', 1787840804000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-37:restore-settings-navigation-command-menu-item-labels',
        description: 'Restore the standard label, shortLabel and icon on the path-based settings navigation command menu items that upgrade:2-33 overwrote with object placeholder templates'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], RestoreSettingsNavigationCommandMenuItemLabelsCommand);

//# sourceMappingURL=2-37-workspace-command-1787840804000-restore-settings-navigation-command-menu-item-labels.command.js.map