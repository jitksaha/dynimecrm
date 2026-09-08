/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingUsageService", {
    enumerable: true,
    get: function() {
        return BillingUsageService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _clickhouseservice = require("../../../../database/clickhouse/clickhouse.service");
const _formatdatetimeforclickhouseutil = require("../../../../database/clickhouse/utils/format-date-time-for-clickhouse.util");
const _coreentitycacheservice = require("../../../core-entity-cache/services/core-entity-cache.service");
const _billingexception = require("../billing.exception");
const _nobillingsubscriptionconstant = require("../constants/no-billing-subscription.constant");
const _billingsubscriptionentity = require("../entities/billing-subscription.entity");
const _billingproductkeyenum = require("../enums/billing-product-key.enum");
const _billingsubscriptionstatusenum = require("../enums/billing-subscription-status.enum");
const _billingcreditgrantservice = require("./billing-credit-grant.service");
const _billingsubscriptionitemservice = require("./billing-subscription-item.service");
const _billingsubscriptionservice = require("./billing-subscription.service");
const _billingusagecacheservice = require("./billing-usage-cache.service");
const _buildbillingcreditstatelockkeyutil = require("../utils/build-billing-credit-state-lock-key.util");
const _getbillingsubscriptionperiodutil = require("../utils/get-billing-subscription-period.util");
const _cachelockservice = require("../../cache-lock/cache-lock.service");
const _cachelockexception = require("../../cache-lock/exceptions/cache-lock.exception");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
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
// This gate runs before every credit-consuming execution, so it waits far less
// than a writer does and falls back to computing unlocked rather than failing
// the execution outright.
const AVAILABLE_CREDITS_WARM_UP_LOCK_OPTIONS = {
    ms: 50,
    maxRetries: 20,
    ttl: 10_000
};
let BillingUsageService = class BillingUsageService {
    async canFeatureBeUsed(workspaceId) {
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return true;
        }
        const { currentBillingSubscription } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'currentBillingSubscription'
        ]);
        return currentBillingSubscription !== _nobillingsubscriptionconstant.NO_BILLING_SUBSCRIPTION && currentBillingSubscription.status !== _billingsubscriptionstatusenum.SubscriptionStatus.Canceled;
    }
    async getResourceCreditProductUsage(workspace) {
        const subscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            workspaceId: workspace.id
        });
        const resourceCreditItemDetail = await this.billingSubscriptionItemService.getResourceCreditSubscriptionItemDetails(subscription);
        if (!(0, _utils.isDefined)(resourceCreditItemDetail)) {
            throw new _billingexception.BillingException(`Resource credit item not found for workspace ${workspace.id}`, _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_ITEM_NOT_FOUND);
        }
        const { periodStart, periodEnd } = (0, _getbillingsubscriptionperiodutil.getBillingSubscriptionPeriod)(subscription);
        return [
            await this.buildResourceCreditUsage(workspace.id, subscription, resourceCreditItemDetail, periodStart, periodEnd)
        ];
    }
    async buildResourceCreditUsage(workspaceId, subscription, item, periodStart, periodEnd) {
        const [usedCredits, rolloverCredits] = await Promise.all([
            this.getCurrentPeriodCreditsUsed(workspaceId, periodStart),
            this.billingCreditGrantService.getActiveCreditsMicro(workspaceId)
        ]);
        const grantedCredits = subscription.status === _billingsubscriptionstatusenum.SubscriptionStatus.Trialing ? item.freeTrialQuantity : item.creditAmount;
        return {
            productKey: item.productKey,
            periodStart,
            periodEnd,
            usedCredits,
            grantedCredits,
            rolloverCredits,
            totalGrantedCredits: grantedCredits + rolloverCredits,
            unitPriceCents: item.unitPriceCents
        };
    }
    async getAvailableCreditsFromClickHouse({ workspaceId, currentPeriodStart }) {
        const subscription = await this.billingSubscriptionRepository.findOne(workspaceId, {
            where: {
                currentPeriodStart: new Date(currentPeriodStart)
            },
            relations: [
                'billingSubscriptionItems',
                'billingSubscriptionItems.billingProduct',
                'billingSubscriptionItems.billingProduct.billingPrices'
            ]
        });
        if (!(0, _utils.isDefined)(subscription)) {
            throw new _billingexception.BillingException(`Subscription not found for workspace ${workspaceId}`, _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_FOUND);
        }
        const resourceUsageCap = this.getResourceUsageCap(subscription);
        const [creditBalance, usage] = await Promise.all([
            this.billingCreditGrantService.getActiveCreditsMicro(workspaceId),
            this.getCurrentPeriodCreditsUsed(subscription.workspaceId, subscription.currentPeriodStart)
        ]);
        return resourceUsageCap + creditBalance - usage;
    }
    getTrialResourceUsageCap(subscription) {
        return this.billingSubscriptionService.getTrialPeriodFreeWorkflowCredits(subscription);
    }
    getResourceUsageCap(subscription) {
        const isInFreeTrial = subscription.status === _billingsubscriptionstatusenum.SubscriptionStatus.Trialing;
        if (isInFreeTrial) {
            return this.getTrialResourceUsageCap(subscription);
        }
        const resourceCreditItem = subscription.billingSubscriptionItems.find((item)=>item.billingProduct.metadata?.productKey === _billingproductkeyenum.BillingProductKey.RESOURCE_CREDIT);
        const resourceCreditPrice = resourceCreditItem?.billingProduct.billingPrices.find((price)=>price.stripePriceId === resourceCreditItem.stripePriceId);
        if (!(0, _utils.isDefined)(resourceCreditPrice)) {
            throw new _billingexception.BillingException(`Resource credit price not found for workspace ${subscription.workspaceId}`, _billingexception.BillingExceptionCode.BILLING_PRICE_NOT_FOUND);
        }
        return Number(resourceCreditPrice.metadata?.credit_amount ?? 0);
    }
    async decrementAvailableCreditsInCache({ workspaceId, usedCredits, currentBillingSubscription: providedCurrentBillingSubscription }) {
        const currentBillingSubscription = await this.resolveCurrentBillingSubscription({
            workspaceId,
            providedCurrentBillingSubscription
        });
        if (currentBillingSubscription === _nobillingsubscriptionconstant.NO_BILLING_SUBSCRIPTION) {
            return 0;
        }
        const { currentPeriodStart, currentPeriodEnd } = currentBillingSubscription;
        const { availableCredits, isCounterWarm } = await this.resolveAvailableCredits({
            workspaceId,
            currentPeriodStart,
            currentPeriodEnd
        });
        // A counter held stale by a recent grant must not be created from a value
        // that may predate it: incrementing an absent key would install
        // -usedCredits as the whole balance. Compute this turn locally instead and
        // let the next read rebuild once the marker lapses.
        return isCounterWarm ? await this.billingUsageCacheService.adjustAvailableCredits(workspaceId, currentPeriodStart, -usedCredits) : availableCredits - usedCredits;
    }
    // Warming is a read of the ledger followed by a write of what it implies, so
    // a grant landing in between would be counted from the ledger here and then
    // added to the counter again by the grant itself. Taking the writers' lock on
    // the cold path closes that; a hit returns before the lock, keeping the warm
    // path, which is the overwhelming majority of calls, free of Redis round
    // trips.
    async readWarmAvailableCredits(params) {
        const availableCredits = await this.billingUsageCacheService.getAvailableCredits(params.workspaceId, params.currentPeriodStart);
        return (0, _utils.isDefined)(availableCredits) ? {
            availableCredits,
            isCounterWarm: true
        } : undefined;
    }
    async resolveAvailableCredits(params) {
        const warmAvailableCredits = await this.readWarmAvailableCredits(params);
        if ((0, _utils.isDefined)(warmAvailableCredits)) {
            return warmAvailableCredits;
        }
        try {
            return await this.cacheLockService.withLock(async ()=>// Another reader may have warmed it while this one waited, so a burst
                // of cold reads pays for ClickHouse once rather than once each.
                await this.readWarmAvailableCredits(params) ?? await this.computeAndWarmAvailableCredits(params), (0, _buildbillingcreditstatelockkeyutil.buildBillingCreditStateLockKey)(params.workspaceId), AVAILABLE_CREDITS_WARM_UP_LOCK_OPTIONS);
        } catch (error) {
            if (!(error instanceof _cachelockexception.CacheLockException) || error.code !== _cachelockexception.CacheLockExceptionCode.LOCK_ACQUISITION_TIMEOUT) {
                throw error;
            }
            // Failing the execution because a grant is being written would be worse
            // than answering from a value this call computed itself. Deliberately
            // does not warm: holding the lock is what makes installing a computed
            // value safe, so the counter stays cold until an uncontended read.
            this.logger.warn(`Computing available credits for workspace ${params.workspaceId} without the credit state lock: ${error.message}`);
            return {
                availableCredits: await this.getAvailableCreditsFromClickHouse(params),
                isCounterWarm: false
            };
        }
    }
    async computeAndWarmAvailableCredits(params) {
        const availableCredits = await this.getAvailableCreditsFromClickHouse(params);
        await this.billingUsageCacheService.warmAvailableCredits(params.workspaceId, params.currentPeriodStart, params.currentPeriodEnd, availableCredits);
        return {
            availableCredits,
            isCounterWarm: true
        };
    }
    async getCreditAvailability({ workspaceId, currentBillingSubscription: providedCurrentBillingSubscription }) {
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return {
                hasAvailableCredits: true
            };
        }
        const workspace = await this.coreEntityCacheService.get('workspaceEntity', workspaceId);
        if ((0, _utils.isDefined)(workspace) && workspace.activationStatus === _workspace.WorkspaceActivationStatus.SUSPENDED) {
            return {
                hasAvailableCredits: false,
                reason: 'workspace-suspended'
            };
        }
        const currentBillingSubscription = await this.resolveCurrentBillingSubscription({
            workspaceId,
            providedCurrentBillingSubscription
        });
        if (currentBillingSubscription === _nobillingsubscriptionconstant.NO_BILLING_SUBSCRIPTION) {
            return {
                hasAvailableCredits: false,
                reason: 'no-subscription'
            };
        }
        const subscription = currentBillingSubscription;
        const { availableCredits } = await this.resolveAvailableCredits({
            workspaceId: subscription.workspaceId,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd
        });
        return availableCredits > 0 ? {
            hasAvailableCredits: true
        } : {
            hasAvailableCredits: false,
            reason: 'no-credits'
        };
    }
    async hasAvailableCredits(workspaceId) {
        const { hasAvailableCredits } = await this.getCreditAvailability({
            workspaceId
        });
        return hasAvailableCredits;
    }
    async hasAvailableCreditsOrThrow(workspaceId) {
        const hasCredits = await this.hasAvailableCredits(workspaceId);
        if (!hasCredits) {
            throw new _billingexception.BillingException('Credits exhausted', _billingexception.BillingExceptionCode.BILLING_CREDITS_EXHAUSTED);
        }
    }
    // Returns null when usage could not be read. ClickHouseService.select
    // swallows query errors and returns [], but a bare sum() aggregate always
    // yields exactly one row, so an empty result means the read failed rather
    // than "nothing was used". Callers that hand out credits must not confuse
    // the two.
    async sumCreditsUsedMicroOrNull(condition, params) {
        const rows = await this.clickHouseService.select(`SELECT sum(creditsUsedMicro) AS total
       FROM usageEvent
       WHERE workspaceId = {workspaceId:String}
         AND ${condition}`, params);
        if (rows.length === 0) {
            return null;
        }
        const rawTotal = rows[0]?.total ?? 0;
        const total = typeof rawTotal === 'string' ? Number(rawTotal) : rawTotal;
        return Number.isFinite(total) ? total : 0;
    }
    // Sums by event timestamp rather than by the stamped periodStart dimension.
    // At a period transition the subscription's currentPeriodStart has already
    // moved on, so an equality match on periodStart would read the new period
    // and report a period that has barely started as unused.
    async getCreditsUsedBetweenOrNull({ workspaceId, from, to }) {
        return this.sumCreditsUsedMicroOrNull('timestamp >= {from:DateTime64(3)} AND timestamp < {to:DateTime64(3)}', {
            workspaceId,
            from: (0, _formatdatetimeforclickhouseutil.formatDateTimeForClickHouse)(from),
            to: (0, _formatdatetimeforclickhouseutil.formatDateTimeForClickHouse)(to)
        });
    }
    // Fails open: an unreadable usage total must never block a paying workspace.
    async getCurrentPeriodCreditsUsed(workspaceId, periodStart) {
        const usedMicro = await this.sumCreditsUsedMicroOrNull('periodStart = {periodStart:DateTime64(3)}', {
            workspaceId,
            periodStart: (0, _formatdatetimeforclickhouseutil.formatDateTimeForClickHouse)(periodStart)
        });
        return usedMicro ?? 0;
    }
    async resolveCurrentBillingSubscription({ workspaceId, providedCurrentBillingSubscription }) {
        return providedCurrentBillingSubscription ?? (await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'currentBillingSubscription'
        ])).currentBillingSubscription;
    }
    constructor(billingCreditGrantService, billingSubscriptionService, twentyConfigService, billingSubscriptionItemService, billingUsageCacheService, billingSubscriptionRepository, workspaceCacheService, clickHouseService, cacheLockService, coreEntityCacheService){
        this.billingCreditGrantService = billingCreditGrantService;
        this.billingSubscriptionService = billingSubscriptionService;
        this.twentyConfigService = twentyConfigService;
        this.billingSubscriptionItemService = billingSubscriptionItemService;
        this.billingUsageCacheService = billingUsageCacheService;
        this.billingSubscriptionRepository = billingSubscriptionRepository;
        this.workspaceCacheService = workspaceCacheService;
        this.clickHouseService = clickHouseService;
        this.cacheLockService = cacheLockService;
        this.coreEntityCacheService = coreEntityCacheService;
        this.logger = new _common.Logger(BillingUsageService.name);
    }
};
BillingUsageService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(5, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingcreditgrantservice.BillingCreditGrantService === "undefined" ? Object : _billingcreditgrantservice.BillingCreditGrantService,
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _billingsubscriptionitemservice.BillingSubscriptionItemService === "undefined" ? Object : _billingsubscriptionitemservice.BillingSubscriptionItemService,
        typeof _billingusagecacheservice.BillingUsageCacheService === "undefined" ? Object : _billingusagecacheservice.BillingUsageCacheService,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _clickhouseservice.ClickHouseService === "undefined" ? Object : _clickhouseservice.ClickHouseService,
        typeof _cachelockservice.CacheLockService === "undefined" ? Object : _cachelockservice.CacheLockService,
        typeof _coreentitycacheservice.CoreEntityCacheService === "undefined" ? Object : _coreentitycacheservice.CoreEntityCacheService
    ])
], BillingUsageService);

//# sourceMappingURL=billing-usage.service.js.map