"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeleteWorkflowRunsCommand", {
    enumerable: true,
    get: function() {
        return DeleteWorkflowRunsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _typeorm = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../../../../database/commands/command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../../../../database/commands/command-runners/workspace-iterator.service");
const _workspaceormmanager = require("../../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../../engine/twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DeleteWorkflowRunsCommand = class DeleteWorkflowRunsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    parseCreatedBefore(val) {
        const date = new Date(val);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date format: ${val}`);
        }
        const createdBeforeDate = date.toISOString();
        this.createdBeforeDate = createdBeforeDate;
        return createdBeforeDate;
    }
    async runOnWorkspace({ workspaceId, options }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            try {
                const workflowRunRepository = this.workspaceOrmManager.getRepository('workflowRun', {
                    shouldBypassPermissionChecks: true
                });
                const createdAtCondition = {
                    createdAt: (0, _typeorm.LessThan)(this.createdBeforeDate || new Date().toISOString())
                };
                const workflowRunCount = await workflowRunRepository.count({
                    where: createdAtCondition
                });
                if (!options.dryRun && workflowRunCount > 0) {
                    await workflowRunRepository.delete(createdAtCondition);
                }
                this.logger.log(`${options.dryRun ? ' (DRY RUN): ' : ''}Deleted ${workflowRunCount} workflow runs`);
            } catch (error) {
                this.logger.error('Error while deleting workflowRun', error);
            }
        }, authContext);
    }
    constructor(workspaceOrmManager, workspaceIteratorService){
        super(workspaceIteratorService), this.workspaceOrmManager = workspaceOrmManager, this.workspaceIteratorService = workspaceIteratorService;
    }
};
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '--created-before [created_before]',
        description: 'created before. Delete workflow runs created before that date (YYYY-MM-DD)',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Object)
], DeleteWorkflowRunsCommand.prototype, "parseCreatedBefore", null);
DeleteWorkflowRunsCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'workflow:delete-workflow-runs',
        description: 'Delete all workflow runs'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService
    ])
], DeleteWorkflowRunsCommand);

//# sourceMappingURL=delete-workflow-runs.command.js.map