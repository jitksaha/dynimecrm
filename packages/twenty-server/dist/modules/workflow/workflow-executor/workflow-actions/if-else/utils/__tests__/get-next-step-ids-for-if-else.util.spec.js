"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getnextstepidsforifelseutil = require("../get-next-step-ids-for-if-else.util");
const buildIfElseStep = (branchNextStepIds)=>({
        id: 'ifElse',
        type: 'IF_ELSE',
        name: 'If/Else',
        nextStepIds: [],
        settings: {
            input: {
                branches: branchNextStepIds.map((nextStepIds, index)=>({
                        id: `branch-${index}`,
                        filterGroupId: index === branchNextStepIds.length - 1 ? undefined : 'fg',
                        nextStepIds
                    })),
                stepFilterGroups: [],
                stepFilters: []
            }
        }
    });
describe('getNextStepIdsForIfElse', ()=>{
    it('should hand back every branch root so each one evaluates itself', ()=>{
        expect((0, _getnextstepidsforifelseutil.getNextStepIdsForIfElse)({
            executedStep: buildIfElseStep([
                [
                    'ifStep'
                ],
                [
                    'elseIfStep'
                ],
                [
                    'elseStep'
                ]
            ])
        })).toEqual({
            nextStepIdsToExecute: [
                'ifStep',
                'elseIfStep',
                'elseStep'
            ]
        });
    });
    it('should hand back a root shared by several branches only once', ()=>{
        expect((0, _getnextstepidsforifelseutil.getNextStepIdsForIfElse)({
            executedStep: buildIfElseStep([
                [
                    'merge'
                ],
                [
                    'merge'
                ]
            ])
        })).toEqual({
            nextStepIdsToExecute: [
                'merge'
            ]
        });
    });
    it('should ignore a branch with no next step', ()=>{
        expect((0, _getnextstepidsforifelseutil.getNextStepIdsForIfElse)({
            executedStep: buildIfElseStep([
                [
                    'ifStep'
                ],
                []
            ])
        })).toEqual({
            nextStepIdsToExecute: [
                'ifStep'
            ]
        });
    });
});

//# sourceMappingURL=get-next-step-ids-for-if-else.util.spec.js.map