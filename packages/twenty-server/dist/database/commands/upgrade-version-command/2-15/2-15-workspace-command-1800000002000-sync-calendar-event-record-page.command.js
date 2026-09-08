"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SyncCalendarEventRecordPageCommand", {
    enumerable: true,
    get: function() {
        return SyncCalendarEventRecordPageCommand;
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
const getUniversalIdentifiers = (entitiesByName)=>Object.values(entitiesByName).map((entity)=>(0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(entity.universalIdentifier));
const CALENDAR_EVENT_RECORD_PAGE_VIEW_UNIVERSAL_IDENTIFIERS = [
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_OBJECTS.calendarEvent.views.calendarEventRecordPageFields.universalIdentifier)
];
const CALENDAR_EVENT_RECORD_PAGE_VIEW_FIELD_GROUP_UNIVERSAL_IDENTIFIERS = getUniversalIdentifiers(_metadata.STANDARD_OBJECTS.calendarEvent.views.calendarEventRecordPageFields.viewFieldGroups);
// Pinned to the fields this command shipped with. It runs before the
// calendarEventTargets junction exists, so reading the live view would make it
// create a view field for a field the workspace does not have yet.
const CALENDAR_EVENT_RECORD_PAGE_VIEW_FIELD_NAMES = [
    'title',
    'startsAt',
    'endsAt',
    'isFullDay',
    'isCanceled',
    'conferenceLink',
    'location',
    'description',
    'externalCreatedAt',
    'externalUpdatedAt',
    'iCalUid',
    'conferenceSolution'
];
const CALENDAR_EVENT_RECORD_PAGE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = CALENDAR_EVENT_RECORD_PAGE_VIEW_FIELD_NAMES.map((viewFieldName)=>(0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_OBJECTS.calendarEvent.views.calendarEventRecordPageFields.viewFields[viewFieldName].universalIdentifier));
const CALENDAR_EVENT_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS = [
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.universalIdentifier)
];
const CALENDAR_EVENT_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIERS = [
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.home.universalIdentifier),
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.timeline.universalIdentifier)
];
const CALENDAR_EVENT_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIERS = [
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.home.widgets.fields.universalIdentifier),
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.home.widgets.participants.universalIdentifier),
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.timeline.widgets.timeline.universalIdentifier)
];
const CALENDAR_EVENT_CALL_RECORDINGS_WIDGET_UNIVERSAL_IDENTIFIER = (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.calendarEventRecordPage.tabs.home.widgets.callRecordings.universalIdentifier);
const CALENDAR_EVENT_CALL_RECORDINGS_FIELD_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.calendarEvent.fields.callRecordings.universalIdentifier;
let SyncCalendarEventRecordPageCommand = class SyncCalendarEventRecordPageCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatViewMaps',
            'flatViewFieldMaps',
            'flatViewFieldGroupMaps',
            'flatPageLayoutMaps',
            'flatPageLayoutTabMaps',
            'flatPageLayoutWidgetMaps'
        ]);
        const existingCalendarEventObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier];
        if (!(0, _utils.isDefined)(existingCalendarEventObjectMetadata)) {
            this.logger.log(`calendarEvent object metadata does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const hasCallRecordingsField = (0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[CALENDAR_EVENT_CALL_RECORDINGS_FIELD_UNIVERSAL_IDENTIFIER]);
        const pageLayoutWidgetUniversalIdentifiers = hasCallRecordingsField ? [
            ...CALENDAR_EVENT_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIERS,
            CALENDAR_EVENT_CALL_RECORDINGS_WIDGET_UNIVERSAL_IDENTIFIER
        ] : CALENDAR_EVENT_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIERS;
        const standardAllFlatEntityMaps = (0, _computetwentystandardapplicationallflatentitymapspre231util.computeTwentyStandardApplicationAllFlatEntityMapsPre231)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const viewsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewMaps,
            existingFlatEntityMaps: flatViewMaps,
            universalIdentifiers: CALENDAR_EVENT_RECORD_PAGE_VIEW_UNIVERSAL_IDENTIFIERS
        });
        const viewFieldGroupsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewFieldGroupMaps,
            existingFlatEntityMaps: flatViewFieldGroupMaps,
            universalIdentifiers: CALENDAR_EVENT_RECORD_PAGE_VIEW_FIELD_GROUP_UNIVERSAL_IDENTIFIERS
        });
        const viewFieldsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewFieldMaps,
            existingFlatEntityMaps: flatViewFieldMaps,
            universalIdentifiers: CALENDAR_EVENT_RECORD_PAGE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS
        });
        const pageLayoutsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutMaps,
            existingFlatEntityMaps: flatPageLayoutMaps,
            universalIdentifiers: CALENDAR_EVENT_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
        });
        const pageLayoutTabsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutTabMaps,
            existingFlatEntityMaps: flatPageLayoutTabMaps,
            universalIdentifiers: CALENDAR_EVENT_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIERS
        });
        const pageLayoutWidgetsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutWidgetMaps,
            existingFlatEntityMaps: flatPageLayoutWidgetMaps,
            universalIdentifiers: pageLayoutWidgetUniversalIdentifiers
        });
        const totalOperationCount = viewsToCreate.length + viewFieldGroupsToCreate.length + viewFieldsToCreate.length + pageLayoutsToCreate.length + pageLayoutTabsToCreate.length + pageLayoutWidgetsToCreate.length;
        if (totalOperationCount === 0) {
            this.logger.log(`CalendarEvent record page metadata already exists for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Creating ${totalOperationCount} CalendarEvent record page metadata item(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName: {
                view: {
                    flatEntityToCreate: viewsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewFieldGroup: {
                    flatEntityToCreate: viewFieldGroupsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewField: {
                    flatEntityToCreate: viewFieldsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                pageLayout: {
                    flatEntityToCreate: pageLayoutsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
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
            throw new Error(`Failed to create CalendarEvent record page metadata for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Created ${totalOperationCount} CalendarEvent record page metadata item(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
SyncCalendarEventRecordPageCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.15.0', 1800000002000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-15:sync-calendar-event-record-page',
        description: 'Create the CalendarEvent record page layout and fields view in existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], SyncCalendarEventRecordPageCommand);

//# sourceMappingURL=2-15-workspace-command-1800000002000-sync-calendar-event-record-page.command.js.map