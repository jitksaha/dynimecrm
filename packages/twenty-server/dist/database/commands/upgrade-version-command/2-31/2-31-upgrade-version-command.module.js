"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_31_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_31_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _231workspacecommand1786437483000addcalendareventcallrecordingtabcommand = require("./2-31-workspace-command-1786437483000-add-calendar-event-call-recording-tab.command");
const _231workspacecommand1786437481000reconcilestandardrecordpagecommand = require("./2-31-workspace-command-1786437481000-reconcile-standard-record-page.command");
const _231workspacecommand1786437481500reconcileworkspacecustomrecordpagecommand = require("./2-31-workspace-command-1786437481500-reconcile-workspace-custom-record-page.command");
const _231workspacecommand1786437482000backfillrecordpagecommand = require("./2-31-workspace-command-1786437482000-backfill-record-page.command");
const _231workspacecommand1786456707000trimmessagecampaignrecordpagecommand = require("./2-31-workspace-command-1786456707000-trim-message-campaign-record-page.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
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
let V2_31_UpgradeVersionCommandModule = class V2_31_UpgradeVersionCommandModule {
};
V2_31_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _viewentity.ViewEntity
            ]),
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule
        ],
        providers: [
            _231workspacecommand1786437483000addcalendareventcallrecordingtabcommand.AddCalendarEventCallRecordingTabCommand,
            _231workspacecommand1786437481000reconcilestandardrecordpagecommand.ReconcileStandardRecordPageCommand,
            _231workspacecommand1786437481500reconcileworkspacecustomrecordpagecommand.ReconcileWorkspaceCustomRecordPageCommand,
            _231workspacecommand1786437482000backfillrecordpagecommand.BackfillRecordPageCommand,
            _231workspacecommand1786456707000trimmessagecampaignrecordpagecommand.TrimMessageCampaignRecordPageCommand
        ]
    })
], V2_31_UpgradeVersionCommandModule);

//# sourceMappingURL=2-31-upgrade-version-command.module.js.map