"use strict";
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
describe('typeORMCoreModuleOptions', ()=>{
    const originalPoolMaxConnections = process.env.PG_POOL_MAX_CONNECTIONS;
    afterEach(()=>{
        if (originalPoolMaxConnections === undefined) {
            delete process.env.PG_POOL_MAX_CONNECTIONS;
        } else {
            process.env.PG_POOL_MAX_CONNECTIONS = originalPoolMaxConnections;
        }
        jest.resetModules();
    });
    it('uses the configured maximum pool size', async ()=>{
        process.env.PG_POOL_MAX_CONNECTIONS = '40';
        const { typeORMCoreModuleOptions } = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./core.datasource")));
        expect(typeORMCoreModuleOptions.poolSize).toBe(40);
    });
});

//# sourceMappingURL=core.datasource.spec.js.map