"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workflowworkspaceentity = require("../../../../../modules/workflow/common/standard-objects/workflow.workspace-entity");
const _buildcoreworkflowstatuspredicateutil = require("../build-core-workflow-status-predicate.util");
describe('buildCoreWorkflowHasAnyOfStatusesPredicate', ()=>{
    it('should build a single predicate per requested status', ()=>{
        expect((0, _buildcoreworkflowstatuspredicateutil.buildCoreWorkflowHasAnyOfStatusesPredicate)([
            _workflowworkspaceentity.WorkflowStatus.DRAFT
        ])).toBe(`(coalesce(bool_or(v.status = 'DRAFT'), false))`);
        expect((0, _buildcoreworkflowstatuspredicateutil.buildCoreWorkflowHasAnyOfStatusesPredicate)([
            _workflowworkspaceentity.WorkflowStatus.DEACTIVATED
        ])).toBe(`((NOT coalesce(bool_or(v.status = 'ACTIVE'), false) AND coalesce(bool_or(v.status = 'DEACTIVATED'), false)))`);
    });
    it('should join multiple requested statuses with OR', ()=>{
        expect((0, _buildcoreworkflowstatuspredicateutil.buildCoreWorkflowHasAnyOfStatusesPredicate)([
            _workflowworkspaceentity.WorkflowStatus.DRAFT,
            _workflowworkspaceentity.WorkflowStatus.ACTIVE
        ])).toBe(`(coalesce(bool_or(v.status = 'DRAFT'), false) OR coalesce(bool_or(v.status = 'ACTIVE'), false))`);
    });
    it('should expose a predicate covering every status', ()=>{
        expect(_buildcoreworkflowstatuspredicateutil.CORE_WORKFLOW_HAS_ANY_STATUS_PREDICATE).toBe(`(coalesce(bool_or(v.status = 'DRAFT'), false) OR coalesce(bool_or(v.status = 'ACTIVE'), false) OR (NOT coalesce(bool_or(v.status = 'ACTIVE'), false) AND coalesce(bool_or(v.status = 'DEACTIVATED'), false)))`);
    });
});

//# sourceMappingURL=build-core-workflow-status-predicate.util.spec.js.map