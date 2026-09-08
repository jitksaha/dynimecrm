"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddNotRecordedCallRecordingStatusCommand", {
    enumerable: true,
    get: function() {
        return AddNotRecordedCallRecordingStatusCommand;
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
const _callrecordingstatusenum = require("../../../../modules/call-recording/common/enums/call-recording-status.enum");
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
// Same option id as the standard definition so provisioned and upgraded workspaces match.
const NOT_RECORDED_STATUS_OPTION = {
    id: 'cbd14df8-9cc2-4399-92f5-31fc41f3768b',
    value: _callrecordingstatusenum.CallRecordingStatus.NOT_RECORDED,
    label: 'Not recorded',
    position: 6,
    color: 'yellow'
};
let AddNotRecordedCallRecordingStatusCommand = class AddNotRecordedCallRecordingStatusCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
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
        const currentOptions = selectStatusField.options ?? [];
        const hasNotRecordedStatus = currentOptions.some((option)=>option.value === _callrecordingstatusenum.CallRecordingStatus.NOT_RECORDED);
        if (hasNotRecordedStatus) {
            this.logger.log(`CallRecording status metadata already has NOT_RECORDED for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Adding NOT_RECORDED to CallRecording status metadata for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const nextOptionPosition = currentOptions.reduce((highestPosition, option)=>Math.max(highestPosition, option.position), -1) + 1;
        const updatedStatusField = {
            ...selectStatusField,
            options: [
                ...currentOptions,
                {
                    ...NOT_RECORDED_STATUS_OPTION,
                    position: nextOptionPosition
                }
            ],
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
            throw new Error(`Failed to add NOT_RECORDED to CallRecording status metadata for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Added NOT_RECORDED to CallRecording status metadata for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddNotRecordedCallRecordingStatusCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.26.0', 1785334800000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-26:add-not-recorded-call-recording-status',
        description: 'Add the NOT_RECORDED option to the CallRecording status select in existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddNotRecordedCallRecordingStatusCommand);

//# sourceMappingURL=2-26-workspace-command-1785334800000-add-not-recorded-call-recording-status.command.js.map