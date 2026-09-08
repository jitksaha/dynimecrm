"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_14_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_14_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _214workspacecommand1799000065000synccallrecordingrequeststatuscommand = require("./2-14-workspace-command-1799000065000-sync-call-recording-request-status.command");
const _214workspacecommand1799000066000dropcalendareventrecordingpreferencecommand = require("./2-14-workspace-command-1799000066000-drop-calendar-event-recording-preference.command");
const _214workspacecommand1799000040000fixstandardrelationfieldlabelsiconscommand = require("./2-14-workspace-command-1799000040000-fix-standard-relation-field-labels-icons.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_14_UpgradeVersionCommandModule = class V2_14_UpgradeVersionCommandModule {
};
V2_14_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _214workspacecommand1799000040000fixstandardrelationfieldlabelsiconscommand.FixStandardRelationFieldLabelsIconsCommand,
            _214workspacecommand1799000065000synccallrecordingrequeststatuscommand.SyncCallRecordingRequestStatusCommand,
            _214workspacecommand1799000066000dropcalendareventrecordingpreferencecommand.DropCalendarEventRecordingPreferenceCommand
        ]
    })
], V2_14_UpgradeVersionCommandModule);

//# sourceMappingURL=2-14-upgrade-version-command.module.js.map