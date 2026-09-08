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
    get BUILDER_FUNCTION_NAME_PREFIX () {
        return BUILDER_FUNCTION_NAME_PREFIX;
    },
    get BUILDER_HANDLER_PATH () {
        return BUILDER_HANDLER_PATH;
    },
    get BUILDER_LAMBDA_MEMORY_MB () {
        return BUILDER_LAMBDA_MEMORY_MB;
    },
    get BUILDER_LAMBDA_TIMEOUT_SECONDS () {
        return BUILDER_LAMBDA_TIMEOUT_SECONDS;
    },
    get COMMON_LAYER_NAME_PREFIX () {
        return COMMON_LAYER_NAME_PREFIX;
    },
    get CREDENTIALS_DURATION_IN_SECONDS () {
        return CREDENTIALS_DURATION_IN_SECONDS;
    },
    get EXECUTOR_LAMBDA_MEMORY_MB () {
        return EXECUTOR_LAMBDA_MEMORY_MB;
    },
    get EXECUTOR_LAMBDA_TIMEOUT_SECONDS () {
        return EXECUTOR_LAMBDA_TIMEOUT_SECONDS;
    },
    get LAMBDA_CLIENT_CONNECTION_TIMEOUT_MS () {
        return LAMBDA_CLIENT_CONNECTION_TIMEOUT_MS;
    },
    get LAMBDA_CLIENT_MAX_ATTEMPTS () {
        return LAMBDA_CLIENT_MAX_ATTEMPTS;
    },
    get LAMBDA_CLIENT_MAX_SOCKETS () {
        return LAMBDA_CLIENT_MAX_SOCKETS;
    },
    get LAMBDA_CLIENT_REQUEST_TIMEOUT_MS () {
        return LAMBDA_CLIENT_REQUEST_TIMEOUT_MS;
    },
    get LAMBDA_CLIENT_RETRY_MODE () {
        return LAMBDA_CLIENT_RETRY_MODE;
    },
    get LAMBDA_EPHEMERAL_STORAGE_MB () {
        return LAMBDA_EPHEMERAL_STORAGE_MB;
    },
    get LAMBDA_PREBUILT_BUNDLE_CHECKSUM_TAG () {
        return LAMBDA_PREBUILT_BUNDLE_CHECKSUM_TAG;
    },
    get PREBUILT_BUNDLE_FILE_NAME () {
        return PREBUILT_BUNDLE_FILE_NAME;
    },
    get PREBUILT_INSTALL_LOCK_MAX_RETRIES () {
        return PREBUILT_INSTALL_LOCK_MAX_RETRIES;
    },
    get PREBUILT_INSTALL_LOCK_RETRY_MS () {
        return PREBUILT_INSTALL_LOCK_RETRY_MS;
    },
    get PREBUILT_INSTALL_LOCK_TTL_MS () {
        return PREBUILT_INSTALL_LOCK_TTL_MS;
    },
    get SDK_LAYER_PREFIX_IN_ZIP () {
        return SDK_LAYER_PREFIX_IN_ZIP;
    },
    get UPDATE_FUNCTION_DURATION_TIMEOUT_IN_SECONDS () {
        return UPDATE_FUNCTION_DURATION_TIMEOUT_IN_SECONDS;
    },
    get YARN_INSTALL_FUNCTION_NAME_PREFIX () {
        return YARN_INSTALL_FUNCTION_NAME_PREFIX;
    },
    get YARN_INSTALL_HANDLER_PATH () {
        return YARN_INSTALL_HANDLER_PATH;
    },
    get YARN_INSTALL_LAMBDA_MEMORY_MB () {
        return YARN_INSTALL_LAMBDA_MEMORY_MB;
    },
    get YARN_INSTALL_LAMBDA_TIMEOUT_SECONDS () {
        return YARN_INSTALL_LAMBDA_TIMEOUT_SECONDS;
    }
});
const _path = require("path");
const _assetspath = require("../../../../../../../constants/assets-path");
const UPDATE_FUNCTION_DURATION_TIMEOUT_IN_SECONDS = 60;
const CREDENTIALS_DURATION_IN_SECONDS = 60 * 60; // 1h
const LAMBDA_CLIENT_MAX_ATTEMPTS = 8;
const LAMBDA_CLIENT_RETRY_MODE = 'adaptive';
const YARN_INSTALL_LAMBDA_TIMEOUT_SECONDS = 300;
const YARN_INSTALL_LAMBDA_MEMORY_MB = 4096;
const BUILDER_LAMBDA_TIMEOUT_SECONDS = 60;
const BUILDER_LAMBDA_MEMORY_MB = 512;
const EXECUTOR_LAMBDA_MEMORY_MB = 512;
const EXECUTOR_LAMBDA_TIMEOUT_SECONDS = 900;
const LAMBDA_EPHEMERAL_STORAGE_MB = 4096;
const LAMBDA_CLIENT_REQUEST_TIMEOUT_MS = (EXECUTOR_LAMBDA_TIMEOUT_SECONDS + 60) * 1000;
const LAMBDA_CLIENT_MAX_SOCKETS = 500;
const LAMBDA_CLIENT_CONNECTION_TIMEOUT_MS = 60_000;
const COMMON_LAYER_NAME_PREFIX = 'twenty-common-layer';
const YARN_INSTALL_FUNCTION_NAME_PREFIX = 'twenty-yarn-install';
const BUILDER_FUNCTION_NAME_PREFIX = 'twenty-builder';
const SDK_LAYER_PREFIX_IN_ZIP = 'nodejs/node_modules/twenty-client-sdk';
const LAMBDA_PREBUILT_BUNDLE_CHECKSUM_TAG = 'twenty:bundle-checksum';
const PREBUILT_BUNDLE_FILE_NAME = 'prebuilt-logic-function.mjs';
const PREBUILT_INSTALL_LOCK_TTL_MS = 180_000;
const PREBUILT_INSTALL_LOCK_RETRY_MS = 1_000;
const PREBUILT_INSTALL_LOCK_MAX_RETRIES = 180;
const YARN_INSTALL_HANDLER_PATH = (0, _path.resolve)(__dirname, (0, _path.join)(_assetspath.ASSET_PATH, 'engine/core-modules/logic-function/logic-function-drivers/constants/yarn-install/index.mjs'));
const BUILDER_HANDLER_PATH = (0, _path.resolve)(__dirname, (0, _path.join)(_assetspath.ASSET_PATH, 'engine/core-modules/logic-function/logic-function-drivers/constants/builder/index.mjs'));

//# sourceMappingURL=lambda-driver.constant.js.map