/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailGroupAccessGraphqlApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return EmailGroupAccessGraphqlApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _emailgroupaccessexception = require("../exceptions/email-group-access.exception");
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let EmailGroupAccessGraphqlApiExceptionFilter = class EmailGroupAccessGraphqlApiExceptionFilter {
    catch(exception) {
        switch(exception.code){
            case _emailgroupaccessexception.EmailGroupAccessExceptionCode.EMAIL_GROUP_ENTERPRISE_PLAN_REQUIRED:
                throw new _graphqlerrorsutil.ForbiddenError(exception);
            case _emailgroupaccessexception.EmailGroupAccessExceptionCode.INTERNAL_SERVER_ERROR:
                throw new _graphqlerrorsutil.InternalServerError(exception);
            default:
                {
                    (0, _utils.assertUnreachable)(exception.code);
                }
        }
    }
};
EmailGroupAccessGraphqlApiExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_emailgroupaccessexception.EmailGroupAccessException)
], EmailGroupAccessGraphqlApiExceptionFilter);

//# sourceMappingURL=email-group-access-graphql-api-exception.filter.js.map