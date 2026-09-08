"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isretryablelogicfunctionexecutionerrorutil = require("../is-retryable-logic-function-execution-error.util");
describe('isRetryableLogicFunctionExecutionError', ()=>{
    it('returns true for an explicitly retryable logic function error', ()=>{
        expect((0, _isretryablelogicfunctionexecutionerrorutil.isRetryableLogicFunctionExecutionError)({
            errorType: 'RetryableLogicFunctionError',
            errorMessage: 'The remote dependency is temporarily unavailable',
            stackTrace: []
        })).toBe(true);
    });
    it('returns false for an ordinary logic function error', ()=>{
        expect((0, _isretryablelogicfunctionexecutionerrorutil.isRetryableLogicFunctionExecutionError)({
            errorType: 'TypeError',
            errorMessage: 'Cannot read properties of undefined',
            stackTrace: []
        })).toBe(false);
    });
    it('returns false when the execution has no error', ()=>{
        expect((0, _isretryablelogicfunctionexecutionerrorutil.isRetryableLogicFunctionExecutionError)(undefined)).toBe(false);
    });
});

//# sourceMappingURL=is-retryable-logic-function-execution-error.util.spec.js.map