"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddWorkspaceMemberJobTitleFieldCommand", {
    enumerable: true,
    get: function() {
        return AddWorkspaceMemberJobTitleFieldCommand;
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
const WORKSPACE_MEMBER_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.workspaceMember.universalIdentifier;
const JOB_TITLE_FIELD_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.workspaceMember.fields.jobTitle.universalIdentifier;
let AddWorkspaceMemberJobTitleFieldCommand = class AddWorkspaceMemberJobTitleFieldCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]);
        const workspaceMemberObject = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: WORKSPACE_MEMBER_UNIVERSAL_IDENTIFIER
        });
        if (!(0, _utils.isDefined)(workspaceMemberObject)) {
            this.logger.log(`workspaceMember object not found for workspace ${workspaceId}, skipping`);
            return;
        }
        const existingJobTitleField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatFieldMetadataMaps,
            universalIdentifier: JOB_TITLE_FIELD_UNIVERSAL_IDENTIFIER
        });
        if ((0, _utils.isDefined)(existingJobTitleField)) {
            this.logger.log(`jobTitle field already present on workspaceMember for workspace ${workspaceId}, skipping`);
            return;
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would create jobTitle field on workspaceMember for workspace ${workspaceId}`);
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
        const standardJobTitleFlatFieldMetadata = standardAllFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[JOB_TITLE_FIELD_UNIVERSAL_IDENTIFIER];
        if (!(0, _utils.isDefined)(standardJobTitleFlatFieldMetadata)) {
            this.logger.log(`jobTitle standard field definition not found, skipping workspace ${workspaceId}`);
            return;
        }
        const flatFieldMetadataToCreate = {
            ...standardJobTitleFlatFieldMetadata,
            viewFieldIds: [],
            viewFieldUniversalIdentifiers: []
        };
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: [
                        flatFieldMetadataToCreate
                    ],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to add jobTitle field on workspaceMember for workspace ${workspaceId}:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to add jobTitle field on workspaceMember for workspace ${workspaceId}`);
        }
        this.logger.log(`Added jobTitle field on workspaceMember for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddWorkspaceMemberJobTitleFieldCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.17.0', 1801000010000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-17:add-workspace-member-job-title-field',
        description: 'Add jobTitle text field to the workspaceMember standard object for existing workspaces. Captured during onboarding to describe how a member appears to teammates and agents.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddWorkspaceMemberJobTitleFieldCommand);

//# sourceMappingURL=2-17-workspace-command-1801000010000-add-workspace-member-job-title-field.command.js.map