"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MarkSearchVectorFieldsSystemCommand", {
    enumerable: true,
    get: function() {
        return MarkSearchVectorFieldsSystemCommand;
    }
});
const _nestcommander = require("nest-commander");
const _lodashgroupby = /*#__PURE__*/ _interop_require_default(require("lodash.groupby"));
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MarkSearchVectorFieldsSystemCommand = class MarkSearchVectorFieldsSystemCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        const flatFieldMetadatasToUpdate = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatFieldMetadata)=>flatFieldMetadata.type === _types.FieldMetadataType.TS_VECTOR && flatFieldMetadata.writability !== _types.MetadataWritability.SYSTEM).map((flatFieldMetadata)=>({
                ...flatFieldMetadata,
                writability: _types.MetadataWritability.SYSTEM
            }));
        if (flatFieldMetadatasToUpdate.length === 0) {
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] Would mark' : 'Marking'} ${flatFieldMetadatasToUpdate.length} search vector field(s) as SYSTEM for workspace ${workspaceId}`);
        const flatFieldMetadatasToUpdateByApplicationUniversalIdentifier = (0, _lodashgroupby.default)(flatFieldMetadatasToUpdate, (flatFieldMetadata)=>flatFieldMetadata.applicationUniversalIdentifier);
        for (const [applicationUniversalIdentifier, flatEntityToUpdate] of Object.entries(flatFieldMetadatasToUpdateByApplicationUniversalIdentifier)){
            const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
                isSystemBuild: true,
                workspaceId,
                applicationUniversalIdentifier,
                dryRun: isDryRun,
                allFlatEntityOperationByMetadataName: {
                    fieldMetadata: {
                        flatEntityToCreate: [],
                        flatEntityToDelete: [],
                        flatEntityToUpdate
                    }
                }
            });
            if (validateAndBuildResult.status === 'fail') {
                this.logger.error(`Failed to mark search vector fields as SYSTEM:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
                throw new Error(`Failed to mark search vector fields as SYSTEM for workspace ${workspaceId}`);
            }
        }
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
MarkSearchVectorFieldsSystemCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.33.0', 1787138325228),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-33:mark-search-vector-fields-system',
        description: 'Mark searchVector fields as SYSTEM writability on existing workspaces: they are Postgres generated columns nothing may write'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], MarkSearchVectorFieldsSystemCommand);

//# sourceMappingURL=2-33-workspace-command-1787138325228-mark-search-vector-fields-system.command.js.map