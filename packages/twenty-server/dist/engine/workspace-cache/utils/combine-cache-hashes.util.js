"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "combineCacheHashes", {
    enumerable: true,
    get: function() {
        return combineCacheHashes;
    }
});
const _crypto = require("crypto");
const _utils = require("twenty-shared/utils");
const combineCacheHashes = (hashes, cacheKeyNames)=>{
    if (cacheKeyNames.length === 0) {
        throw new Error('Cannot combine cache hashes without cache key names');
    }
    const orderedHashes = [
        ...cacheKeyNames
    ].sort().map((cacheKeyName)=>{
        const hash = hashes[cacheKeyName];
        if (!(0, _utils.isDefined)(hash)) {
            throw new Error(`Missing cache hash for "${cacheKeyName}"`);
        }
        return hash;
    });
    return (0, _crypto.createHash)('sha256').update(orderedHashes.join(':')).digest('hex');
};

//# sourceMappingURL=combine-cache-hashes.util.js.map