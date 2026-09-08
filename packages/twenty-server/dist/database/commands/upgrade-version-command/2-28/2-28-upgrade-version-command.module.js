"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_28_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_28_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _228workspacecommand1785921674941addemailblocksettingscommandmenuitemcommand = require("./2-28-workspace-command-1785921674941-add-email-block-settings-command-menu-item.command");
const _228workspacecommand1785600000000repairorphancoreworkflowversionscommand = require("./2-28-workspace-command-1785600000000-repair-orphan-core-workflow-versions.command");
const _228workspacecommand1785858486000syncdiscarddraftworkflowavailabilityexpressioncommand = require("./2-28-workspace-command-1785858486000-sync-discard-draft-workflow-availability-expression.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationrunnermodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_28_UpgradeVersionCommandModule = class V2_28_UpgradeVersionCommandModule {
};
V2_28_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _workspaceiteratormodule.WorkspaceIteratorModule
        ],
        providers: [
            _228workspacecommand1785921674941addemailblocksettingscommandmenuitemcommand.AddEmailBlockSettingsCommandMenuItemCommand,
            _228workspacecommand1785600000000repairorphancoreworkflowversionscommand.RepairOrphanCoreWorkflowVersionsCommand,
            _228workspacecommand1785858486000syncdiscarddraftworkflowavailabilityexpressioncommand.SyncDiscardDraftWorkflowAvailabilityExpressionCommand
        ]
    })
], V2_28_UpgradeVersionCommandModule);

//# sourceMappingURL=2-28-upgrade-version-command.module.js.map