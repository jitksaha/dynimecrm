"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RewriteIsNotNullWorkflowFilterOperandsCommand", {
    enumerable: true,
    get: function() {
        return RewriteIsNotNullWorkflowFilterOperandsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _rewriteisnotnullfilteroperandsutil = require("./utils/rewrite-is-not-null-filter-operands.util");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
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
let RewriteIsNotNullWorkflowFilterOperandsCommand = class RewriteIsNotNullWorkflowFilterOperandsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps'
        ]);
        await this.rewriteWorkflowVersions({
            workspaceId,
            flatObjectMetadataMaps,
            isDryRun
        });
        await this.rewriteAutomatedTriggers({
            workspaceId,
            flatObjectMetadataMaps,
            isDryRun
        });
    }
    async rewriteWorkflowVersions({ workspaceId, flatObjectMetadataMaps, isDryRun }) {
        const workflowVersionObject = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: _metadata.STANDARD_OBJECTS.workflowVersion.universalIdentifier
        });
        if (!(0, _utils.isDefined)(workflowVersionObject)) {
            return;
        }
        const workflowVersionRepository = await this.workspaceOrmManager.getRepository('workflowVersion', {
            shouldBypassPermissionChecks: true
        });
        const allVersions = await workflowVersionRepository.find();
        let updatedCount = 0;
        for (const version of allVersions){
            const migratedSteps = (0, _rewriteisnotnullfilteroperandsutil.rewriteIsNotNullFilterOperands)(version.steps);
            const migratedTrigger = (0, _rewriteisnotnullfilteroperandsutil.rewriteIsNotNullFilterOperands)(version.trigger);
            if (!migratedSteps.changed && !migratedTrigger.changed) {
                continue;
            }
            updatedCount++;
            if (isDryRun) {
                continue;
            }
            await workflowVersionRepository.update(version.id, {
                ...migratedSteps.changed ? {
                    steps: migratedSteps.value
                } : {},
                ...migratedTrigger.changed ? {
                    trigger: migratedTrigger.value
                } : {}
            });
        }
        if (updatedCount > 0) {
            this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Rewrote IS_NOT_NULL operands in ${updatedCount} workflow version(s) for workspace ${workspaceId}`);
        }
    }
    async rewriteAutomatedTriggers({ workspaceId, flatObjectMetadataMaps, isDryRun }) {
        const automatedTriggerObject = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: _metadata.STANDARD_OBJECTS.workflowAutomatedTrigger.universalIdentifier
        });
        if (!(0, _utils.isDefined)(automatedTriggerObject)) {
            return;
        }
        const automatedTriggerRepository = await this.workspaceOrmManager.getRepository('workflowAutomatedTrigger', {
            shouldBypassPermissionChecks: true
        });
        const allTriggers = await automatedTriggerRepository.find();
        let updatedCount = 0;
        for (const trigger of allTriggers){
            const migratedSettings = (0, _rewriteisnotnullfilteroperandsutil.rewriteIsNotNullFilterOperands)(trigger.settings);
            if (!migratedSettings.changed) {
                continue;
            }
            updatedCount++;
            if (isDryRun) {
                continue;
            }
            await automatedTriggerRepository.update(trigger.id, {
                settings: migratedSettings.value
            });
        }
        if (updatedCount === 0) {
            return;
        }
        if (!isDryRun) {
            await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
                'workflowAutomatedTriggerMaps'
            ]);
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Rewrote IS_NOT_NULL operands in ${updatedCount} automated trigger(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, workspaceOrmManager, workspaceCacheService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceOrmManager = workspaceOrmManager, this.workspaceCacheService = workspaceCacheService;
    }
};
RewriteIsNotNullWorkflowFilterOperandsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.36.0', 1787700000000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-36:rewrite-is-not-null-workflow-filter-operands',
        description: 'Rewrite the legacy IS_NOT_NULL filter operand to IS_NOT_EMPTY in workflow if-else/filter steps and database-event trigger filters, which otherwise throws at runtime'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], RewriteIsNotNullWorkflowFilterOperandsCommand);

//# sourceMappingURL=2-36-workspace-command-1787700000000-rewrite-is-not-null-workflow-filter-operands.command.js.map