"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingDomainGraphqlApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return EmailingDomainGraphqlApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _emailingdomainexception = require("../exceptions/emailing-domain.exception");
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let EmailingDomainGraphqlApiExceptionFilter = class EmailingDomainGraphqlApiExceptionFilter {
    catch(exception) {
        switch(exception.code){
            case _emailingdomainexception.EmailingDomainExceptionCode.EMAILING_DOMAIN_ALREADY_REGISTERED:
                throw new _graphqlerrorsutil.ConflictError(exception);
            case _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_SUPPRESSION_NOT_FOUND:
                throw new _graphqlerrorsutil.NotFoundError(exception);
            case _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_SUPPRESSION_NOT_REMOVABLE:
                throw new _graphqlerrorsutil.ForbiddenError(exception);
            case _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_FOUND:
                throw new _graphqlerrorsutil.NotFoundError(exception);
            case _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_INSUFFICIENT_CREDITS:
            case _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_SENDABLE:
            case _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_CANCELABLE:
            case _emailingdomainexception.EmailingDomainExceptionCode.EMAILING_DOMAIN_UNSUBSCRIBE_NOT_READY:
            case _emailingdomainexception.EmailingDomainExceptionCode.EMAILING_DOMAIN_NOT_VERIFIED:
                throw new _graphqlerrorsutil.UserInputError(exception);
            default:
                {
                    (0, _utils.assertUnreachable)(exception.code);
                }
        }
    }
};
EmailingDomainGraphqlApiExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_emailingdomainexception.EmailingDomainException)
], EmailingDomainGraphqlApiExceptionFilter);

//# sourceMappingURL=emailing-domain-graphql-api-exception.filter.js.map