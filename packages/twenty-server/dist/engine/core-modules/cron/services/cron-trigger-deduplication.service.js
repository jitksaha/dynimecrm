"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CronTriggerDeduplicationService", {
    enumerable: true,
    get: function() {
        return CronTriggerDeduplicationService;
    }
});
const _common = require("@nestjs/common");
const _cronparser = require("cron-parser");
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
const ROOT_CRON_INTERVAL_MS = 60_000;
const CRON_DISPATCH_DEDUP_TTL_MS = 2 * 60_000;
let CronTriggerDeduplicationService = class CronTriggerDeduplicationService {
    async shouldDispatch(keyPrefix, pattern, now) {
        let lastTriggerTimestamp;
        try {
            lastTriggerTimestamp = _cronparser.CronExpressionParser.parse(pattern, {
                currentDate: now
            }).prev().getTime();
        } catch  {
            return false;
        }
        const isDueWithinThisTick = now.getTime() - lastTriggerTimestamp < ROOT_CRON_INTERVAL_MS;
        if (!isDueWithinThisTick) {
            return false;
        }
        const dedupKey = `${keyPrefix}:${lastTriggerTimestamp}`;
        return this.cacheStorageService.acquireLock(dedupKey, CRON_DISPATCH_DEDUP_TTL_MS);
    }
    constructor(cacheStorageService){
        this.cacheStorageService = cacheStorageService;
    }
};
CronTriggerDeduplicationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.EngineLock)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService
    ])
], CronTriggerDeduplicationService);

//# sourceMappingURL=cron-trigger-deduplication.service.js.map