/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingCreditService", {
    enumerable: true,
    get: function() {
        return BillingCreditService;
    }
});
const _common = require("@nestjs/common");
const _datefns = require("date-fns");
const _utils = require("twenty-shared/utils");
const _billingcreditgrantservice = require("./billing-credit-grant.service");
const _billingsubscriptionservice = require("./billing-subscription.service");
const _billingusagecacheservice = require("./billing-usage-cache.service");
const _billingservice = require("./billing.service");
const _buildbillingcreditstatelockkeyutil = require("../utils/build-billing-credit-state-lock-key.util");
const _getbillingsubscriptionperiodutil = require("../utils/get-billing-subscription-period.util");
const _cachelockservice = require("../../cache-lock/cache-lock.service");
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
// Used when a workspace has no subscription yet, which happens for rewards
// granted during signup. The next period transition re-emits the unspent part
// aligned on the real billing period.
const PROVISIONAL_GRANT_VALIDITY_IN_DAYS = 31;
let BillingCreditService = class BillingCreditService {
    async grantCredits(params) {
        if (!this.billingService.isBillingEnabled()) {
            return null;
        }
        const { workspaceId } = params;
        // Writing the row and moving the counter are two steps, and a reader that
        // computes availability between them counts the grant from the ledger and
        // then has it added a second time. Locking keeps the pair indivisible for
        // anything else touching this workspace's credit state.
        return this.cacheLockService.withLock(()=>this.writeGrantAndRefreshState(params), (0, _buildbillingcreditstatelockkeyutil.buildBillingCreditStateLockKey)(workspaceId));
    }
    async writeGrantAndRefreshState(params) {
        const { workspaceId, amountMicro } = params;
        // Read once for the whole write: the validity window and the state refresh
        // both need it, and both run inside the lock. Reading it here rather than
        // before the lock is what keeps a grant that waited behind a period
        // transition from carrying the period the wait started in, which would
        // land it already expired while its amount still went onto the counter for
        // the period that had meanwhile opened.
        const subscription = await this.billingSubscriptionService.getCurrentBillingSubscription({
            workspaceId
        });
        const { effectiveAt, expiresAt } = resolveGrantValidity(params, subscription);
        const grant = await this.billingCreditGrantService.createGrant({
            ...params,
            effectiveAt,
            expiresAt
        });
        // A replay only means the ledger row exists, not that the projections
        // built from it do: the first attempt can have inserted the row and then
        // failed on the refresh, and onboarding callers swallow that error. Repair
        // rather than return, with no counter delta since the original attempt may
        // already have applied it.
        if (!(0, _utils.isDefined)(grant)) {
            this.logger.log(`Replayed credit grant for workspace ${workspaceId} (idempotency key ${params.idempotencyKey}), repairing derived state`);
            // Rebuilding from the ledger can overstate the balance by whatever
            // usage ClickHouse has not ingested yet, and that value then stands for
            // the period. Accepted here because the alternative is a grant that
            // stays invisible for the whole period, and erring high is the direction
            // the grant intended.
            await this.refreshWorkspaceCreditState({
                workspaceId,
                availableDeltaMicro: 0,
                isReplay: true,
                subscription
            });
            return null;
        }
        await this.refreshWorkspaceCreditState({
            workspaceId,
            availableDeltaMicro: amountMicro,
            subscription
        });
        return grant;
    }
    async revokeGrant({ workspaceId, grantId, revokedByUserId }) {
        return this.cacheLockService.withLock(()=>this.markGrantRevokedAndRefreshState({
                workspaceId,
                grantId,
                revokedByUserId
            }), (0, _buildbillingcreditstatelockkeyutil.buildBillingCreditStateLockKey)(workspaceId));
    }
    async markGrantRevokedAndRefreshState({ workspaceId, grantId, revokedByUserId }) {
        const { grant, wasRevokedNow } = await this.billingCreditGrantService.revokeGrant({
            workspaceId,
            grantId,
            revokedByUserId
        });
        const adjustmentKey = buildRevocationAdjustmentKey(grantId);
        // A retried revocation must not take the same credits off the usage
        // counter twice, which would block a workspace that still has credits.
        // Whether the attempt that did revoke got as far as the counter is
        // recorded under adjustmentKey, so the refresh can tell the two apart:
        // already applied means repair the rest and leave the counter alone, never
        // applied means rebuild from the ledger. Guessing either way is wrong,
        // since always rebuilding freezes ClickHouse lag in as extra credit on
        // every double click and never rebuilding leaves revoked credits spendable
        // until the period ends.
        if (!wasRevokedNow) {
            await this.refreshWorkspaceCreditState({
                workspaceId,
                availableDeltaMicro: 0,
                isReplay: true,
                adjustmentKey
            });
            return grant;
        }
        // Only credits the counter actually holds may come off it. The mutation
        // accepts any grant id, and a grant can expire between the admin panel
        // rendering and the revoke landing, so subtracting unconditionally would
        // take away credits that were never counted and block usage until the
        // period ends.
        const revokedAtMs = (grant.revokedAt ?? new Date()).getTime();
        const wasActiveWhenRevoked = grant.effectiveAt.getTime() <= revokedAtMs && grant.expiresAt.getTime() > revokedAtMs;
        await this.refreshWorkspaceCreditState({
            workspaceId,
            availableDeltaMicro: wasActiveWhenRevoked ? -grant.amountMicro : 0,
            adjustmentKey
        });
        return grant;
    }
    // Keeps everything that reads a credit balance consistent with the ledger:
    // the Redis counter that gates usage and the cached subscription the front
    // reads. Public so a caller writing several grants at once pays for this
    // once; such a caller must hold buildBillingCreditStateLockKey for its own
    // ledger writes and this refresh together, which is why this does not take
    // the lock itself.
    async refreshWorkspaceCreditState({ workspaceId, availableDeltaMicro, isReplay = false, adjustmentKey, subscription: knownSubscription }) {
        const subscription = knownSubscription ?? await this.billingSubscriptionService.getCurrentBillingSubscription({
            workspaceId
        });
        if (!(0, _utils.isDefined)(subscription)) {
            return;
        }
        // Deliberately not getBillingSubscriptionPeriod, which reports the trial
        // window while trialing: every usage path keys this counter off
        // currentPeriodStart, so taking the period from anywhere else would move a
        // key the gate never reads.
        const periodStart = subscription.currentPeriodStart;
        const rebuildCounter = isReplay && (!(0, _utils.isDefined)(adjustmentKey) || !await this.billingUsageCacheService.hasCounterAdjustmentBeenApplied(workspaceId, adjustmentKey));
        await this.applyCounterWrite({
            workspaceId,
            periodStart,
            availableDeltaMicro,
            shouldRebuild: rebuildCounter
        });
        if ((0, _utils.isDefined)(adjustmentKey)) {
            await this.billingUsageCacheService.markCounterAdjustmentApplied(workspaceId, adjustmentKey, subscription.currentPeriodEnd);
        }
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'currentBillingSubscription'
        ]);
    }
    // Returns what the counter holds afterwards, or null when there is no warm
    // counter to speak for the workspace.
    async applyCounterWrite({ workspaceId, periodStart, availableDeltaMicro, shouldRebuild }) {
        if (shouldRebuild) {
            await this.billingUsageCacheService.invalidateAvailableCredits(workspaceId, periodStart);
            return null;
        }
        if (availableDeltaMicro === 0) {
            return null;
        }
        // Adjusting the warm counter instead of flushing it avoids recomputing
        // from ClickHouse while its async inserts for recent usage are still
        // landing, which would credit the workspace for usage it already spent.
        const cachedAvailableCredits = await this.billingUsageCacheService.getAvailableCredits(workspaceId, periodStart);
        // Nothing to do when the counter is cold. A reader can only warm it while
        // holding this same lock, so it cannot be mid-computation now, and the
        // next one to take the lock reads a ledger that already has this write.
        if (!(0, _utils.isDefined)(cachedAvailableCredits)) {
            return null;
        }
        await this.billingUsageCacheService.adjustAvailableCredits(workspaceId, periodStart, availableDeltaMicro);
        return cachedAvailableCredits + availableDeltaMicro;
    }
    constructor(billingService, billingCreditGrantService, billingSubscriptionService, billingUsageCacheService, cacheLockService, workspaceCacheService){
        this.billingService = billingService;
        this.billingCreditGrantService = billingCreditGrantService;
        this.billingSubscriptionService = billingSubscriptionService;
        this.billingUsageCacheService = billingUsageCacheService;
        this.cacheLockService = cacheLockService;
        this.workspaceCacheService = workspaceCacheService;
        this.logger = new _common.Logger(BillingCreditService.name);
    }
};
BillingCreditService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingservice.BillingService === "undefined" ? Object : _billingservice.BillingService,
        typeof _billingcreditgrantservice.BillingCreditGrantService === "undefined" ? Object : _billingcreditgrantservice.BillingCreditGrantService,
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService,
        typeof _billingusagecacheservice.BillingUsageCacheService === "undefined" ? Object : _billingusagecacheservice.BillingUsageCacheService,
        typeof _cachelockservice.CacheLockService === "undefined" ? Object : _cachelockservice.CacheLockService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], BillingCreditService);
// Scopes the completion marker to one revocation, so retrying it is the only
// thing that can see it.
const buildRevocationAdjustmentKey = (grantId)=>`revoke:${grantId}`;
const resolveGrantValidity = (params, subscription)=>{
    const effectiveAt = params.effectiveAt ?? new Date();
    if ((0, _utils.isDefined)(params.expiresAt)) {
        return {
            effectiveAt,
            expiresAt: params.expiresAt
        };
    }
    // A lapsed subscription still carries the period that just ended, and that is
    // exactly the workspace someone is most likely to be granting credits to.
    // Falling back keeps the grant from expiring on creation.
    const currentPeriodEnd = (0, _utils.isDefined)(subscription) ? (0, _getbillingsubscriptionperiodutil.getBillingSubscriptionPeriod)(subscription).periodEnd : null;
    const hasUsablePeriodEnd = (0, _utils.isDefined)(currentPeriodEnd) && currentPeriodEnd.getTime() > effectiveAt.getTime();
    return {
        effectiveAt,
        expiresAt: hasUsablePeriodEnd ? currentPeriodEnd : (0, _datefns.addDays)(effectiveAt, PROVISIONAL_GRANT_VALIDITY_IN_DAYS)
    };
};

//# sourceMappingURL=billing-credit.service.js.map