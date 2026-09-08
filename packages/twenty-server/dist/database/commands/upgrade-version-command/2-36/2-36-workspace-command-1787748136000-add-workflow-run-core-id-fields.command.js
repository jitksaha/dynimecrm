"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddWorkflowRunCoreIdFieldsCommand", {
    enumerable: true,
    get: function() {
        return AddWorkflowRunCoreIdFieldsCommand;
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
const WORKFLOW_RUN = _metadata.STANDARD_OBJECTS.workflowRun;
const CORE_ID_FIELD_UNIVERSAL_IDENTIFIERS = [
    WORKFLOW_RUN.fields.coreWorkflowId.universalIdentifier,
    WORKFLOW_RUN.fields.coreWorkflowVersionId.universalIdentifier
];
let AddWorkflowRunCoreIdFieldsCommand = class AddWorkflowRunCoreIdFieldsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatFieldMetadataMaps, flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps'
        ]);
        const workflowRunObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: WORKFLOW_RUN.universalIdentifier
        });
        if (!(0, _utils.isDefined)(workflowRunObjectMetadata)) {
            this.logger.log(`workflowRun object does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const missingFieldUniversalIdentifiers = CORE_ID_FIELD_UNIVERSAL_IDENTIFIERS.filter((universalIdentifier)=>!(0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[universalIdentifier]));
        if (missingFieldUniversalIdentifiers.length === 0) {
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
        const flatFieldMetadataToCreate = missingFieldUniversalIdentifiers.map((universalIdentifier)=>{
            const standardField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
                universalIdentifier
            });
            if (!(0, _utils.isDefined)(standardField)) {
                throw new Error(`Standard application is missing workflowRun field ${universalIdentifier}`);
            }
            return {
                ...standardField,
                viewFieldIds: [],
                viewFieldUniversalIdentifiers: []
            };
        });
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would add ${flatFieldMetadataToCreate.length} workflowRun core id field(s) for workspace ${workspaceId}`);
            return;
        }
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: flatFieldMetadataToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (result.status === 'fail') {
            this.logger.error(`Failed to add workflowRun core id fields:\n${JSON.stringify(result, null, 2)}`);
            throw new Error(`Failed to add workflowRun core id fields for workspace ${workspaceId}`);
        }
        this.logger.log(`Added ${flatFieldMetadataToCreate.length} workflowRun core id field(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddWorkflowRunCoreIdFieldsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.36.0', 1787748136000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-36:add-workflow-run-core-id-fields',
        description: 'Add the workflowRun.coreWorkflowId and workflowRun.coreWorkflowVersionId system fields on existing workspaces that predate them'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddWorkflowRunCoreIdFieldsCommand);

//# sourceMappingURL=2-36-workspace-command-1787748136000-add-workflow-run-core-id-fields.command.js.map