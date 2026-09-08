"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SeedObjectOpenRecordInCommand", {
    enumerable: true,
    get: function() {
        return SeedObjectOpenRecordInCommand;
    }
});
const _nestcommander = require("nest-commander");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
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
let SeedObjectOpenRecordInCommand = class SeedObjectOpenRecordInCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async getStandardOpenRecordInByUniversalIdentifier(workspaceId) {
        if ((0, _utils.isDefined)(this.standardOpenRecordInByUniversalIdentifier)) {
            return this.standardOpenRecordInByUniversalIdentifier;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        this.standardOpenRecordInByUniversalIdentifier = Object.fromEntries(Object.values(standardAllFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((standardObjectMetadata)=>standardObjectMetadata.openRecordIn !== _types.ObjectOpenRecordIn.USER_CHOICE).map((standardObjectMetadata)=>[
                standardObjectMetadata.universalIdentifier,
                standardObjectMetadata.openRecordIn
            ]));
        return this.standardOpenRecordInByUniversalIdentifier;
    }
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatViewMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatViewMaps'
        ]);
        const targetOpenRecordInByUniversalIdentifier = {
            ...await this.getStandardOpenRecordInByUniversalIdentifier(workspaceId)
        };
        // A deliberate per-view record page choice is lifted to the object, unless
        // the standard definitions already pin that object.
        for (const flatView of Object.values(flatViewMaps.byUniversalIdentifier)){
            if ((0, _utils.isDefined)(flatView) && flatView.key === _types.ViewKey.INDEX && flatView.openRecordIn === _types.ViewOpenRecordIn.RECORD_PAGE && !(0, _utils.isDefined)(targetOpenRecordInByUniversalIdentifier[flatView.objectMetadataUniversalIdentifier])) {
                targetOpenRecordInByUniversalIdentifier[flatView.objectMetadataUniversalIdentifier] = _types.ObjectOpenRecordIn.RECORD_PAGE;
            }
        }
        const now = new Date().toISOString();
        const objectMetadatasToUpdate = Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).flatMap((flatObjectMetadata)=>{
            const targetOpenRecordIn = targetOpenRecordInByUniversalIdentifier[flatObjectMetadata.universalIdentifier];
            if (!(0, _utils.isDefined)(targetOpenRecordIn) || flatObjectMetadata.openRecordIn === targetOpenRecordIn) {
                return [];
            }
            return [
                {
                    ...flatObjectMetadata,
                    openRecordIn: targetOpenRecordIn,
                    updatedAt: now
                }
            ];
        });
        if (objectMetadatasToUpdate.length === 0) {
            this.logger.log(`Object openRecordIn already seeded for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Workspace ${workspaceId}: seeding openRecordIn on ${objectMetadatasToUpdate.length} object(s)`);
        if (isDryRun) {
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName: {
                objectMetadata: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: objectMetadatasToUpdate
                }
            }
        });
        if (result.status === 'fail') {
            this.logger.error(`Failed to seed object openRecordIn:\n${JSON.stringify(result, null, 2)}`);
            throw new Error(`Failed to seed object openRecordIn for workspace ${workspaceId}`);
        }
        this.logger.log(`Seeded object openRecordIn for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
SeedObjectOpenRecordInCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.27.0', 1785505100000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-27:seed-object-open-record-in',
        description: 'Seed objectMetadata.openRecordIn from the standard definitions and from deliberate per-view record page choices'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], SeedObjectOpenRecordInCommand);

//# sourceMappingURL=2-27-workspace-command-1785505100000-seed-object-open-record-in.command.js.map