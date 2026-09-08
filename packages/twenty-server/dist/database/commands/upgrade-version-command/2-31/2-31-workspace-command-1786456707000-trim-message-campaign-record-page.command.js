"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TrimMessageCampaignRecordPageCommand", {
    enumerable: true,
    get: function() {
        return TrimMessageCampaignRecordPageCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
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
const MESSAGE_CAMPAIGN_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageCampaignRecordPage.universalIdentifier;
const HOME_WIDGETS = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageCampaignRecordPage.tabs.home.widgets;
// details: its fields now sit above the body in the composer.
// list: the envelope above the sent body already names the list it went to.
const REMOVED_WIDGET_UNIVERSAL_IDENTIFIERS = [
    HOME_WIDGETS.details.universalIdentifier,
    HOME_WIDGETS.list.universalIdentifier
];
// The widgets that stay move from "not everyEquals" to "noneEquals". The two
// agree on a loaded record, but an empty selection makes the first true and the
// second false, and the selection is empty until the record loads.
const SENT_ONLY_WIDGET_UNIVERSAL_IDENTIFIERS = [
    HOME_WIDGETS.fields.universalIdentifier,
    HOME_WIDGETS.recipients.universalIdentifier
];
let TrimMessageCampaignRecordPageCommand = class TrimMessageCampaignRecordPageCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatPageLayoutMaps, flatPageLayoutWidgetMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatPageLayoutMaps',
            'flatPageLayoutWidgetMaps'
        ]);
        const existingPageLayout = flatPageLayoutMaps.byUniversalIdentifier[MESSAGE_CAMPAIGN_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(existingPageLayout)) {
            this.logger.log(`Message campaign page layout does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const pageLayoutWidgetsToDelete = REMOVED_WIDGET_UNIVERSAL_IDENTIFIERS.map((universalIdentifier)=>flatPageLayoutWidgetMaps.byUniversalIdentifier[universalIdentifier]).filter((widget)=>(0, _utils.isDefined)(widget));
        const pageLayoutWidgetsToUpdate = SENT_ONLY_WIDGET_UNIVERSAL_IDENTIFIERS.map((universalIdentifier)=>{
            const existingWidget = flatPageLayoutWidgetMaps.byUniversalIdentifier[universalIdentifier];
            const standardWidget = standardAllFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier[universalIdentifier];
            if (!(0, _utils.isDefined)(existingWidget) || !(0, _utils.isDefined)(standardWidget) || existingWidget.conditionalAvailabilityExpression === standardWidget.conditionalAvailabilityExpression) {
                return null;
            }
            return {
                ...existingWidget,
                conditionalAvailabilityExpression: standardWidget.conditionalAvailabilityExpression
            };
        }).filter((widget)=>(0, _utils.isDefined)(widget));
        const totalOperationCount = pageLayoutWidgetsToDelete.length + pageLayoutWidgetsToUpdate.length;
        if (totalOperationCount === 0) {
            this.logger.log(`Message campaign record page already up to date for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Applying ${totalOperationCount} message campaign record page operation(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName: {
                pageLayoutWidget: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: pageLayoutWidgetsToDelete,
                    flatEntityToUpdate: pageLayoutWidgetsToUpdate
                }
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new Error(`Failed to update the message campaign record page for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Updated the message campaign record page for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
TrimMessageCampaignRecordPageCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.31.0', 1786456707000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-31:trim-message-campaign-record-page',
        description: 'Removes the message campaign details and list widgets, both of which the envelope above the body now covers, and makes the widgets that stay fail closed while the record loads'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], TrimMessageCampaignRecordPageCommand);

//# sourceMappingURL=2-31-workspace-command-1786456707000-trim-message-campaign-record-page.command.js.map