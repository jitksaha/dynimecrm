"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddCallRecordingSummaryAndTranscriptTabsCommand", {
    enumerable: true,
    get: function() {
        return AddCallRecordingSummaryAndTranscriptTabsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _getstandardflatentitiestocreateorthrowutil = require("../2-10/utils/get-standard-flat-entities-to-create-or-throw.util");
const _computeappendedpagelayouttabpositionsutil = require("./utils/compute-appended-page-layout-tab-positions.util");
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
const CALL_RECORDING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.universalIdentifier;
const SUMMARY_TAB_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.summary.universalIdentifier;
const SUMMARY_WIDGET_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.summary.widgets.summary.universalIdentifier;
const CALL_RECORDING_TAB_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.callRecording.universalIdentifier;
const TRANSCRIPT_WIDGET_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.callRecording.widgets.transcript.universalIdentifier;
const APPENDED_TAB_UNIVERSAL_IDENTIFIERS = [
    SUMMARY_TAB_UNIVERSAL_IDENTIFIER,
    CALL_RECORDING_TAB_UNIVERSAL_IDENTIFIER
];
const APPENDED_WIDGET_UNIVERSAL_IDENTIFIERS = [
    SUMMARY_WIDGET_UNIVERSAL_IDENTIFIER,
    TRANSCRIPT_WIDGET_UNIVERSAL_IDENTIFIER
];
let AddCallRecordingSummaryAndTranscriptTabsCommand = class AddCallRecordingSummaryAndTranscriptTabsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatPageLayoutMaps',
            'flatPageLayoutTabMaps',
            'flatPageLayoutWidgetMaps'
        ]);
        const existingPageLayout = flatPageLayoutMaps.byUniversalIdentifier[CALL_RECORDING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(existingPageLayout)) {
            this.logger.log(`CallRecording page layout does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const standardPageLayoutTabsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutTabMaps,
            existingFlatEntityMaps: flatPageLayoutTabMaps,
            universalIdentifiers: APPENDED_TAB_UNIVERSAL_IDENTIFIERS
        });
        const appendedTabPositions = (0, _computeappendedpagelayouttabpositionsutil.computeAppendedPageLayoutTabPositions)({
            existingPageLayoutTabs: Object.values(flatPageLayoutTabMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((existingPageLayoutTab)=>existingPageLayoutTab.pageLayoutId === existingPageLayout.id),
            appendedTabCount: standardPageLayoutTabsToCreate.length
        });
        const pageLayoutTabsToCreate = standardPageLayoutTabsToCreate.map((pageLayoutTab, index)=>({
                ...pageLayoutTab,
                position: appendedTabPositions[index]
            }));
        const pageLayoutWidgetsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutWidgetMaps,
            existingFlatEntityMaps: flatPageLayoutWidgetMaps,
            universalIdentifiers: APPENDED_WIDGET_UNIVERSAL_IDENTIFIERS
        });
        const totalOperationCount = pageLayoutTabsToCreate.length + pageLayoutWidgetsToCreate.length;
        if (totalOperationCount === 0) {
            this.logger.log(`CallRecording record page already has the Summary and Call Recording tabs for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Applying ${totalOperationCount} CallRecording call recording tab operation(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName: {
                pageLayoutTab: {
                    flatEntityToCreate: pageLayoutTabsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                pageLayoutWidget: {
                    flatEntityToCreate: pageLayoutWidgetsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new Error(`Failed to add the CallRecording Summary and Call Recording tabs for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Added the CallRecording Summary and Call Recording tabs for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddCallRecordingSummaryAndTranscriptTabsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.36.0', 1787746350922),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-36:add-call-recording-summary-and-transcript-tabs',
        description: 'Add the Summary and Call Recording tabs with their call recording summary and transcript widgets to the CallRecording record page in existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddCallRecordingSummaryAndTranscriptTabsCommand);

//# sourceMappingURL=2-36-workspace-command-1787746350922-add-call-recording-summary-and-transcript-tabs.command.js.map