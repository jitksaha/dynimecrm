/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailGroupAccessService", {
    enumerable: true,
    get: function() {
        return EmailGroupAccessService;
    }
});
const _common = require("@nestjs/common");
const _billingservice = require("../../billing/services/billing.service");
const _emailgroupaccessexception = require("../exceptions/email-group-access.exception");
const _communityemailingdomaindriversconstant = require("../constants/community-emailing-domain-drivers.constant");
const _enterpriseplanservice = require("../../enterprise/services/enterprise-plan.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EmailGroupAccessService = class EmailGroupAccessService {
    validateEmailGroupAccessOrThrow() {
        if (this.billingService.isBillingEnabled()) {
            return;
        }
        if (_communityemailingdomaindriversconstant.COMMUNITY_EMAILING_DOMAIN_DRIVERS.includes(this.twentyConfigService.get('EMAILING_DOMAIN_DRIVER'))) {
            return;
        }
        if (!this.enterprisePlanService.isValid()) {
            throw new _emailgroupaccessexception.EmailGroupAccessException('Email group requires an Enterprise plan', _emailgroupaccessexception.EmailGroupAccessExceptionCode.EMAIL_GROUP_ENTERPRISE_PLAN_REQUIRED);
        }
    }
    constructor(billingService, enterprisePlanService, twentyConfigService){
        this.billingService = billingService;
        this.enterprisePlanService = enterprisePlanService;
        this.twentyConfigService = twentyConfigService;
    }
};
EmailGroupAccessService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingservice.BillingService === "undefined" ? Object : _billingservice.BillingService,
        typeof _enterpriseplanservice.EnterprisePlanService === "undefined" ? Object : _enterpriseplanservice.EnterprisePlanService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], EmailGroupAccessService);

//# sourceMappingURL=email-group-access.service.js.map