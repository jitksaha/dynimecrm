"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _logicfunction = require("twenty-shared/logic-function");
const _throttlerexception = require("../../core-modules/throttler/throttler.exception");
const _globalexceptionhandlerutil = require("../global-exception-handler.util");
describe('shouldCaptureException', ()=>{
    it('does not capture an explicitly retryable logic function error', ()=>{
        expect((0, _globalexceptionhandlerutil.shouldCaptureException)(new _logicfunction.RetryableLogicFunctionError('The remote dependency is temporarily unavailable'))).toBe(false);
    });
    it('does not capture a rate-limit throttler exception', ()=>{
        expect((0, _globalexceptionhandlerutil.shouldCaptureException)(new _throttlerexception.ThrottlerException('Limit reached (30 tokens per 30000 ms)', _throttlerexception.ThrottlerExceptionCode.LIMIT_REACHED))).toBe(false);
    });
    it('continues to capture an unexpected error', ()=>{
        expect((0, _globalexceptionhandlerutil.shouldCaptureException)(new Error('Unexpected failure'))).toBe(true);
    });
});

//# sourceMappingURL=global-exception-handler.util.spec.js.map