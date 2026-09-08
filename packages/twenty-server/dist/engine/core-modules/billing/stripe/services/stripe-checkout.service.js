/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StripeCheckoutService", {
    enumerable: true,
    get: function() {
        return StripeCheckoutService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _billingplankeyenum = require("../../enums/billing-plan-key.enum");
const _stripecustomerservice = require("./stripe-customer.service");
const _stripesdkservice = require("../stripe-sdk/services/stripe-sdk.service");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let StripeCheckoutService = class StripeCheckoutService {
    async createCheckoutSession({ user, workspace, stripeSubscriptionLineItems, successUrl, cancelUrl, stripeCustomerId, plan = _billingplankeyenum.BillingPlanKey.PRO, requirePaymentMethod = true, withTrialPeriod }) {
        stripeCustomerId = await this.getOrCreateStripeCustomerId({
            user,
            workspace,
            stripeCustomerId
        });
        return await this.stripe.checkout.sessions.create({
            line_items: stripeSubscriptionLineItems,
            mode: 'subscription',
            subscription_data: {
                metadata: {
                    workspaceId: workspace.id,
                    plan
                },
                ...this.getStripeSubscriptionTrialPeriodConfig(withTrialPeriod, requirePaymentMethod)
            },
            automatic_tax: {
                enabled: !!requirePaymentMethod
            },
            tax_id_collection: {
                enabled: !!requirePaymentMethod
            },
            customer: stripeCustomerId,
            customer_update: {
                name: 'auto',
                address: 'auto'
            },
            success_url: successUrl,
            cancel_url: cancelUrl,
            payment_method_collection: requirePaymentMethod ? 'always' : 'if_required'
        });
    }
    async createDirectSubscription({ user, workspace, stripeSubscriptionLineItems, stripeCustomerId, plan = _billingplankeyenum.BillingPlanKey.PRO, requirePaymentMethod = false, withTrialPeriod }) {
        stripeCustomerId = await this.getOrCreateStripeCustomerId({
            user,
            workspace,
            stripeCustomerId
        });
        const subscriptionItems = stripeSubscriptionLineItems.map((lineItem)=>({
                price: lineItem.price,
                quantity: lineItem.quantity
            }));
        const subscriptionParams = {
            customer: stripeCustomerId,
            items: subscriptionItems,
            metadata: {
                workspaceId: workspace.id,
                plan
            },
            ...this.getStripeSubscriptionTrialPeriodConfig(withTrialPeriod, requirePaymentMethod),
            automatic_tax: {
                enabled: !!requirePaymentMethod
            }
        };
        return await this.stripe.subscriptions.create(subscriptionParams);
    }
    async createSubscriptionWithPaymentMethodCollection({ user, workspace, stripeSubscriptionLineItems, stripeCustomerId, plan = _billingplankeyenum.BillingPlanKey.PRO, withTrialPeriod, idempotencyKey }) {
        const customerId = await this.getOrCreateStripeCustomerId({
            user,
            workspace,
            stripeCustomerId
        });
        const subscriptionItems = stripeSubscriptionLineItems.map((lineItem)=>({
                price: lineItem.price,
                quantity: lineItem.quantity
            }));
        return await this.stripe.subscriptions.create({
            customer: customerId,
            items: subscriptionItems,
            metadata: {
                workspaceId: workspace.id,
                plan
            },
            payment_behavior: 'default_incomplete',
            payment_settings: {
                save_default_payment_method: 'on_subscription'
            },
            ...this.getStripeSubscriptionTrialPeriodConfig(withTrialPeriod, true),
            automatic_tax: {
                enabled: false
            },
            expand: [
                'pending_setup_intent',
                'latest_invoice.confirmation_secret'
            ]
        }, {
            idempotencyKey: `onboarding-subscription-${workspace.id}-${idempotencyKey}`
        });
    }
    async retrieveSubscriptionForResume(stripeSubscriptionId) {
        return this.stripe.subscriptions.retrieve(stripeSubscriptionId, {
            expand: [
                'pending_setup_intent',
                'latest_invoice.confirmation_secret'
            ]
        });
    }
    async getOrCreateStripeCustomerId({ user, workspace, stripeCustomerId }) {
        if ((0, _utils.isDefined)(stripeCustomerId)) {
            return stripeCustomerId;
        }
        const stripeCustomer = await this.stripeCustomerService.createStripeCustomer(user.email, workspace.id, workspace.displayName);
        return stripeCustomer.id;
    }
    getStripeSubscriptionTrialPeriodConfig(withTrialPeriod, requirePaymentMethod) {
        return withTrialPeriod ? {
            trial_period_days: this.twentyConfigService.get(requirePaymentMethod ? 'BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS' : 'BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS'),
            trial_settings: {
                end_behavior: {
                    missing_payment_method: 'create_invoice'
                }
            }
        } : {};
    }
    constructor(twentyConfigService, stripeSDKService, stripeCustomerService){
        this.twentyConfigService = twentyConfigService;
        this.stripeSDKService = stripeSDKService;
        this.stripeCustomerService = stripeCustomerService;
        this.logger = new _common.Logger(StripeCheckoutService.name);
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return;
        }
        this.stripe = this.stripeSDKService.getStripe(this.twentyConfigService.get('BILLING_STRIPE_API_KEY'));
    }
};
StripeCheckoutService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _stripesdkservice.StripeSDKService === "undefined" ? Object : _stripesdkservice.StripeSDKService,
        typeof _stripecustomerservice.StripeCustomerService === "undefined" ? Object : _stripecustomerservice.StripeCustomerService
    ])
], StripeCheckoutService);

//# sourceMappingURL=stripe-checkout.service.js.map