"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "packIdleVersions", {
    enumerable: true,
    get: function() {
        return packIdleVersions;
    }
});
const _utils = require("twenty-shared/utils");
const packIdleVersions = ({ localCache, minIdleMs, ponderationBudget, ponderationOf, isPackable, pack, nowEpochMs = ()=>Date.now() })=>{
    const idleSince = nowEpochMs() - minIdleMs;
    const candidates = [];
    for (const [localKey, entry] of localCache){
        if (!isPackable(localKey)) {
            continue;
        }
        const rawPonderation = ponderationOf(localKey);
        const ponderation = Number.isFinite(rawPonderation) && rawPonderation >= 1 ? Math.floor(rawPonderation) : 1;
        if (ponderation > ponderationBudget) {
            continue;
        }
        for (const [hash, version] of entry.versions){
            if (version.state === 'live' && version.lastReadAt <= idleSince) {
                candidates.push({
                    localKey,
                    hash,
                    lastReadAt: version.lastReadAt,
                    ponderation
                });
            }
        }
    }
    candidates.sort((a, b)=>a.lastReadAt - b.lastReadAt);
    let packed = 0;
    let spentPonderation = 0;
    for (const { localKey, hash, ponderation } of candidates){
        if (spentPonderation >= ponderationBudget) {
            break;
        }
        if (spentPonderation + ponderation > ponderationBudget) {
            continue;
        }
        const entry = localCache.get(localKey);
        const version = entry?.versions.get(hash);
        if (!(0, _utils.isDefined)(entry) || version?.state !== 'live') {
            continue;
        }
        const blob = pack({
            localKey,
            data: version.data
        });
        if (!(0, _utils.isDefined)(blob)) {
            continue;
        }
        entry.versions.set(hash, {
            state: 'packed',
            blob,
            lastReadAt: version.lastReadAt
        });
        packed += 1;
        spentPonderation += ponderation;
    }
    return {
        packed,
        pending: candidates.length - packed
    };
};

//# sourceMappingURL=pack-idle-versions.util.js.map