"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeLocalCacheStats", {
    enumerable: true,
    get: function() {
        return computeLocalCacheStats;
    }
});
const _getkeynamefromlocalcachekeyutil = require("./get-key-name-from-local-cache-key.util");
const computeLocalCacheStats = (localCache)=>{
    const workspaceIds = new Set();
    const versionsByCount = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5+': 0
    };
    const entriesByKeyName = {};
    const liveVersionsByKeyName = {};
    const packedVersionsByKeyName = {};
    const packedBytesByKeyName = {};
    let versionsTotal = 0;
    let liveVersionsTotal = 0;
    let packedVersionsTotal = 0;
    let packedBytesTotal = 0;
    for (const [key, entry] of localCache){
        workspaceIds.add(key.slice(key.lastIndexOf(':') + 1));
        const keyName = (0, _getkeynamefromlocalcachekeyutil.getKeyNameFromLocalCacheKey)(key);
        entriesByKeyName[keyName] = (entriesByKeyName[keyName] ?? 0) + 1;
        liveVersionsByKeyName[keyName] ??= 0;
        packedVersionsByKeyName[keyName] ??= 0;
        packedBytesByKeyName[keyName] ??= 0;
        const versionCount = entry.versions.size;
        versionsTotal += versionCount;
        const bucket = versionCount >= 5 ? '5+' : String(versionCount);
        versionsByCount[bucket] = (versionsByCount[bucket] ?? 0) + 1;
        for (const version of entry.versions.values()){
            if (version.state === 'packed') {
                packedVersionsByKeyName[keyName] += 1;
                packedVersionsTotal += 1;
                packedBytesByKeyName[keyName] += version.blob.byteLength;
                packedBytesTotal += version.blob.byteLength;
                continue;
            }
            liveVersionsByKeyName[keyName] += 1;
            liveVersionsTotal += 1;
        }
    }
    return {
        entries: localCache.size,
        workspaces: workspaceIds.size,
        versionsTotal,
        versionsByCount,
        entriesByKeyName,
        liveVersionsByKeyName,
        packedVersionsByKeyName,
        packedBytesByKeyName,
        liveVersionsTotal,
        packedVersionsTotal,
        packedBytesTotal
    };
};

//# sourceMappingURL=compute-local-cache-stats.util.js.map