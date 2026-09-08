"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_16_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_16_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _216workspacecommand1799100000000backfillsearchfieldmetadatacommand = require("./2-16-workspace-command-1799100000000-backfill-search-field-metadata.command");
const _216workspacecommand1799100001000synccallrecordingstatuscommand = require("./2-16-workspace-command-1799100001000-sync-call-recording-status.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_16_UpgradeVersionCommandModule = class V2_16_UpgradeVersionCommandModule {
};
V2_16_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _216workspacecommand1799100000000backfillsearchfieldmetadatacommand.BackfillSearchFieldMetadataCommand,
            _216workspacecommand1799100001000synccallrecordingstatuscommand.SyncCallRecordingStatusCommand
        ]
    })
], V2_16_UpgradeVersionCommandModule);

//# sourceMappingURL=2-16-upgrade-version-command.module.js.map