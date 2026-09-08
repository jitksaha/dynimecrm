"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceCacheMetricsService", {
    enumerable: true,
    get: function() {
        return WorkspaceCacheMetricsService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _metricsservice = require("../../core-modules/metrics/metrics.service");
const _metricskeystype = require("../../core-modules/metrics/types/metrics-keys.type");
const _computelocalcachestatsutil = require("../utils/compute-local-cache-stats.util");
const _deepsizebytesutil = require("../utils/deep-size-bytes.util");
const _getkeynamefromlocalcachekeyutil = require("../utils/get-key-name-from-local-cache-key.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const CACHE_DURATION_BUCKETS_SECONDS = [
    0.001,
    0.005,
    0.01,
    0.025,
    0.05,
    0.1,
    0.25,
    0.5,
    1,
    2.5,
    5,
    10
];
const STATS_TTL_MS = 5_000;
const SIZE_REFRESH_MS = 5 * 60 * 1000;
const SIZE_STARTUP_DELAY_MS = 30 * 1000;
const SIZE_SAMPLE_PER_PROVIDER = 3;
const SIZE_WALK_NODE_CAP = 300_000;
let WorkspaceCacheMetricsService = class WorkspaceCacheMetricsService {
    start(localCache) {
        this.localCache = localCache;
        this.registerGauges();
        this.scheduleSizeSampler();
    }
    stop() {
        if ((0, _utils.isDefined)(this.sizeStartupTimer)) {
            clearTimeout(this.sizeStartupTimer);
        }
        if ((0, _utils.isDefined)(this.sizeSampler)) {
            clearInterval(this.sizeSampler);
        }
    }
    recordRecompute(seconds, cacheKey) {
        this.recomputeDurationHistogram.record(seconds, {
            cache_key: cacheKey
        });
    }
    recordRedisWrite(seconds) {
        this.redisWriteDurationHistogram.record(seconds);
    }
    recordPackingRun({ durationSeconds, packed, pending }) {
        this.packingBacklog = pending;
        if (packed === 0) {
            return;
        }
        this.packingDurationHistogram.record(durationSeconds);
        this.metricsService.incrementCounterBy({
            key: _metricskeystype.MetricsKeys.WorkspaceMetadataCachePacked,
            amount: packed
        });
    }
    recordUnpacking(seconds, cacheKey) {
        this.unpackingDurationHistogram.record(seconds, {
            cache_key: cacheKey
        });
    }
    recordEviction(amount) {
        this.metricsService.incrementCounterBy({
            key: _metricskeystype.MetricsKeys.WorkspaceMetadataCacheLocalEviction,
            amount
        });
    }
    getStats() {
        const now = Date.now();
        if ((0, _utils.isDefined)(this.statsCache) && now - this.statsCache.computedAt < STATS_TTL_MS) {
            return this.statsCache;
        }
        const stats = (0, _computelocalcachestatsutil.computeLocalCacheStats)(this.localCache ?? new Map());
        this.statsCache = {
            computedAt: now,
            ...stats
        };
        return this.statsCache;
    }
    scheduleSizeSampler() {
        const sample = ()=>{
            if (this.sizeSampleInFlight) {
                return;
            }
            this.sizeSampleInFlight = true;
            this.refreshSizeBreakdown().catch((error)=>this.logger.error('Failed to sample local cache size', error)).finally(()=>{
                this.sizeSampleInFlight = false;
            });
        };
        // Prime once after startup so the gauges aren't 0 until the first 5-minute interval.
        this.sizeStartupTimer = setTimeout(sample, SIZE_STARTUP_DELAY_MS);
        this.sizeStartupTimer.unref();
        this.sizeSampler = setInterval(sample, SIZE_REFRESH_MS);
        this.sizeSampler.unref();
    }
    async refreshSizeBreakdown() {
        const localCache = this.localCache;
        if (!(0, _utils.isDefined)(localCache)) {
            return;
        }
        const perKeyName = {};
        for (const [key, entry] of localCache){
            const keyName = (0, _getkeynamefromlocalcachekeyutil.getKeyNameFromLocalCacheKey)(key);
            const stats = perKeyName[keyName] ??= {
                count: 0,
                sampledBytes: 0,
                sampled: 0
            };
            stats.count += 1;
            if (stats.sampled < SIZE_SAMPLE_PER_PROVIDER && entry.versions.size > 0) {
                // Size every retained version, not just the latest — stale versions still occupy heap.
                let entryBytes = 0;
                for (const version of entry.versions.values()){
                    entryBytes += version.state === 'packed' ? version.blob.byteLength : (0, _deepsizebytesutil.deepSizeBytes)(version.data, SIZE_WALK_NODE_CAP);
                }
                stats.sampledBytes += entryBytes;
                stats.sampled += 1;
                await new Promise((resolve)=>setImmediate(resolve));
            }
        }
        const byKeyName = {};
        let total = 0;
        for (const [keyName, stats] of Object.entries(perKeyName)){
            const estimate = stats.sampled === 0 ? 0 : Math.round(stats.sampledBytes / stats.sampled * stats.count);
            byKeyName[keyName] = estimate;
            total += estimate;
        }
        this.cacheSizeByKeyName = byKeyName;
        this.cacheSizeTotalBytes = total;
    }
    registerGauges() {
        this.metricsService.createObservableGauge({
            metricName: 'twenty_workspace_cache_local_entries',
            options: {
                description: 'Entries in the per-pod local workspace metadata cache'
            },
            callback: async ()=>this.getStats().entries
        });
        this.metricsService.createObservableGauge({
            metricName: 'twenty_workspace_cache_local_workspaces',
            options: {
                description: 'Distinct workspaces held in the per-pod local workspace metadata cache'
            },
            callback: async ()=>this.getStats().workspaces
        });
        this.metricsService.createObservableGauge({
            metricName: 'twenty_workspace_cache_local_versions_total',
            options: {
                description: 'Total versions across local workspace metadata cache entries'
            },
            callback: async ()=>this.getStats().versionsTotal
        });
        this.metricsService.createObservableGauge({
            metricName: 'twenty_workspace_cache_local_bytes_estimate',
            options: {
                description: 'Estimated retained bytes (deep-size, includes local-only providers) in the local workspace metadata cache',
                unit: 'By'
            },
            callback: async ()=>this.cacheSizeTotalBytes
        });
        this.metricsService.createMultiObservableGauge({
            metricName: 'twenty_workspace_cache_local_entries_by_version_count',
            options: {
                description: 'Local workspace metadata cache entries bucketed by version count'
            },
            callback: async ()=>Object.entries(this.getStats().versionsByCount).map(([versions, value])=>({
                        value,
                        attributes: {
                            versions
                        }
                    }))
        });
        this.metricsService.createMultiObservableGauge({
            metricName: 'twenty_workspace_cache_local_bytes_by_provider',
            options: {
                description: 'Estimated retained bytes in the local workspace metadata cache per provider',
                unit: 'By'
            },
            callback: async ()=>Object.entries(this.cacheSizeByKeyName).map(([keyName, value])=>({
                        value,
                        attributes: {
                            provider: keyName
                        }
                    }))
        });
        this.metricsService.createMultiObservableGauge({
            metricName: 'twenty_workspace_cache_local_entries_by_provider',
            options: {
                description: 'Entries in the local workspace metadata cache per provider'
            },
            callback: async ()=>Object.entries(this.getStats().entriesByKeyName).map(([keyName, value])=>({
                        value,
                        attributes: {
                            provider: keyName
                        }
                    }))
        });
        this.metricsService.createMultiObservableGauge({
            metricName: 'twenty_workspace_cache_local_versions_by_state',
            options: {
                description: 'Local workspace metadata cache versions by tier (live or packed) and provider'
            },
            callback: async ()=>{
                const stats = this.getStats();
                return [
                    ...Object.entries(stats.liveVersionsByKeyName).map(([keyName, value])=>({
                            value,
                            attributes: {
                                provider: keyName,
                                state: 'live'
                            }
                        })),
                    ...Object.entries(stats.packedVersionsByKeyName).map(([keyName, value])=>({
                            value,
                            attributes: {
                                provider: keyName,
                                state: 'packed'
                            }
                        }))
                ];
            }
        });
        this.metricsService.createObservableGauge({
            metricName: 'twenty_workspace_cache_local_live_versions',
            options: {
                description: 'Total live (object graph) versions in the local workspace metadata cache'
            },
            callback: async ()=>this.getStats().liveVersionsTotal
        });
        this.metricsService.createObservableGauge({
            metricName: 'twenty_workspace_cache_local_packed_versions',
            options: {
                description: 'Total packed (serialized buffer) versions in the local workspace metadata cache'
            },
            callback: async ()=>this.getStats().packedVersionsTotal
        });
        this.metricsService.createObservableGauge({
            metricName: 'twenty_workspace_cache_local_packed_bytes',
            options: {
                description: 'Exact retained bytes held as packed buffers in the local workspace metadata cache',
                unit: 'By'
            },
            callback: async ()=>this.getStats().packedBytesTotal
        });
        this.metricsService.createObservableGauge({
            metricName: 'twenty_workspace_cache_packing_backlog',
            options: {
                description: 'Versions currently eligible for packing, whether or not the last run reached them'
            },
            callback: async ()=>this.packingBacklog
        });
    }
    constructor(metricsService){
        this.metricsService = metricsService;
        this.logger = new _common.Logger(WorkspaceCacheMetricsService.name);
        this.cacheSizeByKeyName = {};
        this.cacheSizeTotalBytes = 0;
        this.sizeSampleInFlight = false;
        this.packingBacklog = 0;
        const meter = this.metricsService.getMeter();
        this.recomputeDurationHistogram = meter.createHistogram('twenty_workspace_cache_recompute_duration_seconds', {
            description: 'Wall-clock time to compute one workspace metadata cache entry from its provider',
            unit: 's',
            advice: {
                explicitBucketBoundaries: CACHE_DURATION_BUCKETS_SECONDS
            }
        });
        this.redisWriteDurationHistogram = meter.createHistogram('twenty_workspace_cache_redis_write_duration_seconds', {
            description: 'Wall-clock time to serialize and write recomputed cache entries to Redis',
            unit: 's',
            advice: {
                explicitBucketBoundaries: CACHE_DURATION_BUCKETS_SECONDS
            }
        });
        this.packingDurationHistogram = meter.createHistogram('twenty_workspace_cache_packing_run_duration_seconds', {
            description: 'Event loop time consumed by one packing run',
            unit: 's',
            advice: {
                explicitBucketBoundaries: CACHE_DURATION_BUCKETS_SECONDS
            }
        });
        this.unpackingDurationHistogram = meter.createHistogram('twenty_workspace_cache_unpacking_duration_seconds', {
            description: 'Wall-clock time to unpack one packed cache version back into objects on read',
            unit: 's',
            advice: {
                explicitBucketBoundaries: CACHE_DURATION_BUCKETS_SECONDS
            }
        });
    }
};
WorkspaceCacheMetricsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], WorkspaceCacheMetricsService);

//# sourceMappingURL=workspace-cache-metrics.service.js.map