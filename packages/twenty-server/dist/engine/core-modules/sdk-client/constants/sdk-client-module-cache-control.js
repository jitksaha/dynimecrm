"use strict";
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
    get SDK_CLIENT_MODULE_CACHE_CONTROL () {
        return SDK_CLIENT_MODULE_CACHE_CONTROL;
    },
    get SDK_CLIENT_MODULE_NO_STORE_CACHE_CONTROL () {
        return SDK_CLIENT_MODULE_NO_STORE_CACHE_CONTROL;
    }
});
const SDK_CLIENT_MODULE_CACHE_CONTROL = 'private, max-age=31536000, immutable';
const SDK_CLIENT_MODULE_NO_STORE_CACHE_CONTROL = 'private, no-store';

//# sourceMappingURL=sdk-client-module-cache-control.js.map