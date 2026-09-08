"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SyncCallRecordingStandardObjectsCommand", {
    enumerable: true,
    get: function() {
        return SyncCallRecordingStandardObjectsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildnavigationcommandmenuitemoperationsorthrowutil = require("./utils/build-navigation-command-menu-item-operations-or-throw.util");
const _callrecordingnamecollisionutil = require("./utils/call-recording-name-collision.util");
const _getstandardflatentitiestocreateorthrowutil = require("./utils/get-standard-flat-entities-to-create-or-throw.util");
const _computetwentystandardapplicationallflatentitymapspre231util = require("./utils/compute-twenty-standard-application-all-flat-entity-maps-pre-2-31.util");
const _remaprecordpageuniversalidentifierstopre231util = require("./utils/remap-record-page-universal-identifiers-to-pre-2-31.util");
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
const CALL_RECORDING_OBJECT_METADATA_UNIVERSAL_IDENTIFIERS = [
    _metadata.STANDARD_OBJECTS.callRecording.universalIdentifier
];
const CALL_RECORDING_FIELD_METADATA_UNIVERSAL_IDENTIFIERS = [
    ...getUniversalIdentifiers(_metadata.STANDARD_OBJECTS.callRecording.fields),
    _metadata.STANDARD_OBJECTS.calendarEvent.fields.callRecordings.universalIdentifier
];
const CALL_RECORDING_INDEX_UNIVERSAL_IDENTIFIERS = getUniversalIdentifiers(_metadata.STANDARD_OBJECTS.callRecording.indexes);
const CALL_RECORDING_VIEW_UNIVERSAL_IDENTIFIERS = [
    _metadata.STANDARD_OBJECTS.callRecording.views.allCallRecordings.universalIdentifier,
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_OBJECTS.callRecording.views.callRecordingRecordPageFields.universalIdentifier)
];
const CALL_RECORDING_VIEW_FIELD_GROUP_UNIVERSAL_IDENTIFIERS = getUniversalIdentifiers(_metadata.STANDARD_OBJECTS.callRecording.views.callRecordingRecordPageFields.viewFieldGroups);
const CALL_RECORDING_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
    ...getUniversalIdentifiers(_metadata.STANDARD_OBJECTS.callRecording.views.allCallRecordings.viewFields),
    ...getUniversalIdentifiers(_metadata.STANDARD_OBJECTS.callRecording.views.callRecordingRecordPageFields.viewFields)
];
const CALL_RECORDING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS = [
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.universalIdentifier)
];
const CALL_RECORDING_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIERS = [
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.home.universalIdentifier),
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.timeline.universalIdentifier)
];
const CALL_RECORDING_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIERS = [
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.home.widgets.fields.universalIdentifier),
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordingRecordPage.tabs.timeline.widgets.timeline.universalIdentifier)
];
// Preserves the shipped 2.10 upgrade path after recordingPreference moved out of
// current standard metadata.
const buildLegacyCalendarEventRecordingPreferenceFieldMetadata = ({ calendarEventObjectMetadata, now, twentyStandardApplicationId, workspaceId })=>({
        id: (0, _uuid.v4)(),
        universalIdentifier: _callrecordingnamecollisionutil.LEGACY_CALENDAR_EVENT_RECORDING_PREFERENCE_FIELD_UNIVERSAL_IDENTIFIER,
        applicationId: twentyStandardApplicationId,
        workspaceId,
        objectMetadataId: calendarEventObjectMetadata.id,
        type: _types.FieldMetadataType.SELECT,
        name: 'recordingPreference',
        label: 'Recording Preference',
        description: 'Whether to record this event, applied on top of the workspace policy',
        icon: 'IconSettingsAutomation',
        isActive: true,
        isSystem: false,
        isSystemSideEffect: false,
        isNullable: false,
        isUnique: false,
        isUIEditable: true,
        writability: _types.MetadataWritability.OPEN,
        isLabelSyncedWithName: false,
        overrides: null,
        defaultValue: "'AUTO'",
        settings: null,
        options: [
            {
                id: '4c4761ce-ffbf-4176-be7f-5cf5257c8bff',
                value: 'AUTO',
                label: 'Auto',
                position: 0,
                color: 'blue'
            },
            {
                id: '1ae19135-e1a1-4a96-b866-91643622e554',
                value: 'ON',
                label: 'On',
                position: 1,
                color: 'green'
            },
            {
                id: '8c69a74f-2ab7-4c19-a813-eb0ea3533fd3',
                value: 'OFF',
                label: 'Off',
                position: 2,
                color: 'gray'
            }
        ],
        relationTargetFieldMetadataId: null,
        relationTargetObjectMetadataId: null,
        morphId: null,
        viewFieldIds: [],
        viewFilterIds: [],
        fieldPermissionIds: [],
        kanbanAggregateOperationViewIds: [],
        calendarViewIds: [],
        calendarEndViewIds: [],
        mainGroupByFieldMetadataViewIds: [],
        createdAt: now,
        updatedAt: now,
        applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier,
        relationTargetObjectMetadataUniversalIdentifier: null,
        relationTargetFieldMetadataUniversalIdentifier: null,
        viewFilterUniversalIdentifiers: [],
        viewFieldUniversalIdentifiers: [],
        fieldPermissionUniversalIdentifiers: [],
        kanbanAggregateOperationViewUniversalIdentifiers: [],
        calendarViewUniversalIdentifiers: [],
        calendarEndViewUniversalIdentifiers: [],
        mainGroupByFieldMetadataViewUniversalIdentifiers: [],
        viewSortIds: [],
        viewSortUniversalIdentifiers: [],
        searchFieldMetadataIds: [],
        searchFieldMetadataUniversalIdentifiers: [],
        universalSettings: null
    });
let SyncCallRecordingStandardObjectsCommand = class SyncCallRecordingStandardObjectsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps, flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps, flatCommandMenuItemMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatIndexMaps',
            'flatViewMaps',
            'flatViewFieldMaps',
            'flatViewFieldGroupMaps',
            'flatPageLayoutMaps',
            'flatPageLayoutTabMaps',
            'flatPageLayoutWidgetMaps',
            'flatCommandMenuItemMaps'
        ]);
        const calendarEventObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier];
        if (!(0, _utils.isDefined)(calendarEventObjectMetadata)) {
            this.logger.warn(`calendarEvent object not found for workspace ${workspaceId}, skipping CallRecording standard metadata sync`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const now = new Date().toISOString();
        const standardAllFlatEntityMaps = (0, _computetwentystandardapplicationallflatentitymapspre231util.computeTwentyStandardApplicationAllFlatEntityMapsPre231)({
            now,
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const objectMetadataRenameUpdates = (0, _callrecordingnamecollisionutil.buildCallRecordingObjectRenameUpdates)({
            flatObjectMetadataMaps,
            now
        });
        const fieldMetadataRenameUpdates = (0, _callrecordingnamecollisionutil.buildCalendarEventFieldRenameUpdates)({
            flatFieldMetadataMaps,
            now
        });
        const renamedCollisionObjectMetadatas = objectMetadataRenameUpdates.map((objectMetadata)=>({
                universalIdentifier: objectMetadata.universalIdentifier,
                nameSingular: objectMetadata.nameSingular
            }));
        const callRecordingObjectMetadataForNavigation = (0, _getstandardflatentitiestocreateorthrowutil.getExistingOrStandardFlatEntityOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatObjectMetadataMaps,
            existingFlatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: _metadata.STANDARD_OBJECTS.callRecording.universalIdentifier
        });
        const navigationCommandMenuItemOperations = (0, _buildnavigationcommandmenuitemoperationsorthrowutil.buildNavigationCommandMenuItemOperationsOrThrow)({
            existingFlatCommandMenuItemMaps: flatCommandMenuItemMaps,
            objectMetadatasForNavigation: [
                callRecordingObjectMetadataForNavigation
            ],
            applicationId: twentyStandardFlatApplication.id,
            workspaceId,
            now,
            renamedCollisionObjectMetadatas
        });
        const legacyCalendarEventRecordingPreferenceFieldMetadata = flatFieldMetadataMaps.byUniversalIdentifier[_callrecordingnamecollisionutil.LEGACY_CALENDAR_EVENT_RECORDING_PREFERENCE_FIELD_UNIVERSAL_IDENTIFIER];
        const legacyCalendarEventRecordingPreferenceFieldMetadataToCreate = (0, _utils.isDefined)(legacyCalendarEventRecordingPreferenceFieldMetadata) ? [] : [
            buildLegacyCalendarEventRecordingPreferenceFieldMetadata({
                calendarEventObjectMetadata,
                now,
                twentyStandardApplicationId: twentyStandardFlatApplication.id,
                workspaceId
            })
        ];
        const allFlatEntityOperationByMetadataName = {
            objectMetadata: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatObjectMetadataMaps,
                    existingFlatEntityMaps: flatObjectMetadataMaps,
                    universalIdentifiers: CALL_RECORDING_OBJECT_METADATA_UNIVERSAL_IDENTIFIERS
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            fieldMetadata: {
                flatEntityToCreate: [
                    ...(0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                        standardFlatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
                        existingFlatEntityMaps: flatFieldMetadataMaps,
                        universalIdentifiers: CALL_RECORDING_FIELD_METADATA_UNIVERSAL_IDENTIFIERS
                    }),
                    ...legacyCalendarEventRecordingPreferenceFieldMetadataToCreate
                ],
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            index: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatIndexMaps,
                    existingFlatEntityMaps: flatIndexMaps,
                    universalIdentifiers: CALL_RECORDING_INDEX_UNIVERSAL_IDENTIFIERS
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            view: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewMaps,
                    existingFlatEntityMaps: flatViewMaps,
                    universalIdentifiers: CALL_RECORDING_VIEW_UNIVERSAL_IDENTIFIERS
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            viewFieldGroup: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewFieldGroupMaps,
                    existingFlatEntityMaps: flatViewFieldGroupMaps,
                    universalIdentifiers: CALL_RECORDING_VIEW_FIELD_GROUP_UNIVERSAL_IDENTIFIERS
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            viewField: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewFieldMaps,
                    existingFlatEntityMaps: flatViewFieldMaps,
                    universalIdentifiers: CALL_RECORDING_VIEW_FIELD_UNIVERSAL_IDENTIFIERS
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            pageLayout: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutMaps,
                    existingFlatEntityMaps: flatPageLayoutMaps,
                    universalIdentifiers: CALL_RECORDING_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            pageLayoutTab: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutTabMaps,
                    existingFlatEntityMaps: flatPageLayoutTabMaps,
                    universalIdentifiers: CALL_RECORDING_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIERS
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            pageLayoutWidget: {
                flatEntityToCreate: (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
                    standardFlatEntityMaps: standardAllFlatEntityMaps.flatPageLayoutWidgetMaps,
                    existingFlatEntityMaps: flatPageLayoutWidgetMaps,
                    universalIdentifiers: CALL_RECORDING_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIERS
                }),
                flatEntityToDelete: [],
                flatEntityToUpdate: []
            },
            commandMenuItem: navigationCommandMenuItemOperations
        };
        const totalOperationCount = objectMetadataRenameUpdates.length + fieldMetadataRenameUpdates.length + Object.values(allFlatEntityOperationByMetadataName).reduce((total, operations)=>total + operations.flatEntityToCreate.length + operations.flatEntityToUpdate.length, 0);
        if (totalOperationCount === 0) {
            this.logger.log(`CallRecording standard metadata already exists for workspace ${workspaceId}, skipping`);
            return;
        }
        if (isDryRun) {
            if (objectMetadataRenameUpdates.length > 0) {
                this.logger.log(`[DRY RUN] Would rename ${objectMetadataRenameUpdates.length} CallRecording object name collision(s) for workspace ${workspaceId}`);
            }
            if (fieldMetadataRenameUpdates.length > 0) {
                this.logger.log(`[DRY RUN] Would rename ${fieldMetadataRenameUpdates.length} calendarEvent field name collision(s) for workspace ${workspaceId}`);
            }
            this.logger.log(`[DRY RUN] Would apply ${totalOperationCount} CallRecording standard metadata operations for workspace ${workspaceId}`);
            return;
        }
        // Renames must commit before the create: a combined create + rename
        // migration trips the namePlural unique index.
        const collisionRenameMigrations = [
            ...objectMetadataRenameUpdates.map((flatObjectMetadata)=>({
                    applicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
                    allFlatEntityOperationByMetadataName: {
                        objectMetadata: {
                            flatEntityToCreate: [],
                            flatEntityToDelete: [],
                            flatEntityToUpdate: [
                                flatObjectMetadata
                            ]
                        }
                    }
                })),
            ...fieldMetadataRenameUpdates.map((flatFieldMetadata)=>({
                    applicationUniversalIdentifier: flatFieldMetadata.applicationUniversalIdentifier,
                    allFlatEntityOperationByMetadataName: {
                        fieldMetadata: {
                            flatEntityToCreate: [],
                            flatEntityToDelete: [],
                            flatEntityToUpdate: [
                                flatFieldMetadata
                            ]
                        }
                    }
                }))
        ];
        // Collisions can belong to different applications, so each rename runs as
        // its own migration scoped to the colliding entity's application.
        for (const { applicationUniversalIdentifier, allFlatEntityOperationByMetadataName } of collisionRenameMigrations){
            const renameResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
                isSystemBuild: true,
                applicationUniversalIdentifier,
                workspaceId,
                allFlatEntityOperationByMetadataName
            });
            if (renameResult.status === 'fail') {
                throw new Error(`Failed to rename CallRecording name collision for workspace ${workspaceId}: ${JSON.stringify(renameResult, null, 2)}`);
            }
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new Error(`Failed to create CallRecording standard objects for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Applied ${totalOperationCount} CallRecording standard metadata operations for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
SyncCallRecordingStandardObjectsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.10.0', 1799000055000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-10:sync-call-recording-standard-objects',
        description: 'Create the CallRecording standard metadata in existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], SyncCallRecordingStandardObjectsCommand);

//# sourceMappingURL=2-10-workspace-command-1799000055000-sync-call-recording-standard-objects.command.js.map