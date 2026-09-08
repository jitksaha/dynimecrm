"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_27_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_27_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _227workspacecommand1785505000000addworkspacememberopenrecordincommand = require("./2-27-workspace-command-1785505000000-add-workspace-member-open-record-in.command");
const _227workspacecommand1785505100000seedobjectopenrecordincommand = require("./2-27-workspace-command-1785505100000-seed-object-open-record-in.command");
const _227workspacecommand1785499350000backfillstandardskillscommand = require("./2-27-workspace-command-1785499350000-backfill-standard-skills.command");
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
let V2_27_UpgradeVersionCommandModule = class V2_27_UpgradeVersionCommandModule {
};
V2_27_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _workspaceiteratormodule.WorkspaceIteratorModule
        ],
        providers: [
            _227workspacecommand1785505000000addworkspacememberopenrecordincommand.AddWorkspaceMemberOpenRecordInCommand,
            _227workspacecommand1785505100000seedobjectopenrecordincommand.SeedObjectOpenRecordInCommand,
            _227workspacecommand1785499350000backfillstandardskillscommand.BackfillMissingStandardSkillsCommand
        ]
    })
], V2_27_UpgradeVersionCommandModule);

//# sourceMappingURL=2-27-upgrade-version-command.module.js.map