"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddMessageCampaignComposerTabCommand", {
    enumerable: true,
    get: function() {
        return AddMessageCampaignComposerTabCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _computetwentystandardapplicationallflatentitymapspre231util = require("../2-10/utils/compute-twenty-standard-application-all-flat-entity-maps-pre-2-31.util");
const _getstandardflatentitiestocreateorthrowutil = require("../2-10/utils/get-standard-flat-entities-to-create-or-throw.util");
const _remaprecordpageuniversalidentifierstopre231util = require("../2-10/utils/remap-record-page-universal-identifiers-to-pre-2-31.util");
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
// This command predates the 2-31 record-page reconcile: workspace rows still
// hold the pre-derivation universal identifiers.
const MESSAGE_CAMPAIGN_RECORD_PAGE_VIEW = _metadata.STANDARD_OBJECTS.messageCampaign.views.messageCampaignRecordPageFields;
const MESSAGE_CAMPAIGN_RECORD_PAGE_LAYOUT = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.messageCampaignRecordPage;
const MESSAGE_CAMPAIGN_RECORD_PAGE_FIELDS_VIEW_UNIVERSAL_IDENTIFIER = (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(MESSAGE_CAMPAIGN_RECORD_PAGE_VIEW.universalIdentifier);
const MESSAGE_CAMPAIGN_RECORD_PAGE_FIELDS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
    MESSAGE_CAMPAIGN_RECORD_PAGE_VIEW.viewFields.status.universalIdentifier,
    MESSAGE_CAMPAIGN_RECORD_PAGE_VIEW.viewFields.sentAt.universalIdentifier,
    MESSAGE_CAMPAIGN_RECORD_PAGE_VIEW.viewFields.sentCount.universalIdentifier,
    MESSAGE_CAMPAIGN_RECORD_PAGE_VIEW.viewFields.failedCount.universalIdentifier,
    MESSAGE_CAMPAIGN_RECORD_PAGE_VIEW.viewFields.bouncedCount.universalIdentifier,
    MESSAGE_CAMPAIGN_RECORD_PAGE_VIEW.viewFields.complainedCount.universalIdentifier
].map(_remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier);
const MESSAGE_CAMPAIGN_RECORD_PAGE_FIELDS_VIEW_FIELD_GROUP_UNIVERSAL_IDENTIFIERS = [
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(MESSAGE_CAMPAIGN_RECORD_PAGE_VIEW.viewFieldGroups.stats.universalIdentifier)
];
const MESSAGE_CAMPAIGN_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(MESSAGE_CAMPAIGN_RECORD_PAGE_LAYOUT.universalIdentifier);
const HOME_TAB_UNIVERSAL_IDENTIFIER = (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(MESSAGE_CAMPAIGN_RECORD_PAGE_LAYOUT.tabs.home.universalIdentifier);
const COMPOSER_TAB_UNIVERSAL_IDENTIFIER = (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(MESSAGE_CAMPAIGN_RECORD_PAGE_LAYOUT.tabs.composer.universalIdentifier);
const COMPOSER_WIDGET_UNIVERSAL_IDENTIFIER = (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(MESSAGE_CAMPAIGN_RECORD_PAGE_LAYOUT.tabs.composer.widgets.messageCampaign.universalIdentifier);
const HOME_FIELDS_WIDGET_UNIVERSAL_IDENTIFIER = (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(MESSAGE_CAMPAIGN_RECORD_PAGE_LAYOUT.tabs.home.widgets.fields.universalIdentifier);
const HOME_RECIPIENTS_WIDGET_UNIVERSAL_IDENTIFIER = (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(MESSAGE_CAMPAIGN_RECORD_PAGE_LAYOUT.tabs.home.widgets.recipients.universalIdentifier);
// Deleted from the standard definitions, so it has no constant to derive from.
const HOME_OBSOLETE_MESSAGES_WIDGET_UNIVERSAL_IDENTIFIER = 'a33b43f4-72a1-476d-9372-30e82f450377';
let AddMessageCampaignComposerTabCommand = class AddMessageCampaignComposerTabCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatPageLayoutMaps',
            'flatPageLayoutTabMaps',
            'flatPageLayoutWidgetMaps',
            'flatViewMaps',
            'flatViewFieldMaps',
            'flatViewFieldGroupMaps'
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
        const pageLayoutTabsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutTabMaps,
            existingFlatEntityMaps: flatPageLayoutTabMaps,
            universalIdentifiers: [
                HOME_TAB_UNIVERSAL_IDENTIFIER,
                COMPOSER_TAB_UNIVERSAL_IDENTIFIER
            ]
        });
        // Every identifier here must still exist in the standard layout:
        // getStandardFlatEntitiesToCreateOrThrow resolves against the current
        // standard maps and throws when one is absent, failing the upgrade for
        // every workspace crossing this version.
        const pageLayoutWidgetsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutWidgetMaps,
            existingFlatEntityMaps: flatPageLayoutWidgetMaps,
            universalIdentifiers: [
                COMPOSER_WIDGET_UNIVERSAL_IDENTIFIER,
                HOME_RECIPIENTS_WIDGET_UNIVERSAL_IDENTIFIER,
                HOME_FIELDS_WIDGET_UNIVERSAL_IDENTIFIER
            ]
        });
        const viewsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewMaps,
            existingFlatEntityMaps: flatViewMaps,
            universalIdentifiers: [
                MESSAGE_CAMPAIGN_RECORD_PAGE_FIELDS_VIEW_UNIVERSAL_IDENTIFIER
            ]
        });
        const viewFieldsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewFieldMaps,
            existingFlatEntityMaps: flatViewFieldMaps,
            universalIdentifiers: MESSAGE_CAMPAIGN_RECORD_PAGE_FIELDS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS
        });
        const viewFieldGroupsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewFieldGroupMaps,
            existingFlatEntityMaps: flatViewFieldGroupMaps,
            universalIdentifiers: MESSAGE_CAMPAIGN_RECORD_PAGE_FIELDS_VIEW_FIELD_GROUP_UNIVERSAL_IDENTIFIERS
        });
        const existingComposerTab = flatPageLayoutTabMaps.byUniversalIdentifier[COMPOSER_TAB_UNIVERSAL_IDENTIFIER];
        const standardComposerTab = standardAllFlatEntityMaps.flatPageLayoutTabMaps.byUniversalIdentifier[COMPOSER_TAB_UNIVERSAL_IDENTIFIER];
        const pageLayoutTabsToUpdate = (0, _utils.isDefined)(existingComposerTab) && (0, _utils.isDefined)(standardComposerTab) && existingComposerTab.layoutMode !== standardComposerTab.layoutMode ? [
            {
                ...existingComposerTab,
                layoutMode: standardComposerTab.layoutMode,
                title: standardComposerTab.title
            }
        ] : [];
        const pageLayoutWidgetsToUpdate = [
            HOME_FIELDS_WIDGET_UNIVERSAL_IDENTIFIER,
            HOME_RECIPIENTS_WIDGET_UNIVERSAL_IDENTIFIER
        ].map((universalIdentifier)=>{
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
        const obsoleteMessagesWidget = flatPageLayoutWidgetMaps.byUniversalIdentifier[HOME_OBSOLETE_MESSAGES_WIDGET_UNIVERSAL_IDENTIFIER];
        const pageLayoutWidgetsToDelete = (0, _utils.isDefined)(obsoleteMessagesWidget) ? [
            obsoleteMessagesWidget
        ] : [];
        const totalOperationCount = pageLayoutTabsToCreate.length + pageLayoutWidgetsToCreate.length + pageLayoutTabsToUpdate.length + pageLayoutWidgetsToUpdate.length + pageLayoutWidgetsToDelete.length + viewsToCreate.length + viewFieldsToCreate.length + viewFieldGroupsToCreate.length;
        if (totalOperationCount === 0) {
            this.logger.log(`Message campaign record page already has the home and email tabs for workspace ${workspaceId}, skipping`);
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
                pageLayoutTab: {
                    flatEntityToCreate: pageLayoutTabsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: pageLayoutTabsToUpdate
                },
                pageLayoutWidget: {
                    flatEntityToCreate: pageLayoutWidgetsToCreate,
                    flatEntityToDelete: pageLayoutWidgetsToDelete,
                    flatEntityToUpdate: pageLayoutWidgetsToUpdate
                },
                view: {
                    flatEntityToCreate: viewsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewField: {
                    flatEntityToCreate: viewFieldsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewFieldGroup: {
                    flatEntityToCreate: viewFieldGroupsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new Error(`Failed to align the message campaign record page for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Aligned the message campaign record page for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddMessageCampaignComposerTabCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.25.0', 1785229940000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-25:add-message-campaign-composer-tab',
        description: 'Aligns the message campaign record page with the Note layout: a home Fields tab (left column) plus an Email tab holding the composer editor'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddMessageCampaignComposerTabCommand);

//# sourceMappingURL=2-25-workspace-command-1785229940000-add-message-campaign-composer-tab.command.js.map