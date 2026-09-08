"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _computecoreworkflowstatusesutil = require("../compute-core-workflow-statuses.util");
describe('computeCoreWorkflowStatuses', ()=>{
    it('should return an empty list when the workflow has no non-archived version', ()=>{
        expect((0, _computecoreworkflowstatusesutil.computeCoreWorkflowStatuses)({
            hasDraftVersion: false,
            hasActiveVersion: false,
            hasDeactivatedVersion: false
        })).toEqual([]);
    });
    it('should return DRAFT then ACTIVE, and hide DEACTIVATED behind an active version', ()=>{
        expect((0, _computecoreworkflowstatusesutil.computeCoreWorkflowStatuses)({
            hasDraftVersion: true,
            hasActiveVersion: true,
            hasDeactivatedVersion: true
        })).toEqual([
            'DRAFT',
            'ACTIVE'
        ]);
    });
    it('should return DEACTIVATED only when no version is active', ()=>{
        expect((0, _computecoreworkflowstatusesutil.computeCoreWorkflowStatuses)({
            hasDraftVersion: false,
            hasActiveVersion: false,
            hasDeactivatedVersion: true
        })).toEqual([
            'DEACTIVATED'
        ]);
    });
    it('should return only the statuses that are present', ()=>{
        expect((0, _computecoreworkflowstatusesutil.computeCoreWorkflowStatuses)({
            hasDraftVersion: false,
            hasActiveVersion: true,
            hasDeactivatedVersion: false
        })).toEqual([
            'ACTIVE'
        ]);
        expect((0, _computecoreworkflowstatusesutil.computeCoreWorkflowStatuses)({
            hasDraftVersion: true,
            hasActiveVersion: false,
            hasDeactivatedVersion: true
        })).toEqual([
            'DRAFT',
            'DEACTIVATED'
        ]);
    });
});

//# sourceMappingURL=compute-core-workflow-statuses.util.spec.js.map