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
    get LAYER_BUILD_LOCK_MAX_RETRIES () {
        return LAYER_BUILD_LOCK_MAX_RETRIES;
    },
    get LAYER_BUILD_LOCK_RETRY_MS () {
        return LAYER_BUILD_LOCK_RETRY_MS;
    },
    get LAYER_BUILD_LOCK_TTL_MS () {
        return LAYER_BUILD_LOCK_TTL_MS;
    },
    get LAYER_BUILD_READY_SENTINEL () {
        return LAYER_BUILD_READY_SENTINEL;
    },
    get PREBUILT_BUNDLE_FILE_NAME () {
        return PREBUILT_BUNDLE_FILE_NAME;
    },
    get PREBUILT_CHECKSUM_FILE_NAME () {
        return PREBUILT_CHECKSUM_FILE_NAME;
    },
    get PREBUILT_INSTALL_LOCK_MAX_RETRIES () {
        return PREBUILT_INSTALL_LOCK_MAX_RETRIES;
    },
    get PREBUILT_INSTALL_LOCK_RETRY_MS () {
        return PREBUILT_INSTALL_LOCK_RETRY_MS;
    },
    get PREBUILT_INSTALL_LOCK_TTL_MS () {
        return PREBUILT_INSTALL_LOCK_TTL_MS;
    }
});
const LAYER_BUILD_LOCK_TTL_MS = 120_000;
const LAYER_BUILD_LOCK_RETRY_MS = 500;
const LAYER_BUILD_LOCK_MAX_RETRIES = 240;
const LAYER_BUILD_READY_SENTINEL = '.twenty-layer-ready';
const PREBUILT_BUNDLE_FILE_NAME = 'prebuilt-logic-function.mjs';
const PREBUILT_CHECKSUM_FILE_NAME = 'prebuilt-bundle.checksum';
const PREBUILT_INSTALL_LOCK_TTL_MS = 180_000;
const PREBUILT_INSTALL_LOCK_RETRY_MS = 1_000;
const PREBUILT_INSTALL_LOCK_MAX_RETRIES = 180;

//# sourceMappingURL=local-driver.constant.js.map