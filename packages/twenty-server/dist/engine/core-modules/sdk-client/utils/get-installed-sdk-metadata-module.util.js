"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getInstalledSdkMetadataModule", {
    enumerable: true,
    get: function() {
        return getInstalledSdkMetadataModule;
    }
});
const _crypto = require("crypto");
const _promises = /*#__PURE__*/ _interop_require_wildcard(require("node:fs/promises"));
const _path = require("path");
const _sdkclientpackagedirname = require("../constants/sdk-client-package-dirname");
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
// Warmed once at bootstrap (SdkClientModule.onApplicationBootstrap) and treated
// as a process-lifetime invariant: the module ships inside the server build and
// never changes at runtime. A read/hash failure blocks boot, so a running
// server always has a resolved value here.
let installedSdkMetadataModule;
const getInstalledSdkMetadataModule = async ()=>{
    if (!installedSdkMetadataModule) {
        const moduleBuffer = await _promises.readFile((0, _path.join)(_sdkclientpackagedirname.SDK_CLIENT_PACKAGE_DIRNAME, 'dist', 'metadata.mjs'));
        installedSdkMetadataModule = {
            moduleBuffer,
            checksum: (0, _crypto.createHash)('sha256').update(moduleBuffer).digest('hex')
        };
    }
    return installedSdkMetadataModule;
};

//# sourceMappingURL=get-installed-sdk-metadata-module.util.js.map