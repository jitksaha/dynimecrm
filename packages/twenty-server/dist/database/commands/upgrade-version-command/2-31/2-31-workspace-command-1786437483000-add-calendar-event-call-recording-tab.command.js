"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddCalendarEventCallRecordingTabCommand", {
    enumerable: true,
    get: function() {
        return AddCalendarEventCallRecordingTabCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _getstandardflatentitiestocreateorthrowutil = require("../2-10/utils/get-standard-flat-entities-to-create-or-throw.util");
const _computecallrecordingtabpositionutil = require("./utils/compute-call-recording-tab-position.util");
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
const CALENDAR_EVENT_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.universalIdentifier;
const CALL_RECORDING_TAB_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.callRecording.universalIdentifier;
const TRANSCRIPT_WIDGET_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.callRecording.widgets.transcript.universalIdentifier;
let AddCalendarEventCallRecordingTabCommand = class AddCalendarEventCallRecordingTabCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
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
        const existingPageLayout = flatPageLayoutMaps.byUniversalIdentifier[CALENDAR_EVENT_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(existingPageLayout)) {
            this.logger.log(`CalendarEvent page layout does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const pageLayoutTabsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutTabMaps,
            existingFlatEntityMaps: flatPageLayoutTabMaps,
            universalIdentifiers: [
                CALL_RECORDING_TAB_UNIVERSAL_IDENTIFIER
            ]
        }).map((pageLayoutTab)=>({
                ...pageLayoutTab,
                position: (0, _computecallrecordingtabpositionutil.computeCallRecordingTabPosition)({
                    existingPageLayoutTabs: Object.values(flatPageLayoutTabMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((existingPageLayoutTab)=>existingPageLayoutTab.pageLayoutId === existingPageLayout.id)
                })
            }));
        const pageLayoutWidgetsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutWidgetMaps,
            existingFlatEntityMaps: flatPageLayoutWidgetMaps,
            universalIdentifiers: [
                TRANSCRIPT_WIDGET_UNIVERSAL_IDENTIFIER
            ]
        });
        const totalOperationCount = pageLayoutTabsToCreate.length + pageLayoutWidgetsToCreate.length;
        if (totalOperationCount === 0) {
            this.logger.log(`CalendarEvent record page already has the Call Recording tab for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Applying ${totalOperationCount} CalendarEvent Call Recording tab operation(s) for workspace ${workspaceId}`);
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
            throw new Error(`Failed to add the CalendarEvent Call Recording tab for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Added the CalendarEvent Call Recording tab for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddCalendarEventCallRecordingTabCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.31.0', 1786437483000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-31:add-calendar-event-call-recording-tab',
        description: 'Add the Call Recording tab and transcript widget to the CalendarEvent record page in existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddCalendarEventCallRecordingTabCommand);

//# sourceMappingURL=2-31-workspace-command-1786437483000-add-calendar-event-call-recording-tab.command.js.map