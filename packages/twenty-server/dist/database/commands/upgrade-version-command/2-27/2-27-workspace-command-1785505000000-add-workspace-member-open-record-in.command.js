"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddWorkspaceMemberOpenRecordInCommand", {
    enumerable: true,
    get: function() {
        return AddWorkspaceMemberOpenRecordInCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _getstandardflatentitiestocreateorthrowutil = require("../2-10/utils/get-standard-flat-entities-to-create-or-throw.util");
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
const WORKSPACE_MEMBER_OPEN_RECORD_IN_FIELD_UNIVERSAL_IDENTIFIERS = [
    _metadata.STANDARD_OBJECTS.workspaceMember.fields.openRecordIn.universalIdentifier
];
let AddWorkspaceMemberOpenRecordInCommand = class AddWorkspaceMemberOpenRecordInCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]);
        const existingWorkspaceMemberObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS.workspaceMember.universalIdentifier];
        if (!(0, _utils.isDefined)(existingWorkspaceMemberObjectMetadata)) {
            this.logger.log(`workspaceMember object metadata does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        // Cheap idempotency check before building the whole standard application.
        if (WORKSPACE_MEMBER_OPEN_RECORD_IN_FIELD_UNIVERSAL_IDENTIFIERS.every((universalIdentifier)=>(0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[universalIdentifier]))) {
            this.logger.log(`workspaceMember openRecordIn already exists for workspace ${workspaceId}, skipping`);
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
        const fieldsToCreate = (0, _getstandardflatentitiestocreateorthrowutil.getStandardFlatEntitiesToCreateOrThrow)({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
            existingFlatEntityMaps: flatFieldMetadataMaps,
            universalIdentifiers: WORKSPACE_MEMBER_OPEN_RECORD_IN_FIELD_UNIVERSAL_IDENTIFIERS
        });
        if (fieldsToCreate.length === 0) {
            this.logger.log(`workspaceMember openRecordIn already exists for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Creating the workspaceMember openRecordIn field for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: fieldsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (result.status === 'fail') {
            this.logger.error(`Failed to create the workspaceMember openRecordIn field:\n${JSON.stringify(result, null, 2)}`);
            throw new Error(`Failed to create the workspaceMember openRecordIn field for workspace ${workspaceId}`);
        }
        this.logger.log(`Created the workspaceMember openRecordIn field for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddWorkspaceMemberOpenRecordInCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.27.0', 1785505000000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-27:add-workspace-member-open-record-in',
        description: 'Create the workspace member openRecordIn preference field in existing workspaces'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddWorkspaceMemberOpenRecordInCommand);

//# sourceMappingURL=2-27-workspace-command-1785505000000-add-workspace-member-open-record-in.command.js.map