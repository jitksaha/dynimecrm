"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _aiexception = require("../../../ai.exception");
const _maperrortostreamerrorutil = require("../map-error-to-stream-error.util");
describe('mapErrorToStreamError', ()=>{
    it('maps an AiException to its typed code and message', ()=>{
        const error = new _aiexception.AiException('No AI models are available. Configure at least one AI provider.', _aiexception.AiExceptionCode.API_KEY_NOT_CONFIGURED);
        expect((0, _maperrortostreamerrorutil.mapErrorToStreamError)(error)).toEqual({
            code: _aiexception.AiExceptionCode.API_KEY_NOT_CONFIGURED,
            message: 'No AI models are available. Configure at least one AI provider.'
        });
    });
    it('collapses a generic Error to the fallback code but keeps its message', ()=>{
        expect((0, _maperrortostreamerrorutil.mapErrorToStreamError)(new Error('Provider timed out'))).toEqual({
            code: _maperrortostreamerrorutil.STREAM_EXECUTION_FAILED_CODE,
            message: 'Provider timed out'
        });
    });
    it('handles non-Error values with a stable fallback', ()=>{
        expect((0, _maperrortostreamerrorutil.mapErrorToStreamError)('boom')).toEqual({
            code: _maperrortostreamerrorutil.STREAM_EXECUTION_FAILED_CODE,
            message: 'Stream execution failed'
        });
    });
    it('truncates oversized provider messages before they are persisted', ()=>{
        const result = (0, _maperrortostreamerrorutil.mapErrorToStreamError)(new Error('x'.repeat(10_000)));
        expect(result.code).toBe(_maperrortostreamerrorutil.STREAM_EXECUTION_FAILED_CODE);
        expect(result.message.length).toBe(2001);
        expect(result.message.endsWith('…')).toBe(true);
    });
    it('leaves short messages untouched', ()=>{
        expect((0, _maperrortostreamerrorutil.mapErrorToStreamError)(new Error('short')).message).toBe('short');
    });
});

//# sourceMappingURL=map-error-to-stream-error.util.spec.js.map