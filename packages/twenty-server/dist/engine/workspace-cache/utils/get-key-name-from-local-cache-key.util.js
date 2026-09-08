"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getKeyNameFromLocalCacheKey", {
    enumerable: true,
    get: function() {
        return getKeyNameFromLocalCacheKey;
    }
});
const getKeyNameFromLocalCacheKey = (localCacheKey)=>localCacheKey.slice(0, localCacheKey.lastIndexOf(':'));

//# sourceMappingURL=get-key-name-from-local-cache-key.util.js.map