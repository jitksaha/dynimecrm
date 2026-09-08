/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingCreditRolloverService", {
    enumerable: true,
    get: function() {
        return BillingCreditRolloverService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _billingexception = require("../billing.exception");
const _billingcreditgrantservice = require("./billing-credit-grant.service");
const _billingcreditservice = require("./billing-credit.service");
const _billingusageservice = require("./billing-usage.service");
const _buildbillingcreditstatelockkeyutil = require("../utils/build-billing-credit-state-lock-key.util");
const _computecarryforwardgrantsutil = require("../utils/compute-carry-forward-grants.util");
const _cachelockservice = require("../../cache-lock/cache-lock.service");
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
// The transition writes more rows than a single grant does, so it is given more
// room than the lock's default before it gives up.
const ROLLOVER_LOCK_OPTIONS = {
    ms: 200,
    maxRetries: 50,
    ttl: 30_000
};
let BillingCreditRolloverService = class BillingCreditRolloverService {
    async processRolloverOnPeriodTransition(params) {
        const { workspaceId, closingPeriodStart, closingPeriodEnd } = params;
        // Read outside the lock: usage comes from ClickHouse and no credit write
        // can change it, so paying that latency while holding the lock would only
        // stall concurrent grants.
        const usageMicro = await this.billingUsageService.getCreditsUsedBetweenOrNull({
            workspaceId,
            from: closingPeriodStart,
            to: closingPeriodEnd
        });
        // Reading usage as zero when the query failed would roll a full unused
        // allowance over to every workspace invoiced during the outage. Throwing
        // fails the webhook so Stripe redelivers it; returning normally would
        // answer 200 and the transition would never run, closing no grants and
        // carrying nothing forward, so the workspace silently loses its balance
        // at expiry.
        if (!(0, _utils.isDefined)(usageMicro)) {
            throw new _billingexception.BillingException(`Cannot roll credits over for workspace ${workspaceId}: usage for the period starting ${closingPeriodStart.toISOString()} could not be read`, _billingexception.BillingExceptionCode.BILLING_USAGE_UNAVAILABLE);
        }
        // Everything from here reads the ledger, decides from that snapshot, then
        // writes it back. A grant landing in between would either be carried twice
        // or dropped, so the whole read-decide-write runs alone.
        await this.cacheLockService.withLock(()=>this.carryGrantsForward({
                ...params,
                usageMicro
            }), (0, _buildbillingcreditstatelockkeyutil.buildBillingCreditStateLockKey)(workspaceId), ROLLOVER_LOCK_OPTIONS);
    }
    async carryGrantsForward({ workspaceId, closingPeriodStart, closingPeriodEnd, closingAllowanceMicro, nextPeriodStart, nextPeriodEnd, nextAllowanceMicro, usageMicro }) {
        const closingGrants = await this.billingCreditGrantService.findGrantsLiveDuringPeriod({
            workspaceId,
            periodStart: closingPeriodStart,
            periodEnd: closingPeriodEnd
        });
        const rolloverCapMultiplier = this.twentyConfigService.get('BILLING_ROLLOVER_TOTAL_CAP_MULTIPLIER');
        const carryForwardGrants = (0, _computecarryforwardgrantsutil.computeCarryForwardGrants)({
            allowanceMicro: closingAllowanceMicro,
            liveGrants: closingGrants.map((grant)=>({
                    grantId: grant.id,
                    type: grant.type,
                    amountMicro: grant.amountMicro,
                    createdAt: grant.createdAt
                })),
            usageMicro,
            rolloverCapMicro: (rolloverCapMultiplier - 1) * nextAllowanceMicro
        });
        await this.billingCreditGrantService.closeGrantsAtPeriodEnd({
            workspaceId,
            periodEnd: closingPeriodEnd
        });
        let carriedForwardMicro = 0;
        let hasReplayedGrant = false;
        // Writes the grants directly rather than through grantCredits: the cache,
        // cap flag and workspace cache only need refreshing once for the whole
        // transition, and this runs inside a Stripe webhook.
        for (const carryForwardGrant of carryForwardGrants){
            const grant = await this.billingCreditGrantService.createGrant({
                workspaceId,
                amountMicro: carryForwardGrant.amountMicro,
                type: carryForwardGrant.type,
                sourceGrantId: carryForwardGrant.sourceGrantId,
                effectiveAt: nextPeriodStart,
                expiresAt: nextPeriodEnd,
                reason: `Carried over from the period starting ${closingPeriodStart.toISOString()}`,
                idempotencyKey: buildCarryForwardIdempotencyKey({
                    workspaceId,
                    nextPeriodStart,
                    type: carryForwardGrant.type,
                    sourceGrantId: carryForwardGrant.sourceGrantId
                })
            });
            if ((0, _utils.isDefined)(grant)) {
                carriedForwardMicro += grant.amountMicro;
            } else {
                hasReplayedGrant = true;
            }
        }
        // A replay only tells us the rows already exist, not whether the delivery
        // that wrote them got as far as the counter. Stripe also redelivers events
        // it already handled successfully, and rebuilding then would throw away a
        // correct warm counter and recompute it from ClickHouse, crediting back
        // whatever usage has not been ingested yet. So the transition records under
        // adjustmentKey that it moved the counter, and the refresh rebuilds only
        // when that record is absent.
        //
        // Runs unconditionally: closing the old grants moves the balance on its
        // own, so a period where everything was spent still needs the refresh.
        await this.billingCreditService.refreshWorkspaceCreditState({
            workspaceId,
            availableDeltaMicro: carriedForwardMicro,
            isReplay: hasReplayedGrant,
            adjustmentKey: buildRolloverAdjustmentKey(nextPeriodStart)
        });
    }
    constructor(billingUsageService, billingCreditGrantService, billingCreditService, cacheLockService, twentyConfigService){
        this.billingUsageService = billingUsageService;
        this.billingCreditGrantService = billingCreditGrantService;
        this.billingCreditService = billingCreditService;
        this.cacheLockService = cacheLockService;
        this.twentyConfigService = twentyConfigService;
    }
};
BillingCreditRolloverService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingusageservice.BillingUsageService === "undefined" ? Object : _billingusageservice.BillingUsageService,
        typeof _billingcreditgrantservice.BillingCreditGrantService === "undefined" ? Object : _billingcreditgrantservice.BillingCreditGrantService,
        typeof _billingcreditservice.BillingCreditService === "undefined" ? Object : _billingcreditservice.BillingCreditService,
        typeof _cachelockservice.CacheLockService === "undefined" ? Object : _cachelockservice.CacheLockService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], BillingCreditRolloverService);
// Scopes the completion marker to one period transition, so only a redelivery
// of that transition can see it.
const buildRolloverAdjustmentKey = (nextPeriodStart)=>`rollover:${nextPeriodStart.toISOString()}`;
// Stripe redelivers webhooks, so the whole transition has to be replayable.
const buildCarryForwardIdempotencyKey = ({ workspaceId, nextPeriodStart, type, sourceGrantId })=>`carry-forward:${workspaceId}:${nextPeriodStart.toISOString()}:${type}:${sourceGrantId ?? 'allowance'}`;

//# sourceMappingURL=billing-credit-rollover.service.js.map