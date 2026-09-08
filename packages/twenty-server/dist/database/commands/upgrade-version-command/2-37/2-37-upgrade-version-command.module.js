"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_37_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_37_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _237workspacecommand1787832413051backfillmessagecalendartargetscommand = require("./2-37-workspace-command-1787832413051-backfill-message-calendar-targets.command");
const _237workspacecommand1787832412051syncmessagecalendartargetmetadatacommand = require("./2-37-workspace-command-1787832412051-sync-message-calendar-target-metadata.command");
const _237workspacecommand1787840804000restoresettingsnavigationcommandmenuitemlabelscommand = require("./2-37-workspace-command-1787840804000-restore-settings-navigation-command-menu-item-labels.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_37_UpgradeVersionCommandModule = class V2_37_UpgradeVersionCommandModule {
};
V2_37_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _237workspacecommand1787832412051syncmessagecalendartargetmetadatacommand.SyncMessageCalendarTargetMetadataCommand,
            _237workspacecommand1787832413051backfillmessagecalendartargetscommand.BackfillMessageCalendarTargetsCommand,
            _237workspacecommand1787840804000restoresettingsnavigationcommandmenuitemlabelscommand.RestoreSettingsNavigationCommandMenuItemLabelsCommand
        ]
    })
], V2_37_UpgradeVersionCommandModule);

//# sourceMappingURL=2-37-upgrade-version-command.module.js.map