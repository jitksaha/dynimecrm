"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sweepLocalCache", {
    enumerable: true,
    get: function() {
        return sweepLocalCache;
    }
});
const lastReadAtOf = (entry)=>entry.versions.get(entry.latestHash)?.lastReadAt ?? 0;
const evictLeastRecentlyRead = ({ localCache, matches, maxEntries, minEvict })=>{
    const matching = [];
    for (const keyEntry of localCache){
        if (matches(keyEntry[0])) {
            matching.push(keyEntry);
        }
    }
    if (matching.length <= maxEntries) {
        return 0;
    }
    matching.sort((a, b)=>lastReadAtOf(a[1]) - lastReadAtOf(b[1]));
    const evictCount = Math.min(matching.length, Math.max(minEvict, matching.length - maxEntries));
    for(let index = 0; index < evictCount; index += 1){
        localCache.delete(matching[index][0]);
    }
    return evictCount;
};
const sweepLocalCache = (localCache, now, config)=>{
    let evicted = 0;
    for (const [localKey, entry] of localCache){
        for (const [hash, version] of entry.versions){
            if (now - version.lastReadAt > config.ttlMs) {
                entry.versions.delete(hash);
            }
        }
        if (entry.versions.size === 0 || !entry.versions.has(entry.latestHash)) {
            localCache.delete(localKey);
            evicted += 1;
        }
    }
    for (const [keyName, maxEntries] of config.maxEntriesByKeyName){
        evicted += evictLeastRecentlyRead({
            localCache,
            matches: (key)=>key.startsWith(`${keyName}:`),
            maxEntries,
            minEvict: 0
        });
    }
    evicted += evictLeastRecentlyRead({
        localCache,
        matches: ()=>true,
        maxEntries: config.globalMaxEntries,
        minEvict: config.minEvict
    });
    return evicted;
};

//# sourceMappingURL=sweep-local-cache.util.js.map