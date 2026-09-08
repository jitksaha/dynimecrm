"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConfigureMessageCampaignCommandMenuCommand", {
    enumerable: true,
    get: function() {
        return ConfigureMessageCampaignCommandMenuCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _computetwentystandardapplicationallflatentitymapspre231util = require("../2-10/utils/compute-twenty-standard-application-all-flat-entity-maps-pre-2-31.util");
const _remaprecordpageuniversalidentifierstopre231util = require("../2-10/utils/remap-record-page-universal-identifiers-to-pre-2-31.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _standardcommandmenuitemconstant = require("../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
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
const SEND_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = [
    _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.sendMessageCampaign.universalIdentifier,
    _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.sendMessageCampaignTest.universalIdentifier
];
const MESSAGE_CAMPAIGN_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageCampaignRecordPage.universalIdentifier);
const REALIGNED_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = [
    _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.navigateToNextRecord.universalIdentifier,
    _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.navigateToPreviousRecord.universalIdentifier,
    _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.addToFavorites.universalIdentifier,
    _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.removeFromFavorites.universalIdentifier
];
let ConfigureMessageCampaignCommandMenuCommand = class ConfigureMessageCampaignCommandMenuCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatCommandMenuItemMaps: existingFlatCommandMenuItemMaps, flatPageLayoutMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatCommandMenuItemMaps',
            'flatPageLayoutMaps'
        ]);
        const existingPageLayout = flatPageLayoutMaps.byUniversalIdentifier[MESSAGE_CAMPAIGN_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(existingPageLayout)) {
            this.logger.log(`Message campaign page layout does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const standardAllFlatEntityMaps = (0, _computetwentystandardapplicationallflatentitymapspre231util.computeTwentyStandardApplicationAllFlatEntityMapsPre231)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const itemsToCreate = SEND_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS.filter((universalIdentifier)=>!(0, _utils.isDefined)(existingFlatCommandMenuItemMaps.byUniversalIdentifier[universalIdentifier])).map((universalIdentifier)=>standardAllFlatEntityMaps.flatCommandMenuItemMaps.byUniversalIdentifier[universalIdentifier]).filter((item)=>(0, _utils.isDefined)(item));
        const itemsToUpdate = REALIGNED_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS.map((universalIdentifier)=>{
            const existingItem = existingFlatCommandMenuItemMaps.byUniversalIdentifier[universalIdentifier];
            const standardItem = standardAllFlatEntityMaps.flatCommandMenuItemMaps.byUniversalIdentifier[universalIdentifier];
            if (!(0, _utils.isDefined)(existingItem) || !(0, _utils.isDefined)(standardItem) || existingItem.conditionalAvailabilityExpression === standardItem.conditionalAvailabilityExpression) {
                return null;
            }
            return {
                ...existingItem,
                conditionalAvailabilityExpression: standardItem.conditionalAvailabilityExpression
            };
        }).filter((item)=>(0, _utils.isDefined)(item));
        const totalOperationCount = itemsToCreate.length + itemsToUpdate.length;
        if (totalOperationCount === 0) {
            this.logger.log(`Message campaign command menu already configured for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Configuring message campaign command menu (${itemsToCreate.length} to add, ${itemsToUpdate.length} to realign) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: {
                    flatEntityToCreate: itemsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: itemsToUpdate
                }
            },
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new Error(`Failed to configure message campaign command menu for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Configured message campaign command menu for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceMigrationValidateBuildAndRunService, workspaceCacheService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService, this.workspaceCacheService = workspaceCacheService;
    }
};
ConfigureMessageCampaignCommandMenuCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.25.0', 1785229960000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-25:configure-message-campaign-command-menu',
        description: 'Adds the Send Campaign and Send Test Email record actions and hides the favorite/record-navigation actions on message campaign record pages in existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], ConfigureMessageCampaignCommandMenuCommand);

//# sourceMappingURL=2-25-workspace-command-1785229960000-configure-message-campaign-command-menu.command.js.map