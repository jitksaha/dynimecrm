"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "enableValidationMetadataCache", {
    enumerable: true,
    get: function() {
        return enableValidationMetadataCache;
    }
});
const _classvalidator = require("class-validator");
let installed = false;
const enableValidationMetadataCache = ()=>{
    if (installed) {
        return;
    }
    installed = true;
    const storage = (0, _classvalidator.getMetadataStorage)();
    const computeTargetValidationMetadatas = storage.getTargetValidationMetadatas.bind(storage);
    const cacheByTarget = new WeakMap();
    storage.getTargetValidationMetadatas = (targetConstructor, targetSchema, always, strictGroups, groups)=>{
        let cacheByArgs = cacheByTarget.get(targetConstructor);
        if (cacheByArgs === undefined) {
            cacheByArgs = new Map();
            cacheByTarget.set(targetConstructor, cacheByArgs);
        }
        const cacheKey = `${targetSchema}|${always}|${strictGroups}|${[
            ...groups ?? []
        ].sort().join(',')}`;
        const cached = cacheByArgs.get(cacheKey);
        if (cached !== undefined) {
            return cached;
        }
        const metadatas = computeTargetValidationMetadatas(targetConstructor, targetSchema, always, strictGroups, groups);
        cacheByArgs.set(cacheKey, metadatas);
        return metadatas;
    };
};

//# sourceMappingURL=enable-validation-metadata-cache.util.js.map