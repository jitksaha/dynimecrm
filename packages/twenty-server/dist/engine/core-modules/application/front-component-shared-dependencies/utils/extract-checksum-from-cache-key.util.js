"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractChecksumFromCacheKey", {
    enumerable: true,
    get: function() {
        return extractChecksumFromCacheKey;
    }
});
const SHARED_DEPENDENCIES_CACHE_KEY_PATTERN = /^([0-9a-f]{64})\.js$/;
const extractChecksumFromCacheKey = (cacheKey)=>cacheKey?.match(SHARED_DEPENDENCIES_CACHE_KEY_PATTERN)?.[1];

//# sourceMappingURL=extract-checksum-from-cache-key.util.js.map