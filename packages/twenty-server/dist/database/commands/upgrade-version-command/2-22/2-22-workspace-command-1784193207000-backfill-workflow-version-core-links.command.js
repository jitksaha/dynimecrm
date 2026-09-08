"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillWorkflowVersionCoreLinksCommand", {
    enumerable: true,
    get: function() {
        return BackfillWorkflowVersionCoreLinksCommand;
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
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BackfillWorkflowVersionCoreLinksCommand = class BackfillWorkflowVersionCoreLinksCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options, dataSource }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.log(`No workspace data source for workspace ${workspaceId}, skipping`);
            return;
        }
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
            this.logger.log(`[DRY RUN] Would rebuild ${workspaceWorkflowVersions.length} core workflowVersion row(s) for workspace ${workspaceId}`);
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
                await queryRunner.query(`DELETE FROM core."workflowVersion" WHERE "workspaceId" = $1`, [
                    workspaceId
                ]);
                for (const workflowVersion of workspaceWorkflowVersions){
                    const coreWorkflowVersionId = (0, _uuid.v4)();
                    await queryRunner.query(`INSERT INTO core."workflowVersion"
               (id, "workspaceId", "universalIdentifier", "applicationId", triggers, steps, status, "workflowId")
             VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8)`, [
                        coreWorkflowVersionId,
                        workspaceId,
                        (0, _uuid.v4)(),
                        applicationId,
                        (0, _utils.isDefined)(workflowVersion.trigger) ? JSON.stringify([
                            workflowVersion.trigger
                        ]) : null,
                        (0, _utils.isDefined)(workflowVersion.steps) ? JSON.stringify(workflowVersion.steps) : null,
                        workflowVersion.status,
                        workflowVersion.workflowId
                    ]);
                    await queryRunner.query(`UPDATE "${schema}"."workflowVersion" SET "coreWorkflowVersionId" = $1 WHERE id = $2`, [
                        coreWorkflowVersionId,
                        workflowVersion.id
                    ]);
                }
                await queryRunner.commitTransaction();
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            }
            // The old sync path invalidated workflowAutomatedTriggerMaps; the raw-SQL
            // rebuild bypasses it, so recompute it from the fresh core rows.
            await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
                'workflowAutomatedTriggerMaps'
            ]);
            this.logger.log(`Rebuilt ${workspaceWorkflowVersions.length} core workflowVersion row(s) for workspace ${workspaceId}`);
        } finally{
            await queryRunner.release();
        }
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceOrmManager){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceOrmManager = workspaceOrmManager;
    }
};
BackfillWorkflowVersionCoreLinksCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.22.0', 1784193207000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-22:backfill-workflow-version-core-links',
        description: 'Rebuild core workflowVersion rows for each workspace and link every workspace record via coreWorkflowVersionId'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], BackfillWorkflowVersionCoreLinksCommand);

//# sourceMappingURL=2-22-workspace-command-1784193207000-backfill-workflow-version-core-links.command.js.map