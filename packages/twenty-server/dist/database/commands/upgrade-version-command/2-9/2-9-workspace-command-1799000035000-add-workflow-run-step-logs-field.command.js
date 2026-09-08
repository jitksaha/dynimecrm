"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddWorkflowRunStepLogsFieldCommand", {
    enumerable: true,
    get: function() {
        return AddWorkflowRunStepLogsFieldCommand;
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
const _fieldmetadataservice = require("../../../../engine/metadata-modules/field-metadata/services/field-metadata.service");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const WORKFLOW_RUN_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.workflowRun.universalIdentifier;
const STEP_LOGS_FIELD_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.workflowRun.fields.stepLogs.universalIdentifier;
let AddWorkflowRunStepLogsFieldCommand = class AddWorkflowRunStepLogsFieldCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]);
        const workflowRunObject = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: WORKFLOW_RUN_UNIVERSAL_IDENTIFIER
        });
        if (!(0, _utils.isDefined)(workflowRunObject)) {
            this.logger.log(`workflowRun object not found for workspace ${workspaceId}, skipping`);
            return;
        }
        const existingStepLogsField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatFieldMetadataMaps,
            universalIdentifier: STEP_LOGS_FIELD_UNIVERSAL_IDENTIFIER
        });
        if ((0, _utils.isDefined)(existingStepLogsField)) {
            this.logger.log(`stepLogs field already present on workflowRun for workspace ${workspaceId}, skipping`);
            return;
        }
        const createFieldInput = {
            objectMetadataId: workflowRunObject.id,
            name: 'stepLogs',
            type: _types.FieldMetadataType.RAW_JSON,
            label: 'Step logs',
            description: 'Per-step observability payload (token usage, tool calls, log entries)',
            icon: 'IconTerminal2',
            isNullable: true,
            isUIReadOnly: true,
            isSystem: true,
            isActive: true,
            universalIdentifier: STEP_LOGS_FIELD_UNIVERSAL_IDENTIFIER
        };
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would create stepLogs field on workflowRun for workspace ${workspaceId}`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        try {
            await this.fieldMetadataService.createManyFields({
                createFieldInputs: [
                    createFieldInput
                ],
                workspaceId,
                ownerFlatApplication: twentyStandardFlatApplication,
                isSystemBuild: true
            });
        } catch (error) {
            this.logger.error(`Failed to add stepLogs field on workflowRun for workspace ${workspaceId}:\n${error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}`);
            throw error;
        }
        this.logger.log(`Added stepLogs field on workflowRun for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, fieldMetadataService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.fieldMetadataService = fieldMetadataService;
    }
};
AddWorkflowRunStepLogsFieldCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.9.0', 1799000035000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-9:add-workflow-run-step-logs-field',
        description: 'Add stepLogs JSONB field to the workflowRun standard object for existing workspaces. Per-step observability payload (token usage, tool calls, log entries) is written here.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _fieldmetadataservice.FieldMetadataService === "undefined" ? Object : _fieldmetadataservice.FieldMetadataService
    ])
], AddWorkflowRunStepLogsFieldCommand);

//# sourceMappingURL=2-9-workspace-command-1799000035000-add-workflow-run-step-logs-field.command.js.map