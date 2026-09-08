"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getStuckRunningRunsFindOptions", {
    enumerable: true,
    get: function() {
        return getStuckRunningRunsFindOptions;
    }
});
const _typeorm = require("typeorm");
const _workflowrunworkspaceentity = require("../../../common/standard-objects/workflow-run.workspace-entity");
const _stuckrunningrunsthreshold = require("../constants/stuck-running-runs-threshold");
const getStuckRunningRunsFindOptions = ()=>{
    const thresholdDate = new Date(Date.now() - _stuckrunningrunsthreshold.STUCK_RUNNING_RUNS_THRESHOLD_MS);
    return {
        status: _workflowrunworkspaceentity.WorkflowRunStatus.RUNNING,
        updatedAt: (0, _typeorm.LessThan)(thresholdDate.toISOString())
    };
};

//# sourceMappingURL=get-stuck-running-runs-find-options.util.js.map