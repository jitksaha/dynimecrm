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
    get WorkflowVersionStatus () {
        return WorkflowVersionStatus;
    },
    get WorkflowVersionWorkspaceEntity () {
        return WorkflowVersionWorkspaceEntity;
    }
});
const _baseworkspaceentity = require("../../../../engine/twenty-orm/base.workspace-entity");
var WorkflowVersionStatus = /*#__PURE__*/ function(WorkflowVersionStatus) {
    WorkflowVersionStatus["DRAFT"] = "DRAFT";
    WorkflowVersionStatus["ACTIVE"] = "ACTIVE";
    WorkflowVersionStatus["DEACTIVATED"] = "DEACTIVATED";
    WorkflowVersionStatus["ARCHIVED"] = "ARCHIVED";
    return WorkflowVersionStatus;
}({});
let WorkflowVersionWorkspaceEntity = class WorkflowVersionWorkspaceEntity extends _baseworkspaceentity.BaseWorkspaceEntity {
};

//# sourceMappingURL=workflow-version.workspace-entity.js.map