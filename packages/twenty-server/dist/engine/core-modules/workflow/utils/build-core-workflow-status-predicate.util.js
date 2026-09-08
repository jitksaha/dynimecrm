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
    get CORE_WORKFLOW_HAS_ANY_STATUS_PREDICATE () {
        return CORE_WORKFLOW_HAS_ANY_STATUS_PREDICATE;
    },
    get buildCoreWorkflowHasAnyOfStatusesPredicate () {
        return buildCoreWorkflowHasAnyOfStatusesPredicate;
    }
});
const _workflowworkspaceentity = require("../../../../modules/workflow/common/standard-objects/workflow.workspace-entity");
const HAS_DRAFT_VERSION = `coalesce(bool_or(v.status = 'DRAFT'), false)`;
const HAS_ACTIVE_VERSION = `coalesce(bool_or(v.status = 'ACTIVE'), false)`;
const HAS_DEACTIVATED_VERSION = `coalesce(bool_or(v.status = 'DEACTIVATED'), false)`;
const STATUS_PREDICATE_BY_STATUS = {
    [_workflowworkspaceentity.WorkflowStatus.DRAFT]: HAS_DRAFT_VERSION,
    [_workflowworkspaceentity.WorkflowStatus.ACTIVE]: HAS_ACTIVE_VERSION,
    [_workflowworkspaceentity.WorkflowStatus.DEACTIVATED]: `(NOT ${HAS_ACTIVE_VERSION} AND ${HAS_DEACTIVATED_VERSION})`
};
const buildCoreWorkflowHasAnyOfStatusesPredicate = (statuses)=>`(${statuses.map((status)=>STATUS_PREDICATE_BY_STATUS[status]).join(' OR ')})`;
const CORE_WORKFLOW_HAS_ANY_STATUS_PREDICATE = buildCoreWorkflowHasAnyOfStatusesPredicate(Object.values(_workflowworkspaceentity.WorkflowStatus));

//# sourceMappingURL=build-core-workflow-status-predicate.util.js.map