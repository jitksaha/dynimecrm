"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get WorkflowRunStatus () {
        return WorkflowRunStatus;
    },
    get WorkflowRunWorkspaceEntity () {
        return WorkflowRunWorkspaceEntity;
    }
});
const _graphql = require("@nestjs/graphql");
const _baseworkspaceentity = require("../../../../engine/twenty-orm/base.workspace-entity");
var WorkflowRunStatus = /*#__PURE__*/ function(WorkflowRunStatus) {
    WorkflowRunStatus["NOT_STARTED"] = "NOT_STARTED";
    WorkflowRunStatus["RUNNING"] = "RUNNING";
    WorkflowRunStatus["COMPLETED"] = "COMPLETED";
    WorkflowRunStatus["FAILED"] = "FAILED";
    WorkflowRunStatus["ENQUEUED"] = "ENQUEUED";
    WorkflowRunStatus["STOPPING"] = "STOPPING";
    WorkflowRunStatus["STOPPED"] = "STOPPED";
    return WorkflowRunStatus;
}({});
(0, _graphql.registerEnumType)(WorkflowRunStatus, {
    name: 'WorkflowRunStatusEnum',
    description: 'Status of the workflow run'
});
let WorkflowRunWorkspaceEntity = class WorkflowRunWorkspaceEntity extends _baseworkspaceentity.BaseWorkspaceEntity {
};

//# sourceMappingURL=workflow-run.workspace-entity.js.map