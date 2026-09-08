"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PromiseMemoizer", {
    enumerable: true,
    get: function() {
        return PromiseMemoizer;
    }
});
const ONE_HOUR_IN_MS = 3600_000;
let PromiseMemoizer = class PromiseMemoizer {
    async memoizePromiseAndExecute(cacheKey, factory, onDelete) {
        await this.clearExpiredKeys(onDelete);
        const existingEntry = this.cache.get(cacheKey);
        if (existingEntry) {
            return existingEntry.state === 'resolved' ? existingEntry.value : existingEntry.promise;
        }
        const generation = Symbol();
        const newPromise = (async ()=>{
            try {
                const value = await factory();
                const currentEntry = this.cache.get(cacheKey);
                if (value && currentEntry?.state === 'pending' && currentEntry.generation === generation) {
                    this.cache.set(cacheKey, {
                        state: 'resolved',
                        value,
                        expiresAt: Date.now() + this.ttlMs
                    });
                }
                return value;
            } finally{
                const currentEntry = this.cache.get(cacheKey);
                if (currentEntry?.state === 'pending' && currentEntry.generation === generation) {
                    this.cache.delete(cacheKey);
                }
            }
        })();
        this.cache.set(cacheKey, {
            state: 'pending',
            generation,
            promise: newPromise
        });
        return newPromise;
    }
    async clearExpiredKeys(onDelete) {
        const now = Date.now();
        for (const [cacheKey, cachedEntry] of this.cache.entries()){
            if (cachedEntry.state === 'resolved' && cachedEntry.expiresAt <= now) {
                await this.clearKey(cacheKey, onDelete);
            }
        }
    }
    async clearKey(cacheKey, onDelete) {
        const cachedValue = this.cache.get(cacheKey);
        if (cachedValue?.state === 'resolved') {
            await onDelete?.(cachedValue.value);
        }
        this.cache.delete(cacheKey);
    }
    async clearKeys(cacheKeyPrefix, onDelete) {
        for (const cacheKey of [
            ...this.cache.keys()
        ]){
            if (cacheKey.startsWith(cacheKeyPrefix)) {
                await this.clearKey(cacheKey, onDelete);
            }
        }
    }
    async clearAll(onDelete) {
        for (const [, entry] of this.cache.entries()){
            if (entry.state === 'resolved') {
                await onDelete?.(entry.value);
            }
        }
        this.cache.clear();
    }
    constructor(ttlMs = ONE_HOUR_IN_MS){
        this.cache = new Map();
        this.ttlMs = ttlMs;
    }
};

//# sourceMappingURL=promise-memoizer.storage.js.map