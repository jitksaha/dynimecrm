"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageLimitSpeedService", {
    enumerable: true,
    get: function() {
        return UsageLimitSpeedService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _cachestoragedecorator = require("../../cache-storage/decorators/cache-storage.decorator");
const _cachestorageexception = require("../../cache-storage/exceptions/cache-storage.exception");
const _cachestorageservice = require("../../cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../cache-storage/types/cache-storage-namespace.enum");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _tryconsumetokenbucketsscriptconstant = require("../constants/try-consume-token-buckets-script.constant");
const _usagelimitexception = require("../exceptions/usage-limit.exception");
const _buildspeedbucketsutil = require("../utils/build-speed-buckets.util");
const _findusagelimitdefinitionutil = require("../utils/find-usage-limit-definition.util");
const _workspacecacheexception = require("../../../workspace-cache/exceptions/workspace-cache.exception");
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
const ADMITTED = {
    admitted: true
};
let UsageLimitSpeedService = class UsageLimitSpeedService {
    async consumeOrThrow({ resourceType, authContext, operationType, cost = 1 }) {
        const outcome = await this.consumeAdmittingOnFailure({
            resourceType,
            authContext,
            operationType,
            cost
        });
        if (outcome.admitted) {
            return;
        }
        throw new _usagelimitexception.UsageLimitException(`Rate limit exceeded for ${outcome.exhausted.spenderType}: ${outcome.exhausted.refillPerWindow} requests per ${outcome.exhausted.windowMs / 1000}s.`, _usagelimitexception.UsageLimitExceptionCode.RATE_LIMITED, {
            exhaustedScope: {
                resourceType,
                limitKind: 'speed',
                spenderType: outcome.exhausted.spenderType,
                spenderId: outcome.exhausted.spenderId,
                limitValue: outcome.exhausted.refillPerWindow,
                remaining: 0,
                windowSeconds: Math.ceil(outcome.exhausted.windowMs / 1000),
                retryAfterMs: outcome.retryAfterMs,
                isFallback: outcome.exhausted.isFallback
            }
        });
    }
    async consumeAdmittingOnFailure({ resourceType, authContext, operationType, cost }) {
        const buckets = await this.buildBuckets({
            resourceType,
            authContext,
            operationType
        });
        if (buckets.length === 0) {
            return ADMITTED;
        }
        try {
            return await this.consumeTokens({
                buckets,
                cost
            });
        } catch (error) {
            if (!(error instanceof _cachestorageexception.CacheStorageException)) {
                throw error;
            }
            this.logger.error(`Usage limit enforcement degraded: ${error.message}`);
            return ADMITTED;
        }
    }
    async consumeTokens({ buckets, cost }) {
        const bucketConfigs = buckets.map((bucket)=>({
                burst: bucket.burst,
                refill: bucket.refillPerWindow,
                windowMs: bucket.windowMs
            }));
        const [admitted, failedIndex, retryAfterMs] = await this.cacheStorage.runScript({
            script: _tryconsumetokenbucketsscriptconstant.TRY_CONSUME_TOKEN_BUCKETS_SCRIPT,
            keys: buckets.map((bucket)=>bucket.key),
            args: [
                String(cost),
                JSON.stringify(bucketConfigs)
            ]
        });
        if (admitted === 1) {
            return ADMITTED;
        }
        const exhausted = buckets[failedIndex - 1];
        if (!(0, _utils.isDefined)(exhausted)) {
            this.logger.warn(`try-consume-token-buckets returned an out-of-range index ${failedIndex}`);
            return ADMITTED;
        }
        return {
            admitted: false,
            exhausted,
            retryAfterMs
        };
    }
    async buildBuckets({ resourceType, authContext, operationType }) {
        const definition = (0, _findusagelimitdefinitionutil.findUsageLimitDefinition)({
            resourceType,
            limitKind: 'speed'
        });
        if (!(0, _utils.isDefined)(definition)) {
            return [];
        }
        const rules = await this.findRulesAdmittingOnFailure({
            workspaceId: authContext.workspace.id,
            resourceType
        });
        if (!(0, _utils.isDefined)(rules)) {
            return [];
        }
        return (0, _buildspeedbucketsutil.buildSpeedBuckets)({
            defaultUsageLimitFallbacks: definition.fallbacks.map((fallback)=>({
                    spenderType: fallback.spenderType,
                    counterScope: fallback.counterScope,
                    isOverridable: fallback.isOverridable,
                    maxTokens: this.twentyConfigService.get(fallback.limitValueConfigVariable),
                    windowMs: this.twentyConfigService.get(fallback.windowMsConfigVariable)
                })),
            rules,
            authContext,
            resourceType,
            operationType
        });
    }
    async findRulesAdmittingOnFailure({ workspaceId, resourceType }) {
        let usageLimitRules;
        try {
            ({ usageLimitRules } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
                'usageLimitRules'
            ]));
        } catch (error) {
            if (error instanceof _workspacecacheexception.WorkspaceCacheException) {
                throw error;
            }
            this.logger.error('Usage limit rules unavailable, enforcement degraded', error);
            return null;
        }
        return usageLimitRules.byResourceType[resourceType] ?? [];
    }
    constructor(cacheStorage, workspaceCacheService, twentyConfigService){
        this.cacheStorage = cacheStorage;
        this.workspaceCacheService = workspaceCacheService;
        this.twentyConfigService = twentyConfigService;
        this.logger = new _common.Logger(UsageLimitSpeedService.name);
    }
};
UsageLimitSpeedService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.EngineUsageLimit)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], UsageLimitSpeedService);

//# sourceMappingURL=usage-limit-speed.service.js.map