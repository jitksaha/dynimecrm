"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getStuckStoppingRunsFindOptions", {
    enumerable: true,
    get: function() {
        return getStuckStoppingRunsFindOptions;
    }
});
const _typeorm = require("typeorm");
const _workflowrunworkspaceentity = require("../../../common/standard-objects/workflow-run.workspace-entity");
const _stuckstoppingrunsthreshold = require("../constants/stuck-stopping-runs-threshold");
const getStuckStoppingRunsFindOptions = ()=>{
    const thresholdDate = new Date(Date.now() - _stuckstoppingrunsthreshold.STUCK_STOPPING_RUNS_THRESHOLD_MS);
    return {
        status: _workflowrunworkspaceentity.WorkflowRunStatus.STOPPING,
        updatedAt: (0, _typeorm.LessThan)(thresholdDate.toISOString())
    };
};

//# sourceMappingURL=get-stuck-stopping-runs-find-options.util.js.map