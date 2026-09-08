"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RepairOrphanCoreWorkflowVersionsCommand", {
    enumerable: true,
    get: function() {
        return RepairOrphanCoreWorkflowVersionsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _isworkspaceobjectnotfounderrorutil = require("../utils/is-workspace-object-not-found-error.util");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RepairOrphanCoreWorkflowVersionsCommand = class RepairOrphanCoreWorkflowVersionsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options, dataSource }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            return;
        }
        try {
            // Resolve the workspace workflowVersion object; an object-not-found error
            // means it was never provisioned, so there is nothing to repair and the
            // orphan query below would fail to resolve its schema table. Skip cleanly
            // like the sibling backfill commands rather than aborting the upgrade.
            await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                const workflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
                    shouldBypassPermissionChecks: true
                });
                return workflowVersionRepository.count();
            }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
        } catch (error) {
            if ((0, _isworkspaceobjectnotfounderrorutil.isWorkspaceObjectNotFoundError)(error)) {
                return;
            }
            throw error;
        }
        const schema = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const orphanClause = `
      FROM core."workflowVersion" c
      WHERE c."workspaceId" = $1
        AND NOT EXISTS (
          SELECT 1
          FROM "${schema}"."workflowVersion" wf
          WHERE wf."coreWorkflowVersionId" = c.id
        )`;
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const [counts] = await queryRunner.query(`SELECT count(*)::int AS total,
                count(*) FILTER (WHERE c.status = 'ACTIVE')::int AS active
         ${orphanClause}`, [
                workspaceId
            ]);
            if (counts.total === 0) {
                return;
            }
            if (options.dryRun) {
                this.logger.log(`[DRY RUN] Would delete ${counts.total} orphan core workflowVersion row(s) (${counts.active} ACTIVE) for workspace ${workspaceId}`);
                return;
            }
            await queryRunner.startTransaction();
            try {
                await queryRunner.query(`DELETE ${orphanClause}`, [
                    workspaceId
                ]);
                await queryRunner.commitTransaction();
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            }
            this.logger.log(`Deleted ${counts.total} orphan core workflowVersion row(s) (${counts.active} ACTIVE) for workspace ${workspaceId}`);
            // The raw delete bypasses the sync path that normally invalidates the
            // automated trigger map, which is built from ACTIVE core versions, so
            // recompute it only when an ACTIVE orphan was removed.
            if (counts.active > 0) {
                await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
                    'workflowAutomatedTriggerMaps'
                ]);
            }
        } finally{
            await queryRunner.release();
        }
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceOrmManager){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceOrmManager = workspaceOrmManager;
    }
};
RepairOrphanCoreWorkflowVersionsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.28.0', 1785600000000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-28:repair-orphan-core-workflow-versions',
        description: 'Delete orphan core workflowVersion rows with no workspace referrer'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], RepairOrphanCoreWorkflowVersionsCommand);

//# sourceMappingURL=2-28-workspace-command-1785600000000-repair-orphan-core-workflow-versions.command.js.map