"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V2_36_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V2_36_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../command-runners/workspace-iterator.module");
const _236workspacecommand1787748136000addworkflowruncoreidfieldscommand = require("./2-36-workspace-command-1787748136000-add-workflow-run-core-id-fields.command");
const _236workspacecommand1787748136001backfillworkflowruncoreidscommand = require("./2-36-workspace-command-1787748136001-backfill-workflow-run-core-ids.command");
const _236workspacecommand1787700000000rewriteisnotnullworkflowfilteroperandscommand = require("./2-36-workspace-command-1787700000000-rewrite-is-not-null-workflow-filter-operands.command");
const _236workspacecommand1787746350922addcallrecordingsummaryandtranscripttabscommand = require("./2-36-workspace-command-1787746350922-add-call-recording-summary-and-transcript-tabs.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V2_36_UpgradeVersionCommandModule = class V2_36_UpgradeVersionCommandModule {
};
V2_36_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspacemigrationmodule.WorkspaceMigrationModule
        ],
        providers: [
            _236workspacecommand1787700000000rewriteisnotnullworkflowfilteroperandscommand.RewriteIsNotNullWorkflowFilterOperandsCommand,
            _236workspacecommand1787746350922addcallrecordingsummaryandtranscripttabscommand.AddCallRecordingSummaryAndTranscriptTabsCommand,
            _236workspacecommand1787748136000addworkflowruncoreidfieldscommand.AddWorkflowRunCoreIdFieldsCommand,
            _236workspacecommand1787748136001backfillworkflowruncoreidscommand.BackfillWorkflowRunCoreIdsCommand
        ]
    })
], V2_36_UpgradeVersionCommandModule);

//# sourceMappingURL=2-36-upgrade-version-command.module.js.map