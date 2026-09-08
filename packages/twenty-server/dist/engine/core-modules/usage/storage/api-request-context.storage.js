/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getApiType () {
        return getApiType;
    },
    get withApiRequestContext () {
        return withApiRequestContext;
    }
});
const _async_hooks = require("async_hooks");
const apiRequestContextStorage = new _async_hooks.AsyncLocalStorage();
const withApiRequestContext = (apiType, fn)=>apiRequestContextStorage.run({
        apiType
    }, fn);
const getApiType = ()=>apiRequestContextStorage.getStore()?.apiType;

//# sourceMappingURL=api-request-context.storage.js.map