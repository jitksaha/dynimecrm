"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AwsSesHandleErrorService", {
    enumerable: true,
    get: function() {
        return AwsSesHandleErrorService;
    }
});
const _common = require("@nestjs/common");
const _getawssesdriverexceptioncodeutil = require("../utils/get-aws-ses-driver-exception-code.util");
const _emailingdomaindriverexception = require("../../exceptions/emailing-domain-driver.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AwsSesHandleErrorService = class AwsSesHandleErrorService {
    handleAwsSesError(error, context) {
        const name = error?.name ?? 'UnknownError';
        const message = error?.message ?? 'No message';
        const suffix = context ? ` (${context})` : '';
        const code = (0, _getawssesdriverexceptioncodeutil.getAwsSesDriverExceptionCode)(error);
        switch(code){
            case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR:
                throw new _emailingdomaindriverexception.EmailingDomainDriverException(`AWS SES temporary error${suffix}: ${message}`, code);
            case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.INSUFFICIENT_PERMISSIONS:
                throw new _emailingdomaindriverexception.EmailingDomainDriverException(`AWS SES insufficient permissions${suffix}: ${message}`, code);
            case _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.CONFIGURATION_ERROR:
                throw new _emailingdomaindriverexception.EmailingDomainDriverException(`AWS SES configuration error${suffix}: ${message}`, code);
            default:
                throw new _emailingdomaindriverexception.EmailingDomainDriverException(`AWS SES error${suffix}: ${name} - ${message}`, _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.UNKNOWN);
        }
    }
};
AwsSesHandleErrorService = _ts_decorate([
    (0, _common.Injectable)()
], AwsSesHandleErrorService);

//# sourceMappingURL=aws-ses-handle-error.service.js.map