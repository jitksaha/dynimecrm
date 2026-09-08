"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillWorkflowVersionToCoreCommand", {
    enumerable: true,
    get: function() {
        return BackfillWorkflowVersionToCoreCommand;
    }
});
const _nestcommander = require("nest-commander");
const _isworkspaceobjectnotfounderrorutil = require("../utils/is-workspace-object-not-found-error.util");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workflowversioncoresyncservice = require("../../../../engine/core-modules/workflow/services/workflow-version-core-sync.service");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BackfillWorkflowVersionToCoreCommand = class BackfillWorkflowVersionToCoreCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        let workspaceWorkflowVersions;
        try {
            workspaceWorkflowVersions = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                const workflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                    shouldBypassPermissionChecks: true
                });
                return workflowVersionRepository.find();
            }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
        } catch (error) {
            if ((0, _isworkspaceobjectnotfounderrorutil.isWorkspaceObjectNotFoundError)(error)) {
                this.logger.log(`workflowVersion object does not exist for workspace ${workspaceId}, skipping`);
                return;
            }
            throw error;
        }
        if (options.dryRun === true) {
            this.logger.log(`[DRY RUN] Would upsert ${workspaceWorkflowVersions.length} workflowVersion row(s) into core for workspace ${workspaceId}`);
            return;
        }
        await this.workflowVersionCoreSyncService.upsertToCore(workspaceId, workspaceWorkflowVersions);
        this.logger.log(`Backfilled ${workspaceWorkflowVersions.length} workflowVersion row(s) into core for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, workspaceOrmManager, workflowVersionCoreSyncService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceOrmManager = workspaceOrmManager, this.workflowVersionCoreSyncService = workflowVersionCoreSyncService;
    }
};
BackfillWorkflowVersionToCoreCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.20.0', 1783526282685),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-20:backfill-workflow-version-to-core',
        description: 'Copy each workspace workflowVersion (trigger, steps, status, workflowId) into the core workflowVersion table, preserving ids'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workflowversioncoresyncservice.WorkflowVersionCoreSyncService === "undefined" ? Object : _workflowversioncoresyncservice.WorkflowVersionCoreSyncService
    ])
], BackfillWorkflowVersionToCoreCommand);

//# sourceMappingURL=2-20-workspace-command-1783526282685-backfill-workflow-version-to-core.command.js.map