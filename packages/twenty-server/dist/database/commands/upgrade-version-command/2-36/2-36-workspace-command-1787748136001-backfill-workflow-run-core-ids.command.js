"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillWorkflowRunCoreIdsCommand", {
    enumerable: true,
    get: function() {
        return BackfillWorkflowRunCoreIdsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BackfillWorkflowRunCoreIdsCommand = class BackfillWorkflowRunCoreIdsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options, dataSource }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.log(`No workspace data source for workspace ${workspaceId}, skipping`);
            return;
        }
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const [workspace] = await queryRunner.query(`SELECT "databaseSchema" FROM core."workspace" WHERE id = $1`, [
                workspaceId
            ]);
            const schema = workspace?.databaseSchema;
            if (!(0, _utils.isDefined)(schema)) {
                this.logger.log(`No database schema for workspace ${workspaceId}, skipping`);
                return;
            }
            const [{ workflowRunTableExists }] = await queryRunner.query(`SELECT to_regclass($1) IS NOT NULL AS "workflowRunTableExists"`, [
                `"${schema}"."workflowRun"`
            ]);
            if (workflowRunTableExists !== true) {
                this.logger.log(`workflowRun table does not exist for workspace ${workspaceId}, skipping`);
                return;
            }
            if (options.dryRun === true) {
                // The new columns may not exist yet in dry-run (the add-fields command
                // also dry-ran), so count candidate rows without referencing them.
                const [{ count }] = await queryRunner.query(`SELECT COUNT(*)::int AS count
           FROM "${schema}"."workflowRun" workflowRun
           JOIN "${schema}"."workflowVersion" workflowVersion
             ON workflowVersion.id = workflowRun."workflowVersionId"
           WHERE workflowVersion."coreWorkflowVersionId" IS NOT NULL`);
                this.logger.log(`[DRY RUN] Would backfill core ids on up to ${count} workflowRun row(s) for workspace ${workspaceId}`);
                return;
            }
            const [, updatedVersionRowCount] = await queryRunner.query(`UPDATE "${schema}"."workflowRun" workflowRun
         SET "coreWorkflowVersionId" = workflowVersion."coreWorkflowVersionId"
         FROM "${schema}"."workflowVersion" workflowVersion
         WHERE workflowVersion.id = workflowRun."workflowVersionId"
           AND workflowRun."coreWorkflowVersionId" IS NULL
           AND workflowVersion."coreWorkflowVersionId" IS NOT NULL`);
            const [, updatedWorkflowRowCount] = await queryRunner.query(`UPDATE "${schema}"."workflowRun" workflowRun
         SET "coreWorkflowId" = workflow."coreWorkflowId"
         FROM "${schema}"."workflow" workflow
         WHERE workflow.id = workflowRun."workflowId"
           AND workflowRun."coreWorkflowId" IS NULL
           AND workflow."coreWorkflowId" IS NOT NULL`);
            this.logger.log(`Backfilled workflowRun core ids for workspace ${workspaceId} (coreWorkflowVersionId: ${updatedVersionRowCount}, coreWorkflowId: ${updatedWorkflowRowCount})`);
        } finally{
            await queryRunner.release();
        }
    }
    constructor(workspaceIteratorService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService;
    }
};
BackfillWorkflowRunCoreIdsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.36.0', 1787748136001),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-36:backfill-workflow-run-core-ids',
        description: 'Backfill workflowRun.coreWorkflowId and workflowRun.coreWorkflowVersionId from the workflow and workflowVersion core links'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService
    ])
], BackfillWorkflowRunCoreIdsCommand);

//# sourceMappingURL=2-36-workspace-command-1787748136001-backfill-workflow-run-core-ids.command.js.map