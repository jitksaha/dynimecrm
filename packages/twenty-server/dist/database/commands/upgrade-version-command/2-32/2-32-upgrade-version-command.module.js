"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_32_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_32_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _232workspacecommand1786609782000addcalendareventsummarytabcommand = require("./2-32-workspace-command-1786609782000-add-calendar-event-summary-tab.command");
const _232workspacecommand1786700000000addworkspacememberuiscalefieldcommand = require("./2-32-workspace-command-1786700000000-add-workspace-member-ui-scale-field.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_32_UpgradeVersionCommandModule = class V2_32_UpgradeVersionCommandModule {
};
V2_32_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _232workspacecommand1786609782000addcalendareventsummarytabcommand.AddCalendarEventSummaryTabCommand,
            _232workspacecommand1786700000000addworkspacememberuiscalefieldcommand.AddWorkspaceMemberUiScaleFieldCommand
        ]
    })
], V2_32_UpgradeVersionCommandModule);

//# sourceMappingURL=2-32-upgrade-version-command.module.js.map