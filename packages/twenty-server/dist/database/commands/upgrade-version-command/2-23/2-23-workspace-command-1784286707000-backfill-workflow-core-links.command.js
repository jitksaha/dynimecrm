"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillWorkflowCoreLinksCommand", {
    enumerable: true,
    get: function() {
        return BackfillWorkflowCoreLinksCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _isworkspaceobjectnotfounderrorutil = require("../utils/is-workspace-object-not-found-error.util");
const _uuid = require("uuid");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BackfillWorkflowCoreLinksCommand = class BackfillWorkflowCoreLinksCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options, dataSource }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.log(`No workspace data source for workspace ${workspaceId}, skipping`);
            return;
        }
        let workspaceWorkflows;
        try {
            workspaceWorkflows = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                const workflowRepository = this.workspaceOrmManager.getRepository('workflow', {
                    shouldBypassPermissionChecks: true
                });
                return workflowRepository.find();
            }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
        } catch (error) {
            if ((0, _isworkspaceobjectnotfounderrorutil.isWorkspaceObjectNotFoundError)(error)) {
                this.logger.log(`workflow object does not exist for workspace ${workspaceId}, skipping`);
                return;
            }
            throw error;
        }
        if (options.dryRun === true) {
            this.logger.log(`[DRY RUN] Would rebuild ${workspaceWorkflows.length} core workflow row(s) for workspace ${workspaceId}`);
            return;
        }
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const [workspace] = await queryRunner.query(`SELECT "databaseSchema", "workspaceCustomApplicationId" FROM core."workspace" WHERE id = $1`, [
                workspaceId
            ]);
            if (!(0, _utils.isDefined)(workspace?.workspaceCustomApplicationId)) {
                throw new Error(`Workspace custom application not found for workspace ${workspaceId}`);
            }
            const schema = workspace.databaseSchema;
            const applicationId = workspace.workspaceCustomApplicationId;
            await queryRunner.startTransaction();
            try {
                await queryRunner.query(`DELETE FROM core."workflow" WHERE "workspaceId" = $1`, [
                    workspaceId
                ]);
                for (const workflow of workspaceWorkflows){
                    const coreWorkflowId = (0, _uuid.v4)();
                    await queryRunner.query(`INSERT INTO core."workflow"
               (id, "workspaceId", "universalIdentifier", "applicationId", name, "lastPublishedVersionId")
             VALUES ($1, $2, $3, $4, $5, $6)`, [
                        coreWorkflowId,
                        workspaceId,
                        (0, _uuid.v4)(),
                        applicationId,
                        workflow.name ?? null,
                        workflow.lastPublishedVersionId || null
                    ]);
                    await queryRunner.query(`UPDATE "${schema}"."workflow" SET "coreWorkflowId" = $1 WHERE id = $2`, [
                        coreWorkflowId,
                        workflow.id
                    ]);
                }
                await queryRunner.commitTransaction();
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            }
            this.logger.log(`Rebuilt ${workspaceWorkflows.length} core workflow row(s) for workspace ${workspaceId}`);
        } finally{
            await queryRunner.release();
        }
    }
    constructor(workspaceIteratorService, workspaceOrmManager){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceOrmManager = workspaceOrmManager;
    }
};
BackfillWorkflowCoreLinksCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.23.0', 1784286707000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-23:backfill-workflow-core-links',
        description: 'Rebuild core workflow rows for each workspace and link every workspace record via coreWorkflowId'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], BackfillWorkflowCoreLinksCommand);

//# sourceMappingURL=2-23-workspace-command-1784286707000-backfill-workflow-core-links.command.js.map