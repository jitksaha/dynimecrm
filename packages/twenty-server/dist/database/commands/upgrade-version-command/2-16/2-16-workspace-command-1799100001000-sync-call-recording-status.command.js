"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SyncCallRecordingStatusCommand", {
    enumerable: true,
    get: function() {
        return SyncCallRecordingStatusCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
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
const CALL_RECORDING_STATUS_FIELD_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.callRecording.fields.status.universalIdentifier;
const CALL_RECORDING_OBJECT_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.callRecording.universalIdentifier;
const LEGACY_FAILED_STATUS = 'FAILED_UNKNOWN';
const FAILED_STATUS = 'FAILED';
let SyncCallRecordingStatusCommand = class SyncCallRecordingStatusCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatFieldMetadataMaps, flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps'
        ]);
        const callRecordingObject = flatObjectMetadataMaps.byUniversalIdentifier[CALL_RECORDING_OBJECT_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(callRecordingObject)) {
            this.logger.log(`CallRecording object metadata does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const statusField = flatFieldMetadataMaps.byUniversalIdentifier[CALL_RECORDING_STATUS_FIELD_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(statusField)) {
            this.logger.log(`CallRecording status field metadata does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        if (statusField.type !== _types.FieldMetadataType.SELECT) {
            throw new Error(`CallRecording status metadata is not a SELECT field for workspace ${workspaceId}`);
        }
        const selectStatusField = statusField;
        const optionsWithFailedStatus = (selectStatusField.options ?? []).map((option)=>option.value === LEGACY_FAILED_STATUS ? {
                ...option,
                value: FAILED_STATUS
            } : option);
        const hasLegacyFailedStatus = optionsWithFailedStatus.some((option, index)=>option.value !== selectStatusField.options?.[index]?.value);
        if (!hasLegacyFailedStatus) {
            this.logger.log(`CallRecording status metadata already synced for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Syncing CallRecording status metadata from ${LEGACY_FAILED_STATUS} to ${FAILED_STATUS} for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const updatedStatusField = {
            ...selectStatusField,
            options: optionsWithFailedStatus,
            updatedAt: new Date().toISOString()
        };
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: [
                        updatedStatusField
                    ]
                }
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new Error(`Failed to sync CallRecording status metadata for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Synced CallRecording status metadata from ${LEGACY_FAILED_STATUS} to ${FAILED_STATUS} for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
SyncCallRecordingStatusCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.16.0', 1799100001000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-16:sync-call-recording-status',
        description: 'Sync CallRecording status metadata from FAILED_UNKNOWN to FAILED in existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], SyncCallRecordingStatusCommand);

//# sourceMappingURL=2-16-workspace-command-1799100001000-sync-call-recording-status.command.js.map