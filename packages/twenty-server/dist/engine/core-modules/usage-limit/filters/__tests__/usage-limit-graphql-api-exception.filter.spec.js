"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _graphqlerrorsutil = require("../../../graphql/utils/graphql-errors.util");
const _usagelimitexception = require("../../exceptions/usage-limit.exception");
const _usagelimitgraphqlapiexceptionfilter = require("../usage-limit-graphql-api-exception.filter");
const catchAsGraphQLError = (exception)=>{
    const filter = new _usagelimitgraphqlapiexceptionfilter.UsageLimitGraphqlApiExceptionFilter();
    try {
        filter.catch(exception);
    } catch (graphqlError) {
        return graphqlError;
    }
    throw new Error('UsageLimitGraphqlApiExceptionFilter did not throw');
};
describe('UsageLimitGraphqlApiExceptionFilter', ()=>{
    it('surfaces an invalid limit rule as a user input error rather than a server error', ()=>{
        const graphqlError = catchAsGraphQLError(new _usagelimitexception.UsageLimitException('API speed limits cannot target the EMAIL_SEND operation', _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID));
        expect(graphqlError.extensions.code).toBe(_graphqlerrorsutil.ErrorCode.BAD_USER_INPUT);
        expect(graphqlError.message).toBe('API speed limits cannot target the EMAIL_SEND operation');
    });
    it('surfaces an exhausted quota through the shared enforcement mapping', ()=>{
        const graphqlError = catchAsGraphQLError(new _usagelimitexception.UsageLimitException('Quota exhausted', _usagelimitexception.UsageLimitExceptionCode.QUOTA_EXHAUSTED));
        expect(graphqlError.extensions.code).toBe(_graphqlerrorsutil.ErrorCode.QUOTA_EXHAUSTED);
    });
});

//# sourceMappingURL=usage-limit-graphql-api-exception.filter.spec.js.map