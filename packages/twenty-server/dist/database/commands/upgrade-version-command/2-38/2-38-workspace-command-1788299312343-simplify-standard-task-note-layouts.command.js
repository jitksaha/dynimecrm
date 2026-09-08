"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SimplifyStandardTaskNoteLayoutsCommand", {
    enumerable: true,
    get: function() {
        return SimplifyStandardTaskNoteLayoutsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _computestandardtasknotelayoutmigrationoperationsutil = require("./utils/compute-standard-task-note-layout-migration-operations.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workspacemigrationbuilderexception = require("../../../../engine/workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
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
let SimplifyStandardTaskNoteLayoutsCommand = class SimplifyStandardTaskNoteLayoutsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const flatMaps = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatPageLayoutMaps',
            'flatPageLayoutTabMaps',
            'flatPageLayoutWidgetMaps',
            'flatViewMaps',
            'flatViewFieldMaps',
            'flatViewFieldGroupMaps'
        ]);
        const { pageLayoutTabsToDelete, viewFieldsToDelete, viewFieldGroupsToDelete, skippedLayouts } = (0, _computestandardtasknotelayoutmigrationoperationsutil.computeStandardTaskNoteLayoutMigrationOperations)({
            flatMaps,
            standardApplicationId: twentyStandardFlatApplication.id
        });
        for (const skippedLayout of skippedLayouts){
            this.logger.log(`${skippedLayout.label} record page metadata is ${skippedLayout.reason} for workspace ${workspaceId}, skipping`);
        }
        const totalOperationCount = pageLayoutTabsToDelete.length + viewFieldsToDelete.length + viewFieldGroupsToDelete.length;
        if (totalOperationCount === 0) {
            this.logger.log(`Standard task and note record pages already up to date or customized for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Applying ${totalOperationCount} standard task and note record page operation(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName: {
                pageLayoutTab: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: pageLayoutTabsToDelete,
                    flatEntityToUpdate: []
                },
                viewField: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: viewFieldsToDelete,
                    flatEntityToUpdate: []
                },
                viewFieldGroup: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: viewFieldGroupsToDelete,
                    flatEntityToUpdate: []
                }
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult);
        }
        this.logger.log(`Simplified the standard task and note record pages for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
SimplifyStandardTaskNoteLayoutsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1788299312343),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:simplify-standard-task-note-layouts',
        description: 'Simplify uncustomized standard task and note record pages'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], SimplifyStandardTaskNoteLayoutsCommand);

//# sourceMappingURL=2-38-workspace-command-1788299312343-simplify-standard-task-note-layouts.command.js.map