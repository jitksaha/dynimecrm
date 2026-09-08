"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_18_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_18_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _218workspacecommand1810000005000addmessageisdraftfieldcommand = require("./2-18-workspace-command-1810000005000-add-message-is-draft-field.command");
const _218workspacecommand1799200000000normalizelegacyindexnamescommand = require("./2-18-workspace-command-1799200000000-normalize-legacy-index-names.command");
const _218workspacecommand1799200001000recomputesearchvectorscommand = require("./2-18-workspace-command-1799200001000-recompute-search-vectors.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _workspaceschemamanagermodule = require("../../../../engine/twenty-orm/workspace-schema-manager/workspace-schema-manager.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
const _workspacemigrationrunnermodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_18_UpgradeVersionCommandModule = class V2_18_UpgradeVersionCommandModule {
};
V2_18_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspaceschemamanagermodule.WorkspaceSchemaManagerModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule
        ],
        providers: [
            _218workspacecommand1810000005000addmessageisdraftfieldcommand.AddMessageIsDraftFieldCommand,
            _218workspacecommand1799200000000normalizelegacyindexnamescommand.NormalizeLegacyIndexNamesCommand,
            _218workspacecommand1799200001000recomputesearchvectorscommand.RecomputeSearchVectorsCommand
        ]
    })
], V2_18_UpgradeVersionCommandModule);

//# sourceMappingURL=2-18-upgrade-version-command.module.js.map