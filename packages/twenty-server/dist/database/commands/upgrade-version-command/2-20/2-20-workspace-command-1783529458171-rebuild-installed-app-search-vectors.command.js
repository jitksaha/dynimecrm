"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RebuildInstalledAppSearchVectorsCommand", {
    enumerable: true,
    get: function() {
        return RebuildInstalledAppSearchVectorsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _twentystandardapplications = require("../../../../engine/workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workspacemigrationactiontypeconstant = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-builder/constants/workspace-migration-action-type.constant");
const _workspacemigrationrunnerservice = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/services/workspace-migration-runner.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RebuildInstalledAppSearchVectorsCommand = class RebuildInstalledAppSearchVectorsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        const { twentyStandardFlatApplication, workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const installedAppTsVectorFlatFieldMetadatas = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatFieldMetadata)=>flatFieldMetadata.type === _types.FieldMetadataType.TS_VECTOR && flatFieldMetadata.applicationId !== twentyStandardFlatApplication.id && flatFieldMetadata.applicationId !== workspaceCustomFlatApplication.id);
        if (installedAppTsVectorFlatFieldMetadatas.length === 0) {
            this.logger.log(`No installed-app searchVector to rebuild for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Rebuilding ${installedAppTsVectorFlatFieldMetadatas.length} installed-app searchVector(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const actions = installedAppTsVectorFlatFieldMetadatas.map((flatFieldMetadata)=>({
                type: _workspacemigrationactiontypeconstant.WORKSPACE_MIGRATION_ACTION_TYPE.update,
                metadataName: 'fieldMetadata',
                universalIdentifier: flatFieldMetadata.universalIdentifier,
                update: {},
                rebuildSearchVector: true
            }));
        await this.workspaceMigrationRunnerService.run({
            workspaceMigration: {
                // Cross-app actions; this is only the runner's existence gate, not a scope filter.
                applicationUniversalIdentifier: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
                actions
            },
            workspaceId
        });
        this.logger.log(`Rebuilt ${installedAppTsVectorFlatFieldMetadatas.length} installed-app searchVector(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationRunnerService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService;
    }
};
RebuildInstalledAppSearchVectorsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.20.0', 1783529458171),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-20:rebuild-installed-app-search-vectors',
        description: 'Rebuild the searchVector column of every installed-app TS_VECTOR field from its searchFieldMetadata rows, now that the GIN index and searchFieldMetadata rows exist (commands 1 and 2). Idempotent.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService
    ])
], RebuildInstalledAppSearchVectorsCommand);

//# sourceMappingURL=2-20-workspace-command-1783529458171-rebuild-installed-app-search-vectors.command.js.map