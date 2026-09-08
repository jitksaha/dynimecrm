"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceCacheService;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _typeorm = require("@nestjs/typeorm");
const _node = /*#__PURE__*/ _interop_require_wildcard(require("@sentry/node"));
const _crypto = /*#__PURE__*/ _interop_require_default(require("crypto"));
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _workspacecacheproviderservice = require("../interfaces/workspace-cache-provider.service");
const _cachestoragedecorator = require("../../core-modules/cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../core-modules/cache-storage/types/cache-storage-namespace.enum");
const _twentyconfigservice = require("../../core-modules/twenty-config/twenty-config.service");
const _promisememoizerstorage = require("../../twenty-orm/storage/promise-memoizer.storage");
const _workspacecachedecorator = require("../decorators/workspace-cache.decorator");
const _workspacecacheexception = require("../exceptions/workspace-cache.exception");
const _workspacecachemetricsservice = require("./workspace-cache-metrics.service");
const _workspacecacherowsbatchloader = require("./workspace-cache-rows-batch-loader");
const _combinecachehashesutil = require("../utils/combine-cache-hashes.util");
const _getkeynamefromlocalcachekeyutil = require("../utils/get-key-name-from-local-cache-key.util");
const _packidleversionsutil = require("../utils/pack-idle-versions.util");
const _serializecacheblobutil = require("../utils/serialize-cache-blob.util");
const _sweeplocalcacheutil = require("../utils/sweep-local-cache.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
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
const LOCAL_TTL_MS = 100; // 100ms
const MEMOIZER_TTL_MS = 10_000; // 10 seconds
const STALE_VERSION_TTL_MS = 5_000; // 5 seconds
const MAX_LOCAL_STALE_VERSIONS = 5; // 5 stale versions
// Sized against 4 GiB pods (--max-old-space-size=3500): 7,500 sat at the heap ceiling.
const MAX_LOCAL_CACHE_ENTRIES = 6_000;
const MIN_EVICT_KEYS = 100;
const LOCAL_ENTRY_TTL_MS = 30 * 60 * 1000; // 30 minutes idle
const LOCAL_CACHE_SWEEP_INTERVAL_MS = 60 * 1000;
const PACKING_INTERVAL_MS = 500;
const PACKING_PONDERATION_BUDGET = 64;
const MIN_IDLE_BEFORE_PACKING_MS = 60 * 1000;
// Per-provider entry caps, keyed by local cache key prefix (ORM graphs are ~5 MB each).
const MAX_LOCAL_ENTRIES_BY_KEY_NAME = new Map([
    [
        'ORMEntityMetadatas',
        128
    ],
    [
        'flatFieldMetadataMaps',
        256
    ],
    [
        'flatFieldMetadataMapsOrm',
        512
    ]
]);
let WorkspaceCacheService = class WorkspaceCacheService {
    async onModuleInit() {
        const providers = this.discoveryService.getProviders();
        for (const wrapper of providers){
            const { instance } = wrapper;
            if (!(0, _utils.isDefined)(instance) || typeof instance !== 'object') {
                continue;
            }
            const workspaceCacheKeyName = this.reflector.get(_workspacecachedecorator.WORKSPACE_CACHE_KEY, instance.constructor);
            if ((0, _utils.isDefined)(workspaceCacheKeyName) && instance instanceof _workspacecacheproviderservice.WorkspaceCacheProvider) {
                this.workspaceCacheProviders.set(workspaceCacheKeyName, instance);
                const options = this.reflector.get(_workspacecachedecorator.WORKSPACE_CACHE_OPTIONS, instance.constructor);
                if ((0, _utils.isDefined)(options)) {
                    if (options.localDataOnly) {
                        this.localDataOnlyKeys.add(workspaceCacheKeyName);
                    }
                    this.packingPonderationByKey.set(workspaceCacheKeyName, options.packingPonderation);
                }
            }
        }
        this.cacheMetricsService.start(this.localCache);
        this.startMaintenanceTimers();
    }
    onModuleDestroy() {
        if ((0, _utils.isDefined)(this.sweepTimer)) {
            clearInterval(this.sweepTimer);
        }
        if ((0, _utils.isDefined)(this.packingTimer)) {
            clearInterval(this.packingTimer);
        }
        this.cacheMetricsService.stop();
    }
    startMaintenanceTimers() {
        this.sweepTimer = setInterval(()=>this.sweepLocalCache(), LOCAL_CACHE_SWEEP_INTERVAL_MS);
        this.sweepTimer.unref();
        this.packingTimer = setInterval(()=>this.runPacking(), PACKING_INTERVAL_MS);
        this.packingTimer.unref();
    }
    async getOrRecompute(workspaceId, cacheKeyNames) {
        const { data } = await this.getOrRecomputeWithHashes(workspaceId, cacheKeyNames);
        return data;
    }
    async getOrRecomputeWithHashes(workspaceId, cacheKeyNames) {
        this.assertValidCacheParameters(workspaceId, cacheKeyNames);
        const memoKey = `${workspaceId}-${[
            ...cacheKeyNames
        ].sort().join(',')}`;
        const result = await this.memoizer.memoizePromiseAndExecute(memoKey, async ()=>{
            const { freshKeys, staleKeys } = this.checkLocalTTL(workspaceId, cacheKeyNames);
            const freshEntries = this.getFromLocalCache(workspaceId, freshKeys);
            if (staleKeys.length === 0) {
                return freshEntries;
            }
            const { validKeys, keysNeedingDataFromRedis, keysNeedingRecompute, adoptableHashes } = await this.validateLocalHashAgainstRedisHash(workspaceId, staleKeys);
            const validatedEntries = this.getFromLocalCache(workspaceId, validKeys);
            const { redisEntries, missingInRedis } = await this.fetchDataFromRedis(workspaceId, keysNeedingDataFromRedis);
            const keysToRecompute = [
                ...keysNeedingRecompute,
                ...missingInRedis
            ];
            const recomputedEntries = await this.recomputeDataFromProvider(workspaceId, keysToRecompute, {
                strategy: 'recover',
                adoptableHashes
            });
            return {
                data: {
                    ...freshEntries.data,
                    ...validatedEntries.data,
                    ...redisEntries.data,
                    ...recomputedEntries.data
                },
                hashes: {
                    ...freshEntries.hashes,
                    ...validatedEntries.hashes,
                    ...redisEntries.hashes,
                    ...recomputedEntries.hashes
                }
            };
        });
        return result;
    }
    async getOrRecomputeCombinedHash(workspaceId, cacheKeyNames) {
        this.assertValidCacheParameters(workspaceId, cacheKeyNames);
        const cachedHashes = await this.getCacheHashes(workspaceId, cacheKeyNames);
        const missingKeys = cacheKeyNames.filter((cacheKeyName)=>!(0, _utils.isDefined)(cachedHashes[cacheKeyName]));
        if (missingKeys.length === 0) {
            return (0, _combinecachehashesutil.combineCacheHashes)(cachedHashes, cacheKeyNames);
        }
        const { hashes: recomputedHashes } = await this.getOrRecomputeWithHashes(workspaceId, missingKeys);
        return (0, _combinecachehashesutil.combineCacheHashes)({
            ...cachedHashes,
            ...recomputedHashes
        }, cacheKeyNames);
    }
    collectRowsRequirements(cacheKeyNames) {
        return cacheKeyNames.map((keyName)=>this.getProviderOrThrow(keyName).rowsRequirement);
    }
    async invalidateAndRecompute(workspaceId, cacheKeyNames) {
        return _node.startSpan({
            name: 'invalidate and recompute workspace metadata cache',
            op: 'cache.invalidate',
            onlyIfParent: true,
            attributes: {
                'cache.key_count': cacheKeyNames.length
            }
        }, async ()=>{
            await this.memoizer.clearKeys(`${workspaceId}-`);
            await this.flush(workspaceId, cacheKeyNames);
            await this.recomputeDataFromProvider(workspaceId, cacheKeyNames, {
                strategy: 'mint'
            });
            // Clear memoizer again after recomputation to evict any stale entries
            // cached by concurrent getOrRecompute calls during the flush window.
            await this.memoizer.clearKeys(`${workspaceId}-`);
        });
    }
    async getCacheHashes(workspaceId, cacheKeyNames) {
        if (cacheKeyNames.length === 0) {
            return {};
        }
        const hashKeys = cacheKeyNames.map((keyName)=>`${this.buildCacheKey(workspaceId, keyName)}:hash`);
        const hashes = await this.cacheStorage.mget(hashKeys);
        const result = {};
        for (const [index, keyName] of cacheKeyNames.entries()){
            if ((0, _utils.isDefined)(hashes[index])) {
                result[keyName] = hashes[index];
            }
        }
        return result;
    }
    async flush(workspaceId, cacheKeyNames) {
        await this.deleteFromRedis(workspaceId, cacheKeyNames);
        this.deleteFromLocalCache(workspaceId, cacheKeyNames);
    }
    assertValidCacheParameters(workspaceId, cacheKeyNames) {
        if (!(0, _utils.isDefined)(workspaceId) || cacheKeyNames.length === 0 || !(0, _utils.isValidUuid)(workspaceId)) {
            throw new _workspacecacheexception.WorkspaceCacheException('Invalid parameters: workspace ID and cache key names are required', _workspacecacheexception.WorkspaceCacheExceptionCode.INVALID_PARAMETERS);
        }
    }
    checkLocalTTL(workspaceId, cacheKeyNames) {
        const freshKeys = [];
        const staleKeys = [];
        const now = Date.now();
        for (const keyName of cacheKeyNames){
            const localKey = this.buildCacheKey(workspaceId, keyName);
            const cached = this.localCache.get(localKey);
            if ((0, _utils.isDefined)(cached) && now - cached.lastHashCheckedAt < LOCAL_TTL_MS) {
                freshKeys.push(keyName);
            } else {
                staleKeys.push(keyName);
            }
        }
        return {
            freshKeys,
            staleKeys
        };
    }
    async validateLocalHashAgainstRedisHash(workspaceId, cacheKeyNames) {
        const validKeys = [];
        const keysNeedingDataFromRedis = [];
        const keysNeedingRecompute = [];
        const adoptableHashes = {};
        if (cacheKeyNames.length === 0) {
            return {
                validKeys,
                keysNeedingDataFromRedis,
                keysNeedingRecompute,
                adoptableHashes
            };
        }
        const hashKeys = cacheKeyNames.map((keyName)=>`${this.buildCacheKey(workspaceId, keyName)}:hash`);
        const redisHashes = await this.cacheStorage.mget(hashKeys);
        for (const [index, keyName] of cacheKeyNames.entries()){
            const redisHash = redisHashes[index];
            const localKey = this.buildCacheKey(workspaceId, keyName);
            const localEntry = this.localCache.get(localKey);
            if ((0, _utils.isDefined)(localEntry) && (0, _utils.isDefined)(redisHash) && localEntry.latestHash === redisHash) {
                localEntry.lastHashCheckedAt = Date.now();
                validKeys.push(keyName);
            } else if (this.localDataOnlyKeys.has(keyName)) {
                keysNeedingRecompute.push(keyName);
                if ((0, _utils.isDefined)(redisHash)) {
                    adoptableHashes[keyName] = redisHash;
                }
            } else {
                keysNeedingDataFromRedis.push(keyName);
            }
        }
        return {
            validKeys,
            keysNeedingDataFromRedis,
            keysNeedingRecompute,
            adoptableHashes
        };
    }
    async fetchDataFromRedis(workspaceId, cacheKeyNames) {
        const redisEntries = {
            data: {},
            hashes: {}
        };
        const missingInRedis = [];
        if (cacheKeyNames.length === 0) {
            return {
                redisEntries,
                missingInRedis
            };
        }
        // Interleave data and hash keys for atomic fetch: [data1, hash1, data2, hash2, ...]
        const allKeys = cacheKeyNames.flatMap((keyName)=>{
            const baseKey = this.buildCacheKey(workspaceId, keyName);
            return [
                `${baseKey}:data`,
                `${baseKey}:hash`
            ];
        });
        const allValues = await this.cacheStorage.mget(allKeys);
        for (const [index, keyName] of cacheKeyNames.entries()){
            const rawData = allValues[index * 2];
            const hash = allValues[index * 2 + 1];
            if ((0, _utils.isDefined)(rawData) && (0, _utils.isDefined)(hash)) {
                let data;
                try {
                    data = this.getProviderOrThrow(keyName).expandFromStorage(rawData);
                } catch (error) {
                    this.logger.warn(`Failed to expand cached ${keyName} for workspace ${workspaceId}, recomputing`, error);
                    missingInRedis.push(keyName);
                    continue;
                }
                Object.assign(redisEntries.data, {
                    [keyName]: data
                });
                redisEntries.hashes[keyName] = hash;
                this.setInLocalCache(workspaceId, keyName, data, hash);
            } else {
                missingInRedis.push(keyName);
            }
        }
        return {
            redisEntries,
            missingInRedis
        };
    }
    async recomputeDataFromProvider(workspaceId, cacheKeyNames, hashResolution) {
        const result = {
            data: {},
            hashes: {}
        };
        if (cacheKeyNames.length === 0) {
            return result;
        }
        const rowsBatchLoader = new _workspacecacherowsbatchloader.WorkspaceCacheRowsBatchLoader(this.coreDataSource, workspaceId);
        await rowsBatchLoader.loadRows(this.collectRowsRequirements(cacheKeyNames));
        const computePromises = cacheKeyNames.map(async (keyName)=>{
            const provider = this.getProviderOrThrow(keyName);
            const isLocalDataOnly = this.localDataOnlyKeys.has(keyName);
            const computeStartedAt = performance.now();
            try {
                const data = await _node.startSpan({
                    name: 'compute workspace metadata cache entry from provider',
                    op: 'cache.recompute',
                    onlyIfParent: true,
                    attributes: {
                        'cache.key_name': keyName,
                        'cache.recompute.strategy': hashResolution.strategy,
                        'cache.local_data_only': isLocalDataOnly
                    }
                }, ()=>provider.computeForCache({
                        workspaceId,
                        rows: rowsBatchLoader.readRows(provider.rowsRequirement)
                    }));
                if (hashResolution.strategy === 'mint') {
                    return {
                        keyName,
                        data,
                        hash: _crypto.default.randomUUID(),
                        isAdopted: false
                    };
                }
                const adoptableHash = hashResolution.adoptableHashes[keyName];
                return {
                    keyName,
                    data,
                    hash: adoptableHash ?? _crypto.default.randomUUID(),
                    isAdopted: (0, _utils.isDefined)(adoptableHash)
                };
            } finally{
                this.cacheMetricsService.recordRecompute((performance.now() - computeStartedAt) / 1000, keyName);
            }
        });
        const settledComputes = await Promise.allSettled(computePromises);
        const { computed, computeFailures } = settledComputes.reduce((acc, settled, index)=>{
            if (settled.status === 'fulfilled') {
                acc.computed.push(settled.value);
            } else {
                acc.computeFailures.push({
                    keyName: cacheKeyNames[index],
                    reason: settled.reason
                });
            }
            return acc;
        }, {
            computed: [],
            computeFailures: []
        });
        const redisEntries = [];
        const bootstrapHashEntries = [];
        for (const { keyName, data, hash, isAdopted } of computed){
            Object.assign(result.data, {
                [keyName]: data
            });
            result.hashes[keyName] = hash;
            const baseKey = this.buildCacheKey(workspaceId, keyName);
            const isLocalDataOnly = this.localDataOnlyKeys.has(keyName);
            const isRecoveryBootstrap = hashResolution.strategy === 'recover' && !isAdopted && isLocalDataOnly;
            if (isRecoveryBootstrap) {
                bootstrapHashEntries.push({
                    key: `${baseKey}:hash`,
                    value: hash
                });
            } else if (!isAdopted) {
                redisEntries.push({
                    key: `${baseKey}:hash`,
                    value: hash
                });
            }
            if (!isLocalDataOnly) {
                redisEntries.push({
                    key: `${baseKey}:data`,
                    value: this.getProviderOrThrow(keyName).compactForStorage(data)
                });
            }
            this.setInLocalCache(workspaceId, keyName, data, hash);
        }
        if (redisEntries.length > 0) {
            const redisWriteStartedAt = performance.now();
            try {
                await this.cacheStorage.mset(redisEntries);
            } finally{
                this.cacheMetricsService.recordRedisWrite((performance.now() - redisWriteStartedAt) / 1000);
            }
        }
        if (bootstrapHashEntries.length > 0) {
            const bootstrapHashTtlMs = this.twentyConfigService.get('CACHE_STORAGE_TTL') * 1000;
            await Promise.all(bootstrapHashEntries.map(({ key, value })=>this.cacheStorage.setIfAbsent(key, value, bootstrapHashTtlMs)));
        }
        if (computeFailures.length > 0) {
            computeFailures.forEach(({ keyName, reason })=>this.logger.error(`Failed to compute cache key '${keyName}': ${reason}`));
            throw computeFailures[0].reason;
        }
        return result;
    }
    getFromLocalCache(workspaceId, workspaceCacheKeyNames) {
        const result = {
            data: {},
            hashes: {}
        };
        for (const keyName of workspaceCacheKeyNames){
            const localKey = this.buildCacheKey(workspaceId, keyName);
            const entry = this.localCache.get(localKey);
            const version = entry?.versions.get(entry.latestHash);
            if ((0, _utils.isDefined)(entry) && (0, _utils.isDefined)(version)) {
                const data = this.readVersion({
                    keyName,
                    entry,
                    hash: entry.latestHash,
                    version
                });
                Object.assign(result.data, {
                    [keyName]: data
                });
                result.hashes[keyName] = entry.latestHash;
                this.cleanupStaleVersions(entry);
            }
        }
        return result;
    }
    deleteFromLocalCache(workspaceId, cacheKeyNames) {
        for (const keyName of cacheKeyNames){
            const localKey = this.buildCacheKey(workspaceId, keyName);
            const entry = this.localCache.get(localKey);
            if ((0, _utils.isDefined)(entry)) {
                entry.lastHashCheckedAt = 0;
            }
        }
    }
    async deleteFromRedis(workspaceId, cacheKeyNames) {
        const keysToDelete = cacheKeyNames.flatMap((keyName)=>{
            const baseKey = this.buildCacheKey(workspaceId, keyName);
            return [
                `${baseKey}:data`,
                `${baseKey}:hash`
            ];
        });
        await this.cacheStorage.mdel(keysToDelete);
    }
    setInLocalCache(workspaceId, keyName, data, hash) {
        const localKey = this.buildCacheKey(workspaceId, keyName);
        let entry = this.localCache.get(localKey);
        if (!(0, _utils.isDefined)(entry)) {
            entry = {
                versions: new Map(),
                latestHash: '',
                lastHashCheckedAt: 0
            };
            this.localCache.set(localKey, entry);
        }
        entry.versions.set(hash, {
            state: 'live',
            data,
            lastReadAt: Date.now()
        });
        entry.latestHash = hash;
        entry.lastHashCheckedAt = Date.now();
        this.cleanupStaleVersions(entry);
    }
    sweepLocalCache() {
        const now = Date.now();
        const evicted = (0, _sweeplocalcacheutil.sweepLocalCache)(this.localCache, now, {
            ttlMs: LOCAL_ENTRY_TTL_MS,
            maxEntriesByKeyName: MAX_LOCAL_ENTRIES_BY_KEY_NAME,
            globalMaxEntries: MAX_LOCAL_CACHE_ENTRIES,
            minEvict: MIN_EVICT_KEYS
        });
        if (evicted > 0) {
            this.cacheMetricsService.recordEviction(evicted);
        }
    }
    runPacking() {
        const startedAt = performance.now();
        const { packed, pending } = (0, _packidleversionsutil.packIdleVersions)({
            localCache: this.localCache,
            minIdleMs: MIN_IDLE_BEFORE_PACKING_MS,
            ponderationBudget: PACKING_PONDERATION_BUDGET,
            ponderationOf: (localKey)=>this.packingPonderationByKey.get((0, _getkeynamefromlocalcachekeyutil.getKeyNameFromLocalCacheKey)(localKey)),
            isPackable: (localKey)=>!this.localDataOnlyKeys.has((0, _getkeynamefromlocalcachekeyutil.getKeyNameFromLocalCacheKey)(localKey)),
            pack: ({ localKey, data })=>{
                const keyName = (0, _getkeynamefromlocalcachekeyutil.getKeyNameFromLocalCacheKey)(localKey);
                return (0, _serializecacheblobutil.serializeCacheBlob)(this.getProviderOrThrow(keyName).compactForStorage(data));
            }
        });
        this.cacheMetricsService.recordPackingRun({
            durationSeconds: (performance.now() - startedAt) / 1000,
            packed,
            pending
        });
    }
    readVersion({ keyName, entry, hash, version }) {
        if (version.state === 'live') {
            version.lastReadAt = Date.now();
            return version.data;
        }
        const unpackStartedAt = performance.now();
        const data = this.getProviderOrThrow(keyName).expandFromStorage((0, _serializecacheblobutil.deserializeCacheBlob)(version.blob));
        entry.versions.set(hash, {
            state: 'live',
            data,
            lastReadAt: Date.now()
        });
        this.cacheMetricsService.recordUnpacking((performance.now() - unpackStartedAt) / 1000, keyName);
        return data;
    }
    cleanupStaleVersions(entry) {
        const now = Date.now();
        for (const [hash, version] of entry.versions){
            if (hash !== entry.latestHash && now - version.lastReadAt > STALE_VERSION_TTL_MS) {
                entry.versions.delete(hash);
            }
        }
        if (entry.versions.size >= MAX_LOCAL_STALE_VERSIONS) {
            const sorted = [
                ...entry.versions.entries()
            ].filter(([hash])=>hash !== entry.latestHash).sort((entryA, entryB)=>entryA[1].lastReadAt - entryB[1].lastReadAt);
            while(entry.versions.size >= MAX_LOCAL_STALE_VERSIONS && sorted.length > 0){
                const oldestEntry = sorted.shift();
                if ((0, _utils.isDefined)(oldestEntry)) {
                    entry.versions.delete(oldestEntry[0]);
                }
            }
        }
    }
    getProviderOrThrow(keyName) {
        const provider = this.workspaceCacheProviders.get(keyName);
        if (!(0, _utils.isDefined)(provider)) {
            throw new Error(`Cache provider with key name "${keyName}" not found`);
        }
        return provider;
    }
    buildCacheKey(workspaceId, keyName) {
        return `${keyName}:${workspaceId}`;
    }
    constructor(cacheStorage, coreDataSource, discoveryService, reflector, cacheMetricsService, twentyConfigService){
        this.cacheStorage = cacheStorage;
        this.coreDataSource = coreDataSource;
        this.discoveryService = discoveryService;
        this.reflector = reflector;
        this.cacheMetricsService = cacheMetricsService;
        this.twentyConfigService = twentyConfigService;
        this.localCache = new Map();
        this.workspaceCacheProviders = new Map();
        this.localDataOnlyKeys = new Set();
        this.packingPonderationByKey = new Map();
        this.memoizer = new _promisememoizerstorage.PromiseMemoizer(MEMOIZER_TTL_MS);
        this.logger = new _common.Logger(WorkspaceCacheService.name);
    }
};
WorkspaceCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.EngineWorkspace)),
    _ts_param(1, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _core.DiscoveryService === "undefined" ? Object : _core.DiscoveryService,
        typeof _core.Reflector === "undefined" ? Object : _core.Reflector,
        typeof _workspacecachemetricsservice.WorkspaceCacheMetricsService === "undefined" ? Object : _workspacecachemetricsservice.WorkspaceCacheMetricsService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], WorkspaceCacheService);

//# sourceMappingURL=workspace-cache.service.js.map