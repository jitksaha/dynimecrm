"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MigrateManualTriggerVariablesToPayloadCommand", {
    enumerable: true,
    get: function() {
        return MigrateManualTriggerVariablesToPayloadCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _rewritetriggervariablestopayloadutil = require("./utils/rewrite-trigger-variables-to-payload.util");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workflowtriggertype = require("../../../../modules/workflow/workflow-trigger/types/workflow-trigger.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MigrateManualTriggerVariablesToPayloadCommand = class MigrateManualTriggerVariablesToPayloadCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        // Empty/partially-provisioned workspaces have no workflowVersion object;
        // fetching the repository for a missing entity throws, so skip them.
        const { flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps'
        ]);
        const workflowVersionObject = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: _metadata.STANDARD_OBJECTS.workflowVersion.universalIdentifier
        });
        if (!(0, _utils.isDefined)(workflowVersionObject)) {
            this.logger.log(`workflowVersion object not found for workspace ${workspaceId}, skipping`);
            return;
        }
        const workflowVersionRepository = this.workspaceOrmManager.getRepository('workflowVersion', {
            shouldBypassPermissionChecks: true
        });
        const allVersions = await workflowVersionRepository.find();
        let updatedVersionCount = 0;
        for (const version of allVersions){
            if (!this.isManualRecordTrigger(version.trigger)) {
                continue;
            }
            // Trigger references only appear in downstream steps, never in the
            // trigger object itself, so only the steps need rewriting.
            const migratedSteps = (0, _rewritetriggervariablestopayloadutil.rewriteTriggerVariablesToPayload)(version.steps);
            if (!migratedSteps.changed) {
                continue;
            }
            updatedVersionCount++;
            if (isDryRun) {
                continue;
            }
            await workflowVersionRepository.update(version.id, {
                steps: migratedSteps.value
            });
        }
        if (updatedVersionCount > 0) {
            this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Migrated trigger variables in ${updatedVersionCount} workflow version(s) for workspace ${workspaceId}`);
        }
    }
    isManualRecordTrigger(trigger) {
        if (!(0, _utils.isDefined)(trigger) || trigger.type !== _workflowtriggertype.WorkflowTriggerType.MANUAL) {
            return false;
        }
        const availabilityType = trigger.settings?.availability?.type;
        return availabilityType === 'SINGLE_RECORD' || availabilityType === 'BULK_RECORDS';
    }
    constructor(workspaceIteratorService, workspaceOrmManager, workspaceCacheService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceOrmManager = workspaceOrmManager, this.workspaceCacheService = workspaceCacheService;
    }
};
MigrateManualTriggerVariablesToPayloadCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.15.0', 1800000001000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-15:migrate-manual-trigger-variables-to-payload',
        description: 'Rewrite saved {{trigger.<field>}} references to {{trigger.payload.<field>}} for manual record triggers'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], MigrateManualTriggerVariablesToPayloadCommand);

//# sourceMappingURL=2-15-workspace-command-1800000001000-migrate-manual-trigger-variables-to-payload.command.js.map