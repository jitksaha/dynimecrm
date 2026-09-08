/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingUsageCacheService", {
    enumerable: true,
    get: function() {
        return BillingUsageCacheService;
    }
});
const _common = require("@nestjs/common");
const _buildbillingusageavailablecreditscachekeyutil = require("../utils/build-billing-usage-available-credits-cache-key.util");
const _buildbillingusageavailablecreditscachepatternutil = require("../utils/build-billing-usage-available-credits-cache-pattern.util");
const _buildbillingusagecounteradjustmentkeyutil = require("../utils/build-billing-usage-counter-adjustment-key.util");
const _buildbillingusagecounteradjustmentpatternutil = require("../utils/build-billing-usage-counter-adjustment-pattern.util");
const _cachestoragedecorator = require("../../cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../cache-storage/types/cache-storage-namespace.enum");
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
let BillingUsageCacheService = class BillingUsageCacheService {
    async getAvailableCredits(workspaceId, periodStart) {
        return this.billingUsageCacheStorage.get((0, _buildbillingusageavailablecreditscachekeyutil.buildBillingUsageAvailableCreditsCacheKey)(workspaceId, periodStart));
    }
    // Callers must hold buildBillingCreditStateLockKey: that is what stops a
    // value computed before a grant landed from being installed after it.
    async warmAvailableCredits(workspaceId, periodStart, periodEnd, availableCredits) {
        await this.billingUsageCacheStorage.set((0, _buildbillingusageavailablecreditscachekeyutil.buildBillingUsageAvailableCreditsCacheKey)(workspaceId, periodStart), availableCredits, msUntil(periodEnd));
    }
    async hasCounterAdjustmentBeenApplied(workspaceId, adjustmentKey) {
        const marker = await this.billingUsageCacheStorage.get((0, _buildbillingusagecounteradjustmentkeyutil.buildBillingUsageCounterAdjustmentKey)(workspaceId, adjustmentKey));
        return marker === true;
    }
    async markCounterAdjustmentApplied(workspaceId, adjustmentKey, periodEnd) {
        await this.billingUsageCacheStorage.set((0, _buildbillingusagecounteradjustmentkeyutil.buildBillingUsageCounterAdjustmentKey)(workspaceId, adjustmentKey), true, msUntil(periodEnd));
    }
    // Signed: usage moves it down, a grant moves it up.
    async adjustAvailableCredits(workspaceId, periodStart, deltaCredits) {
        return this.billingUsageCacheStorage.incrBy((0, _buildbillingusageavailablecreditscachekeyutil.buildBillingUsageAvailableCreditsCacheKey)(workspaceId, periodStart), deltaCredits);
    }
    async invalidateAvailableCredits(workspaceId, periodStart) {
        await this.billingUsageCacheStorage.del((0, _buildbillingusageavailablecreditscachekeyutil.buildBillingUsageAvailableCreditsCacheKey)(workspaceId, periodStart));
    }
    async flushAvailableCredits(workspaceId) {
        await this.billingUsageCacheStorage.flushByPattern((0, _buildbillingusageavailablecreditscachepatternutil.buildBillingUsageAvailableCreditsCachePattern)(workspaceId));
    }
    async flushCounterAdjustmentMarkers(workspaceId) {
        await this.billingUsageCacheStorage.flushByPattern((0, _buildbillingusagecounteradjustmentpatternutil.buildBillingUsageCounterAdjustmentPattern)(workspaceId));
    }
    constructor(billingUsageCacheStorage){
        this.billingUsageCacheStorage = billingUsageCacheStorage;
    }
};
BillingUsageCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.EngineBillingUsage)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService
    ])
], BillingUsageCacheService);
const msUntil = (date)=>Math.max(new Date(date).getTime() - Date.now(), 0);

//# sourceMappingURL=billing-usage-cache.service.js.map