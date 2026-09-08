/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingService", {
    enumerable: true,
    get: function() {
        return BillingService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _billingcustomerentity = require("../entities/billing-customer.entity");
const _billingsubscriptionentity = require("../entities/billing-subscription.entity");
const _billingproductservice = require("./billing-product.service");
const _billingsubscriptionservice = require("./billing-subscription.service");
const _stripecustomerservice = require("../stripe/services/stripe-customer.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let BillingService = class BillingService {
    isBillingEnabled() {
        return this.twentyConfigService.get('IS_BILLING_ENABLED');
    }
    async ensureBillingCustomer({ userEmail, workspaceId, workspaceDisplayName }) {
        const existingBillingCustomer = await this.billingCustomerRepository.findOne(workspaceId, {
            where: {}
        });
        if ((0, _utils.isDefined)(existingBillingCustomer)) {
            return;
        }
        await this.stripeCustomerService.createStripeCustomer(userEmail, workspaceId, workspaceDisplayName);
    }
    async hasWorkspaceAnySubscription(workspaceId) {
        const isBillingEnabled = this.isBillingEnabled();
        if (!isBillingEnabled) {
            return true;
        }
        const subscription = await this.billingSubscriptionRepository.findOne(workspaceId, {
            where: {}
        });
        return (0, _utils.isDefined)(subscription);
    }
    async hasEntitlement(workspaceId, entitlementKey) {
        const isBillingEnabled = this.isBillingEnabled();
        if (!isBillingEnabled) {
            return true;
        }
        return this.billingSubscriptionService.getWorkspaceEntitlementByKey(workspaceId, entitlementKey);
    }
    async isSubscriptionIncompleteOnboardingStatus(workspaceId) {
        const hasAnySubscription = await this.hasWorkspaceAnySubscription(workspaceId);
        return !hasAnySubscription;
    }
    constructor(twentyConfigService, billingSubscriptionService, billingProductService, stripeCustomerService, billingSubscriptionRepository, billingCustomerRepository){
        this.twentyConfigService = twentyConfigService;
        this.billingSubscriptionService = billingSubscriptionService;
        this.billingProductService = billingProductService;
        this.stripeCustomerService = stripeCustomerService;
        this.billingSubscriptionRepository = billingSubscriptionRepository;
        this.billingCustomerRepository = billingCustomerRepository;
        this.logger = new _common.Logger(BillingService.name);
    }
};
BillingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(4, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)),
    _ts_param(5, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_billingcustomerentity.BillingCustomerEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService,
        typeof _billingproductservice.BillingProductService === "undefined" ? Object : _billingproductservice.BillingProductService,
        typeof _stripecustomerservice.StripeCustomerService === "undefined" ? Object : _stripecustomerservice.StripeCustomerService,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository
    ])
], BillingService);

//# sourceMappingURL=billing.service.js.map