"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RemoveMessageCampaignNavigationMenuItemCommand", {
    enumerable: true,
    get: function() {
        return RemoveMessageCampaignNavigationMenuItemCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _standardnavigationmenuitemconstant = require("../../../../engine/workspace-manager/twenty-standard-application/constants/standard-navigation-menu-item.constant");
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
const ALL_MESSAGE_CAMPAIGNS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = _standardnavigationmenuitemconstant.STANDARD_NAVIGATION_MENU_ITEMS.allMessageCampaigns.universalIdentifier;
let RemoveMessageCampaignNavigationMenuItemCommand = class RemoveMessageCampaignNavigationMenuItemCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatNavigationMenuItemMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatNavigationMenuItemMaps'
        ]);
        // Every user workspace gets its own row, so collect them all rather than
        // looking the identifier up once.
        const navigationMenuItemsToDelete = Object.values(flatNavigationMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((navigationMenuItem)=>navigationMenuItem.universalIdentifier === ALL_MESSAGE_CAMPAIGNS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER);
        if (navigationMenuItemsToDelete.length === 0) {
            this.logger.log(`Campaigns navigation menu item not present for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Removing ${navigationMenuItemsToDelete.length} Campaigns navigation menu item(s) for workspace ${workspaceId}`);
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
                navigationMenuItem: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: navigationMenuItemsToDelete,
                    flatEntityToUpdate: []
                }
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to remove the Campaigns navigation menu item:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to remove the Campaigns navigation menu item for workspace ${workspaceId}`);
        }
        this.logger.log(`Removed the Campaigns navigation menu item for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
RemoveMessageCampaignNavigationMenuItemCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.25.0', 1785332550000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-25:remove-message-campaign-navigation-menu-item',
        description: 'Remove the Campaigns navigation menu item from workspaces provisioned while it was built unconditionally, since navigation items cannot be gated behind IS_EMAIL_GROUP_ENABLED yet'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], RemoveMessageCampaignNavigationMenuItemCommand);

//# sourceMappingURL=2-25-workspace-command-1785332550000-remove-message-campaign-navigation-menu-item.command.js.map