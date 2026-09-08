"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _computelogicfunctionexecutioncreditsmicroutil = require("../compute-logic-function-execution-credits-micro.util");
describe('computeLogicFunctionExecutionCreditsMicro', ()=>{
    it('charges the flat invocation fee plus duration', ()=>{
        expect((0, _computelogicfunctionexecutioncreditsmicroutil.computeLogicFunctionExecutionCreditsMicro)({
            durationMs: 1_000,
            isBillingExempt: false
        })).toEqual({
            invocationCreditsMicro: 100,
            durationCreditsMicro: 100,
            billedDurationMs: 1_000
        });
    });
    it('rounds duration credits down to the previous micro credit', ()=>{
        expect((0, _computelogicfunctionexecutioncreditsmicroutil.computeLogicFunctionExecutionCreditsMicro)({
            durationMs: 9,
            isBillingExempt: false
        })).toEqual({
            invocationCreditsMicro: 100,
            durationCreditsMicro: 0,
            billedDurationMs: 9
        });
        expect((0, _computelogicfunctionexecutioncreditsmicroutil.computeLogicFunctionExecutionCreditsMicro)({
            durationMs: 155,
            isBillingExempt: false
        })).toEqual({
            invocationCreditsMicro: 100,
            durationCreditsMicro: 15,
            billedDurationMs: 155
        });
    });
    it('charges no duration credits for a zero or negative duration', ()=>{
        expect((0, _computelogicfunctionexecutioncreditsmicroutil.computeLogicFunctionExecutionCreditsMicro)({
            durationMs: 0,
            isBillingExempt: false
        })).toEqual({
            invocationCreditsMicro: 100,
            durationCreditsMicro: 0,
            billedDurationMs: 0
        });
        expect((0, _computelogicfunctionexecutioncreditsmicroutil.computeLogicFunctionExecutionCreditsMicro)({
            durationMs: -5,
            isBillingExempt: false
        })).toEqual({
            invocationCreditsMicro: 100,
            durationCreditsMicro: 0,
            billedDurationMs: 0
        });
    });
    it('bills the full timeout duration of a timed out execution', ()=>{
        expect((0, _computelogicfunctionexecutioncreditsmicroutil.computeLogicFunctionExecutionCreditsMicro)({
            durationMs: 900_000,
            isBillingExempt: false
        })).toEqual({
            invocationCreditsMicro: 100,
            durationCreditsMicro: 90_000,
            billedDurationMs: 900_000
        });
    });
    it('charges nothing for billing-exempt applications', ()=>{
        expect((0, _computelogicfunctionexecutioncreditsmicroutil.computeLogicFunctionExecutionCreditsMicro)({
            durationMs: 5_000,
            isBillingExempt: true
        })).toEqual({
            invocationCreditsMicro: 0,
            durationCreditsMicro: 0,
            billedDurationMs: 0
        });
    });
});

//# sourceMappingURL=compute-logic-function-execution-credits-micro.util.spec.js.map