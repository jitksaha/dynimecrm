"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getnextstepidsforiteratorutil = require("../get-next-step-ids-for-iterator.util");
const iteratorStep = {
    id: 'iterator',
    type: 'ITERATOR',
    name: 'Iterator',
    nextStepIds: [
        'afterLoop'
    ],
    settings: {
        input: {
            initialLoopStepIds: [
                'loopBody'
            ]
        }
    }
};
describe('getNextStepIdsForIterator', ()=>{
    it('should run the loop body while items remain', ()=>{
        expect((0, _getnextstepidsforiteratorutil.getNextStepIdsForIterator)({
            executedStep: iteratorStep,
            executedStepOutput: {
                result: {
                    hasProcessedAllItems: false
                }
            }
        })).toEqual({
            nextStepIdsToExecute: [
                'loopBody'
            ]
        });
    });
    it('should fall through to the after-loop steps once every item is processed', ()=>{
        expect((0, _getnextstepidsforiteratorutil.getNextStepIdsForIterator)({
            executedStep: iteratorStep,
            executedStepOutput: {
                result: {
                    hasProcessedAllItems: true
                }
            }
        })).toBeUndefined();
    });
    // A terminated iterator has to hand its after-loop steps back too, otherwise a step
    // converging on them is never evaluated again once its other parent has finished.
    it('should skip the loop body and still evaluate the after-loop steps when skipped', ()=>{
        expect((0, _getnextstepidsforiteratorutil.getNextStepIdsForIterator)({
            executedStep: iteratorStep,
            executedStepOutput: {
                shouldSkipStepExecution: true
            }
        })).toEqual({
            nextStepIdsToSkip: [
                'loopBody'
            ],
            nextStepIdsToExecute: [
                'afterLoop'
            ]
        });
    });
    it('should fail the loop body safely and still evaluate the after-loop steps', ()=>{
        expect((0, _getnextstepidsforiteratorutil.getNextStepIdsForIterator)({
            executedStep: iteratorStep,
            executedStepOutput: {
                shouldFailSafely: true
            }
        })).toEqual({
            nextStepIdsToFailSafely: [
                'loopBody'
            ],
            nextStepIdsToExecute: [
                'afterLoop'
            ]
        });
    });
});

//# sourceMappingURL=get-next-step-ids-for-iterator.util.spec.js.map