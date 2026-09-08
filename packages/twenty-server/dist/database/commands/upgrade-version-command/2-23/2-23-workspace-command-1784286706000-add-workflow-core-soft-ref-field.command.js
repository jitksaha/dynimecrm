"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddWorkflowCoreSoftRefFieldCommand", {
    enumerable: true,
    get: function() {
        return AddWorkflowCoreSoftRefFieldCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
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
const WORKFLOW = _metadata.STANDARD_OBJECTS.workflow;
const CORE_WORKFLOW_ID_FIELD_UNIVERSAL_IDENTIFIER = WORKFLOW.fields.coreWorkflowId.universalIdentifier;
let AddWorkflowCoreSoftRefFieldCommand = class AddWorkflowCoreSoftRefFieldCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatFieldMetadataMaps, flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps'
        ]);
        const workflowObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: WORKFLOW.universalIdentifier
        });
        if (!(0, _utils.isDefined)(workflowObjectMetadata)) {
            this.logger.log(`workflow object does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        if ((0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[CORE_WORKFLOW_ID_FIELD_UNIVERSAL_IDENTIFIER])) {
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const standardField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
            universalIdentifier: CORE_WORKFLOW_ID_FIELD_UNIVERSAL_IDENTIFIER
        });
        if (!(0, _utils.isDefined)(standardField)) {
            throw new Error('Standard application is missing workflow field coreWorkflowId');
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would add coreWorkflowId field for workspace ${workspaceId}`);
            return;
        }
        const flatFieldMetadataToCreate = {
            ...standardField,
            viewFieldIds: [],
            viewFieldUniversalIdentifiers: []
        };
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: [
                        flatFieldMetadataToCreate
                    ],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (result.status === 'fail') {
            this.logger.error(`Failed to add coreWorkflowId field:\n${JSON.stringify(result, null, 2)}`);
            throw new Error(`Failed to add coreWorkflowId field for workspace ${workspaceId}`);
        }
        this.logger.log(`Added coreWorkflowId field for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddWorkflowCoreSoftRefFieldCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.23.0', 1784286706000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-23:add-workflow-core-soft-ref-field',
        description: 'Add the workflow.coreWorkflowId system field on existing workspaces that predate it'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddWorkflowCoreSoftRefFieldCommand);

//# sourceMappingURL=2-23-workspace-command-1784286706000-add-workflow-core-soft-ref-field.command.js.map