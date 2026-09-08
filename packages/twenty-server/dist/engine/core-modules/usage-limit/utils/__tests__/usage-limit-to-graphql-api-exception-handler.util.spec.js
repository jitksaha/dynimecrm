"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _graphqlerrorsutil = require("../../../graphql/utils/graphql-errors.util");
const _usageresourcetypeenum = require("../../../usage/enums/usage-resource-type.enum");
const _usagelimitexception = require("../../exceptions/usage-limit.exception");
const _usagelimittographqlapiexceptionhandlerutil = require("../usage-limit-to-graphql-api-exception-handler.util");
const _globalexceptionhandlerutil = require("../../../../utils/global-exception-handler.util");
const buildExhaustedScope = (overrides = {})=>({
        resourceType: _usageresourcetypeenum.UsageResourceType.API,
        limitKind: 'speed',
        spenderType: 'apiKey',
        spenderId: 'key-1',
        limitValue: 3,
        remaining: 0,
        windowSeconds: 60,
        retryAfterMs: 11983,
        isFallback: true,
        ...overrides
    });
const catchThrown = (exhaustedScope)=>{
    try {
        (0, _usagelimittographqlapiexceptionhandlerutil.usageLimitToGraphqlApiExceptionHandler)(new _usagelimitexception.UsageLimitException('Rate limit exceeded for apiKey: 3 requests per 60s.', _usagelimitexception.UsageLimitExceptionCode.RATE_LIMITED, {
            exhaustedScope
        }));
    } catch (error) {
        return error;
    }
    throw new Error('the handler was expected to throw');
};
describe('usageLimitToGraphqlApiExceptionHandler', ()=>{
    it('raises a BaseGraphQLError so the code survives error normalisation', ()=>{
        const error = catchThrown(buildExhaustedScope());
        expect(error).toBeInstanceOf(_graphqlerrorsutil.BaseGraphQLError);
        expect(error.extensions.code).toBe(_graphqlerrorsutil.ErrorCode.RATE_LIMITED);
    });
    it('keeps transport concerns out of the GraphQL error', ()=>{
        expect(catchThrown(buildExhaustedScope()).extensions.http).toBeUndefined();
    });
    it('reports the exhausted scope back to the caller', ()=>{
        const error = catchThrown(buildExhaustedScope());
        expect(error.extensions).toMatchObject({
            limitKind: 'speed',
            limit: 3,
            remaining: 0,
            windowSeconds: 60,
            retryAfterMs: 11983,
            scope: {
                spenderType: 'apiKey',
                spenderId: 'key-1'
            }
        });
    });
    it('keeps a denial out of Sentry', ()=>{
        expect((0, _globalexceptionhandlerutil.shouldCaptureException)(catchThrown(buildExhaustedScope()))).toBe(false);
    });
    it('still names the code when no scope was resolved', ()=>{
        expect(catchThrown(undefined).extensions.code).toBe(_graphqlerrorsutil.ErrorCode.RATE_LIMITED);
    });
    it('names an exhausted quota apart from an exhausted rate', ()=>{
        try {
            (0, _usagelimittographqlapiexceptionhandlerutil.usageLimitToGraphqlApiExceptionHandler)(new _usagelimitexception.UsageLimitException('Usage quota exhausted.', _usagelimitexception.UsageLimitExceptionCode.QUOTA_EXHAUSTED, {
                exhaustedScope: buildExhaustedScope()
            }));
        } catch (error) {
            expect(error.extensions.code).toBe(_graphqlerrorsutil.ErrorCode.QUOTA_EXHAUSTED);
        }
    });
});

//# sourceMappingURL=usage-limit-to-graphql-api-exception-handler.util.spec.js.map