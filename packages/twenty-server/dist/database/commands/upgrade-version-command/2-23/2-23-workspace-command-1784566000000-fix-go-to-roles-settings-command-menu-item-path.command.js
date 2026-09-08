"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FixGoToRolesSettingsCommandMenuItemPathCommand", {
    enumerable: true,
    get: function() {
        return FixGoToRolesSettingsCommandMenuItemPathCommand;
    }
});
const _nestcommander = require("nest-commander");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildfixgotorolessettingscommandmenuitempathsyncoperationsutil = require("./utils/build-fix-go-to-roles-settings-command-menu-item-path-sync-operations.util");
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
let FixGoToRolesSettingsCommandMenuItemPathCommand = class FixGoToRolesSettingsCommandMenuItemPathCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatCommandMenuItemMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatCommandMenuItemMaps'
        ]);
        const commandMenuItemOperations = (0, _buildfixgotorolessettingscommandmenuitempathsyncoperationsutil.buildFixGoToRolesSettingsCommandMenuItemPathSyncOperations)({
            existingFlatCommandMenuItemMaps: flatCommandMenuItemMaps,
            now: new Date().toISOString()
        });
        const commandMenuItemsToUpdate = commandMenuItemOperations.flatEntityToUpdate;
        if (commandMenuItemsToUpdate.length === 0) {
            this.logger.log(`"Go to Roles Settings" command menu item path already synced for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Fixing "Go to Roles Settings" command menu item path for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: commandMenuItemOperations
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to fix "Go to Roles Settings" command menu item path:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to fix "Go to Roles Settings" command menu item path for workspace ${workspaceId}`);
        }
        this.logger.log(`Successfully fixed "Go to Roles Settings" command menu item path for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
FixGoToRolesSettingsCommandMenuItemPathCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.23.0', 1784566000000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-23:fix-go-to-roles-settings-command-menu-item-path',
        description: 'Point the "Go to Roles Settings" navigation command menu item at /settings/members#roles for existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], FixGoToRolesSettingsCommandMenuItemPathCommand);

//# sourceMappingURL=2-23-workspace-command-1784566000000-fix-go-to-roles-settings-command-menu-item-path.command.js.map