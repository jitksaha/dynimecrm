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
    get WorkflowStatus () {
        return WorkflowStatus;
    },
    get WorkflowWorkspaceEntity () {
        return WorkflowWorkspaceEntity;
    }
});
const _baseworkspaceentity = require("../../../../engine/twenty-orm/base.workspace-entity");
var WorkflowStatus = /*#__PURE__*/ function(WorkflowStatus) {
    WorkflowStatus["DRAFT"] = "DRAFT";
    WorkflowStatus["ACTIVE"] = "ACTIVE";
    WorkflowStatus["DEACTIVATED"] = "DEACTIVATED";
    return WorkflowStatus;
}({});
let WorkflowWorkspaceEntity = class WorkflowWorkspaceEntity extends _baseworkspaceentity.BaseWorkspaceEntity {
};

//# sourceMappingURL=workflow.workspace-entity.js.map