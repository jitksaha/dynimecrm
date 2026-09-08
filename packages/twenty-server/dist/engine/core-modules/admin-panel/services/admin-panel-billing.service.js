"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelBillingService", {
    enumerable: true,
    get: function() {
        return AdminPanelBillingService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _billingexception = require("../../billing/billing.exception");
const _billingcustomerentity = require("../../billing/entities/billing-customer.entity");
const _billingpriceentity = require("../../billing/entities/billing-price.entity");
const _billingcreditgranttypeenum = require("../../billing/enums/billing-credit-grant-type.enum");
const _billingplankeyenum = require("../../billing/enums/billing-plan-key.enum");
const _billingcreditgrantservice = require("../../billing/services/billing-credit-grant.service");
const _billingcreditservice = require("../../billing/services/billing-credit.service");
const _billingsubscriptionservice = require("../../billing/services/billing-subscription.service");
const _billingusageservice = require("../../billing/services/billing-usage.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _todisplaycreditsutil = require("../../usage/utils/to-display-credits.util");
const _workspaceentity = require("../../workspace/workspace.entity");
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
const KNOWN_PLAN_KEYS = new Set(Object.values(_billingplankeyenum.BillingPlanKey));
let AdminPanelBillingService = class AdminPanelBillingService {
    async grantWorkspaceCredits({ workspaceId, amount, type, reason, clientOperationId, grantedByUserId }) {
        // Enforced server side because the mutation is reachable directly, not only
        // through the admin panel's picker. See ADMIN_GRANTABLE_CREDIT_GRANT_TYPES
        // for why these two are excluded.
        if (!_billingcreditgranttypeenum.ADMIN_GRANTABLE_CREDIT_GRANT_TYPES.includes(type)) {
            throw new _billingexception.BillingException(`Cannot grant credits of type ${type} by hand`, _billingexception.BillingExceptionCode.BILLING_CREDIT_GRANT_TYPE_NOT_GRANTABLE);
        }
        const amountMicro = Math.round(amount * _todisplaycreditsutil.INTERNAL_CREDITS_PER_DISPLAY_CREDIT);
        const maxAmountMicro = this.twentyConfigService.get('BILLING_MAX_ADMIN_CREDIT_GRANT_MICRO');
        // The field is micro-denominated, so a slipped decimal is four orders of
        // magnitude. Bound what a single grant can hand out.
        if (amountMicro > maxAmountMicro) {
            throw new _billingexception.BillingException(`Cannot grant ${(0, _todisplaycreditsutil.toDisplayCredits)(amountMicro)} credits at once, the maximum is ${(0, _todisplaycreditsutil.toDisplayCredits)(maxAmountMicro)}`, _billingexception.BillingExceptionCode.BILLING_CREDIT_AMOUNT_INVALID);
        }
        const idempotencyKey = buildAdminGrantIdempotencyKey(clientOperationId);
        const grant = await this.billingCreditService.grantCredits({
            workspaceId,
            amountMicro,
            type,
            reason,
            idempotencyKey,
            grantedByUserId
        });
        if ((0, _utils.isDefined)(grant)) {
            return this.toCreditGrantDTO(grant);
        }
        // A null grant is either a replay of this same operation, which must answer
        // with the grant the first attempt wrote rather than hand out the credits
        // again, or an instance without billing. The ledger table only exists in
        // the first case, so it is only queried there.
        const replayedGrant = this.twentyConfigService.get('IS_BILLING_ENABLED') ? await this.billingCreditGrantService.findGrantByIdempotencyKey(workspaceId, idempotencyKey) : null;
        if (!(0, _utils.isDefined)(replayedGrant)) {
            throw new _billingexception.BillingException(`Could not grant credits to workspace ${workspaceId}, billing is disabled on this instance`, _billingexception.BillingExceptionCode.BILLING_CUSTOMER_NOT_FOUND);
        }
        return this.toCreditGrantDTO(replayedGrant);
    }
    async revokeWorkspaceCreditGrant({ workspaceId, creditGrantId, revokedByUserId }) {
        const grant = await this.billingCreditService.revokeGrant({
            workspaceId,
            grantId: creditGrantId,
            revokedByUserId
        });
        return this.toCreditGrantDTO(grant);
    }
    async getWorkspaceCreditGrants(workspaceId) {
        const grants = await this.billingCreditGrantService.listGrants(workspaceId);
        return grants.map((grant)=>this.toCreditGrantDTO(grant));
    }
    toCreditGrantDTO(grant) {
        const now = Date.now();
        return {
            id: grant.id,
            amount: (0, _todisplaycreditsutil.toDisplayCredits)(grant.amountMicro),
            type: grant.type,
            effectiveAt: grant.effectiveAt,
            expiresAt: grant.expiresAt,
            revokedAt: grant.revokedAt,
            reason: grant.reason,
            isActive: !(0, _utils.isDefined)(grant.revokedAt) && grant.effectiveAt.getTime() <= now && grant.expiresAt.getTime() > now,
            createdAt: grant.createdAt
        };
    }
    async getWorkspaceBilling(workspaceId) {
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return null;
        }
        const [customer, subscription, creditGrants] = await Promise.all([
            this.billingCustomerRepository.findOne(workspaceId, {
                where: {}
            }),
            this.billingSubscriptionService.getCurrentBillingSubscription({
                workspaceId
            }),
            this.getWorkspaceCreditGrants(workspaceId)
        ]);
        // A workspace can hold granted credits before it has a customer or a
        // subscription, and the admin panel still has to show and manage them.
        if (!customer && !subscription && creditGrants.length === 0) {
            return null;
        }
        const stripeCustomerId = customer?.stripeCustomerId ?? subscription?.stripeCustomerId ?? null;
        const creditBalance = (0, _todisplaycreditsutil.toDisplayCredits)(await this.billingCreditGrantService.getActiveCreditsMicro(workspaceId));
        if (!subscription) {
            return {
                stripeCustomerId,
                creditBalance,
                creditGrants,
                subscription: null,
                usage: null
            };
        }
        const usage = await this.getWorkspaceUsage(workspaceId);
        const items = subscription.billingSubscriptionItems ?? [];
        const priceIds = items.map((item)=>item.stripePriceId);
        const prices = priceIds.length ? await this.billingPriceRepository.find({
            where: {
                stripePriceId: (0, _typeorm1.In)(priceIds)
            }
        }) : [];
        const priceByStripeId = new Map(prices.map((price)=>[
                price.stripePriceId,
                price
            ]));
        const planValue = subscription.metadata?.plan;
        const planKey = typeof planValue === 'string' && KNOWN_PLAN_KEYS.has(planValue) ? planValue : null;
        return {
            stripeCustomerId,
            creditBalance,
            creditGrants,
            usage,
            subscription: {
                stripeSubscriptionId: subscription.stripeSubscriptionId,
                status: subscription.status,
                interval: subscription.interval ?? null,
                currency: subscription.currency,
                planKey,
                currentPeriodStart: subscription.currentPeriodStart,
                currentPeriodEnd: subscription.currentPeriodEnd,
                trialStart: subscription.trialStart,
                trialEnd: subscription.trialEnd,
                cancelAt: subscription.cancelAt,
                canceledAt: subscription.canceledAt,
                cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                items: items.map((item)=>{
                    const price = priceByStripeId.get(item.stripePriceId);
                    const firstTier = price?.tiers?.[0];
                    const productKey = item.billingProduct?.metadata?.productKey;
                    return {
                        productName: item.billingProduct?.name ?? '',
                        productKey: typeof productKey === 'string' ? productKey : null,
                        stripePriceId: item.stripePriceId,
                        quantity: item.quantity != null ? Number(item.quantity) : null,
                        unitAmount: price?.unitAmount != null ? Number(price.unitAmount) : null,
                        includedCredits: typeof firstTier?.up_to === 'number' ? firstTier.up_to : null
                    };
                })
            }
        };
    }
    async getWorkspaceUsage(workspaceId) {
        const workspace = await this.workspaceRepository.findOne({
            where: {
                id: workspaceId
            }
        });
        if (!workspace) {
            return null;
        }
        try {
            const [usage] = await this.billingUsageService.getResourceCreditProductUsage(workspace);
            if (!usage) {
                return null;
            }
            const usedCredits = (0, _todisplaycreditsutil.toDisplayCredits)(usage.usedCredits);
            const grantedCredits = (0, _todisplaycreditsutil.toDisplayCredits)(usage.grantedCredits);
            const rolloverCredits = (0, _todisplaycreditsutil.toDisplayCredits)(usage.rolloverCredits);
            const totalGrantedCredits = (0, _todisplaycreditsutil.toDisplayCredits)(usage.totalGrantedCredits);
            return {
                periodStart: usage.periodStart,
                periodEnd: usage.periodEnd,
                usedCredits,
                grantedCredits,
                rolloverCredits,
                totalGrantedCredits,
                remainingCredits: totalGrantedCredits - usedCredits
            };
        } catch (error) {
            this.logger.warn(`Failed to compute credit usage for workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
            return null;
        }
    }
    constructor(billingCustomerRepository, billingPriceRepository, workspaceRepository, billingSubscriptionService, billingUsageService, billingCreditService, billingCreditGrantService, twentyConfigService){
        this.billingCustomerRepository = billingCustomerRepository;
        this.billingPriceRepository = billingPriceRepository;
        this.workspaceRepository = workspaceRepository;
        this.billingSubscriptionService = billingSubscriptionService;
        this.billingUsageService = billingUsageService;
        this.billingCreditService = billingCreditService;
        this.billingCreditGrantService = billingCreditGrantService;
        this.twentyConfigService = twentyConfigService;
        this.logger = new _common.Logger(AdminPanelBillingService.name);
    }
};
AdminPanelBillingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_billingcustomerentity.BillingCustomerEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_billingpriceentity.BillingPriceEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService,
        typeof _billingusageservice.BillingUsageService === "undefined" ? Object : _billingusageservice.BillingUsageService,
        typeof _billingcreditservice.BillingCreditService === "undefined" ? Object : _billingcreditservice.BillingCreditService,
        typeof _billingcreditgrantservice.BillingCreditGrantService === "undefined" ? Object : _billingcreditgrantservice.BillingCreditGrantService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], AdminPanelBillingService);
// Namespaced so an operation id can never collide with the carry-forward or
// backfill keys, which live in the same unique index.
const buildAdminGrantIdempotencyKey = (clientOperationId)=>`admin-grant:${clientOperationId}`;

//# sourceMappingURL=admin-panel-billing.service.js.map