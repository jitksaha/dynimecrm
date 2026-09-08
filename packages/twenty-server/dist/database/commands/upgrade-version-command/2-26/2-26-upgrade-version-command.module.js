"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_26_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_26_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _226workspacecommand1785255689000reconcileindexviewuniversalidentifiercommand = require("./2-26-workspace-command-1785255689000-reconcile-index-view-universal-identifier.command");
const _226workspacecommand1785255690000demoteandbackfillapplicationindexviewcommand = require("./2-26-workspace-command-1785255690000-demote-and-backfill-application-index-view.command");
const _226workspacecommand1785334800000addnotrecordedcallrecordingstatuscommand = require("./2-26-workspace-command-1785334800000-add-not-recorded-call-recording-status.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _fieldmetadataentity = require("../../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _viewentity = require("../../../../engine/metadata-modules/view/entities/view.entity");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationrunnermodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_26_UpgradeVersionCommandModule = class V2_26_UpgradeVersionCommandModule {
};
V2_26_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _fieldmetadataentity.FieldMetadataEntity,
                _viewentity.ViewEntity
            ]),
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _workspaceiteratormodule.WorkspaceIteratorModule
        ],
        providers: [
            _226workspacecommand1785255689000reconcileindexviewuniversalidentifiercommand.ReconcileIndexViewUniversalIdentifierCommand,
            _226workspacecommand1785255690000demoteandbackfillapplicationindexviewcommand.DemoteAndBackfillApplicationIndexViewCommand,
            _226workspacecommand1785334800000addnotrecordedcallrecordingstatuscommand.AddNotRecordedCallRecordingStatusCommand
        ]
    })
], V2_26_UpgradeVersionCommandModule);

//# sourceMappingURL=2-26-upgrade-version-command.module.js.map