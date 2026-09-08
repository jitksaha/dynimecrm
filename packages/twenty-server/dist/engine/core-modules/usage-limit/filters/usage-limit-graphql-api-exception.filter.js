"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageLimitGraphqlApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return UsageLimitGraphqlApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
const _usagelimitexception = require("../exceptions/usage-limit.exception");
const _usagelimittographqlapiexceptionhandlerutil = require("../utils/usage-limit-to-graphql-api-exception-handler.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UsageLimitGraphqlApiExceptionFilter = class UsageLimitGraphqlApiExceptionFilter {
    catch(exception) {
        switch(exception.code){
            case _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID:
                throw new _graphqlerrorsutil.UserInputError(exception);
            case _usagelimitexception.UsageLimitExceptionCode.RATE_LIMITED:
            case _usagelimitexception.UsageLimitExceptionCode.QUOTA_EXHAUSTED:
                return (0, _usagelimittographqlapiexceptionhandlerutil.usageLimitToGraphqlApiExceptionHandler)(exception);
            default:
                (0, _utils.assertUnreachable)(exception.code);
        }
    }
};
UsageLimitGraphqlApiExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_usagelimitexception.UsageLimitException)
], UsageLimitGraphqlApiExceptionFilter);

//# sourceMappingURL=usage-limit-graphql-api-exception.filter.js.map