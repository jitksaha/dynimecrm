"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_15_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_15_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _215workspacecommand1800000001000migratemanualtriggervariablestopayloadcommand = require("./2-15-workspace-command-1800000001000-migrate-manual-trigger-variables-to-payload.command");
const _215workspacecommand1800000002000synccalendareventrecordpagecommand = require("./2-15-workspace-command-1800000002000-sync-calendar-event-record-page.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_15_UpgradeVersionCommandModule = class V2_15_UpgradeVersionCommandModule {
};
V2_15_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _215workspacecommand1800000001000migratemanualtriggervariablestopayloadcommand.MigrateManualTriggerVariablesToPayloadCommand,
            _215workspacecommand1800000002000synccalendareventrecordpagecommand.SyncCalendarEventRecordPageCommand
        ]
    })
], V2_15_UpgradeVersionCommandModule);

//# sourceMappingURL=2-15-upgrade-version-command.module.js.map