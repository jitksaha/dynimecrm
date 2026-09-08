"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workflow = require("twenty-shared/workflow");
const _geteffectiveparentstatusutil = require("../get-effective-parent-status.util");
const recordStep = {
    id: 'parent',
    type: 'RECORD_UPDATE',
    name: 'parent',
    nextStepIds: [
        'child'
    ],
    settings: {
        input: {}
    }
};
const ifElseStep = {
    id: 'ifElse',
    type: 'IF_ELSE',
    name: 'If/Else',
    nextStepIds: [],
    settings: {
        input: {
            branches: [
                {
                    id: 'ifBranch',
                    filterGroupId: 'fg',
                    nextStepIds: [
                        'ifChild'
                    ]
                },
                {
                    id: 'elseBranch',
                    nextStepIds: [
                        'elseChild'
                    ]
                }
            ],
            stepFilterGroups: [],
            stepFilters: []
        }
    }
};
describe('getEffectiveParentStatus', ()=>{
    it('should return the raw status for a non if/else parent', ()=>{
        const stepInfos = {
            parent: {
                status: _workflow.StepStatus.SUCCESS
            }
        };
        expect((0, _geteffectiveparentstatusutil.getEffectiveParentStatus)({
            parentStep: recordStep,
            childStepId: 'child',
            stepInfos
        })).toBe(_workflow.StepStatus.SUCCESS);
    });
    it('should return the raw status for the child on the branch that was taken', ()=>{
        const stepInfos = {
            ifElse: {
                status: _workflow.StepStatus.SUCCESS,
                result: {
                    matchingBranchId: 'ifBranch'
                }
            }
        };
        expect((0, _geteffectiveparentstatusutil.getEffectiveParentStatus)({
            parentStep: ifElseStep,
            childStepId: 'ifChild',
            stepInfos
        })).toBe(_workflow.StepStatus.SUCCESS);
    });
    it('should read as SKIPPED for the child on a branch that was not taken', ()=>{
        const stepInfos = {
            ifElse: {
                status: _workflow.StepStatus.SUCCESS,
                result: {
                    matchingBranchId: 'ifBranch'
                }
            }
        };
        expect((0, _geteffectiveparentstatusutil.getEffectiveParentStatus)({
            parentStep: ifElseStep,
            childStepId: 'elseChild',
            stepInfos
        })).toBe(_workflow.StepStatus.SKIPPED);
    });
    it('should return the raw status when the if/else has no matching branch (skipped/failed itself)', ()=>{
        const stepInfos = {
            ifElse: {
                status: _workflow.StepStatus.SKIPPED
            }
        };
        expect((0, _geteffectiveparentstatusutil.getEffectiveParentStatus)({
            parentStep: ifElseStep,
            childStepId: 'ifChild',
            stepInfos
        })).toBe(_workflow.StepStatus.SKIPPED);
    });
    it('should propagate FAILED_SAFELY to the child on the taken branch', ()=>{
        const stepInfos = {
            ifElse: {
                status: _workflow.StepStatus.FAILED_SAFELY,
                result: {
                    matchingBranchId: 'ifBranch'
                }
            }
        };
        expect((0, _geteffectiveparentstatusutil.getEffectiveParentStatus)({
            parentStep: ifElseStep,
            childStepId: 'ifChild',
            stepInfos
        })).toBe(_workflow.StepStatus.FAILED_SAFELY);
    });
    it('should return undefined when the parent has no status yet', ()=>{
        expect((0, _geteffectiveparentstatusutil.getEffectiveParentStatus)({
            parentStep: ifElseStep,
            childStepId: 'ifChild',
            stepInfos: {}
        })).toBeUndefined();
    });
});

//# sourceMappingURL=get-effective-parent-status.util.spec.js.map