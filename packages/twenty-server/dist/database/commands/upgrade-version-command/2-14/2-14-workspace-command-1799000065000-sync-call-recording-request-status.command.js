"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SyncCallRecordingRequestStatusCommand", {
    enumerable: true,
    get: function() {
        return SyncCallRecordingRequestStatusCommand;
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
const CALL_RECORDING_OBJECT_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.callRecording.universalIdentifier;
const CALL_RECORDING_REQUEST_STATUS_FIELD_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.callRecording.fields.recordingRequestStatus.universalIdentifier;
const CALL_RECORDING_REQUEST_STATUS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
    _metadata.STANDARD_OBJECTS.callRecording.views.allCallRecordings.viewFields.recordingRequestStatus.universalIdentifier,
    (0, _remaprecordpageuniversalidentifierstopre231util.toPre231RecordPageUniversalIdentifier)(_metadata.STANDARD_OBJECTS.callRecording.views.callRecordingRecordPageFields.viewFields.recordingRequestStatus.universalIdentifier)
];
const CALL_RECORDING_REQUEST_STATUS_FIELD_NAME = 'recordingRequestStatus';
let SyncCallRecordingRequestStatusCommand = class SyncCallRecordingRequestStatusCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatFieldMetadataMaps, flatObjectMetadataMaps, flatViewFieldMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps',
            'flatViewFieldMaps'
        ]);
        const existingCallRecordingObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[CALL_RECORDING_OBJECT_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(existingCallRecordingObjectMetadata)) {
            this.logger.log(`CallRecording object metadata does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const existingRecordingRequestStatusField = flatFieldMetadataMaps.byUniversalIdentifier[CALL_RECORDING_REQUEST_STATUS_FIELD_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(existingRecordingRequestStatusField) && hasFieldNameConflict({
            flatFieldMetadatas: Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined),
            callRecordingObjectMetadata: existingCallRecordingObjectMetadata
        })) {
            this.logger.warn(`Field name "${CALL_RECORDING_REQUEST_STATUS_FIELD_NAME}" is already taken on CallRecording for workspace ${workspaceId}; skipping`);
            return;
        }
        const standardAllFlatEntityMaps = (0, _computetwentystandardapplicationallflatentitymapspre231util.computeTwentyStandardApplicationAllFlatEntityMapsPre231)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const recordingRequestStatusFieldsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
            existingFlatEntityMaps: flatFieldMetadataMaps,
            universalIdentifiers: [
                CALL_RECORDING_REQUEST_STATUS_FIELD_UNIVERSAL_IDENTIFIER
            ]
        });
        const recordingRequestStatusViewFieldsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewFieldMaps,
            existingFlatEntityMaps: flatViewFieldMaps,
            universalIdentifiers: CALL_RECORDING_REQUEST_STATUS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS
        });
        const totalOperationCount = recordingRequestStatusFieldsToCreate.length + recordingRequestStatusViewFieldsToCreate.length;
        if (totalOperationCount === 0) {
            this.logger.log(`CallRecording recordingRequestStatus metadata already exists for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Creating ${totalOperationCount} CallRecording recordingRequestStatus metadata item(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: recordingRequestStatusFieldsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewField: {
                    flatEntityToCreate: recordingRequestStatusViewFieldsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new Error(`Failed to create CallRecording recordingRequestStatus metadata for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Created ${totalOperationCount} CallRecording recordingRequestStatus metadata item(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
SyncCallRecordingRequestStatusCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.14.0', 1799000065000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-14:sync-call-recording-request-status',
        description: 'Create the CallRecording recordingRequestStatus metadata in existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], SyncCallRecordingRequestStatusCommand);
const hasFieldNameConflict = ({ flatFieldMetadatas, callRecordingObjectMetadata })=>flatFieldMetadatas.some((flatFieldMetadata)=>flatFieldMetadata.objectMetadataUniversalIdentifier === callRecordingObjectMetadata.universalIdentifier && flatFieldMetadata.name === CALL_RECORDING_REQUEST_STATUS_FIELD_NAME);

//# sourceMappingURL=2-14-workspace-command-1799000065000-sync-call-recording-request-status.command.js.map