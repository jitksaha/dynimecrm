"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowCoreConsistencyModule", {
    enumerable: true,
    get: function() {
        return WorkflowCoreConsistencyModule;
    }
});
const _common = require("@nestjs/common");
const _workspaceiteratormodule = require("../../../database/commands/command-runners/workspace-iterator.module");
const _metricsmodule = require("../../../engine/core-modules/metrics/metrics.module");
const _workspacecachemodule = require("../../../engine/workspace-cache/workspace-cache.module");
const _workflowcoreconsistencycroncommand = require("./crons/commands/workflow-core-consistency-cron.command");
const _workflowcoreconsistencycronjob = require("./crons/jobs/workflow-core-consistency-cron.job");
const _workflowcoreconsistencyservice = require("./services/workflow-core-consistency.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WorkflowCoreConsistencyModule = class WorkflowCoreConsistencyModule {
};
WorkflowCoreConsistencyModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _metricsmodule.MetricsModule,
            _workspacecachemodule.WorkspaceCacheModule
        ],
        providers: [
            _workflowcoreconsistencyservice.WorkflowCoreConsistencyService,
            _workflowcoreconsistencycronjob.WorkflowCoreConsistencyCronJob,
            _workflowcoreconsistencycroncommand.WorkflowCoreConsistencyCronCommand
        ],
        exports: [
            _workflowcoreconsistencycroncommand.WorkflowCoreConsistencyCronCommand
        ]
    })
], WorkflowCoreConsistencyModule);

//# sourceMappingURL=workflow-core-consistency.module.js.map