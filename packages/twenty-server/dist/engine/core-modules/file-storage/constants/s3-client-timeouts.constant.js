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
    get FILE_STORAGE_S3_CONNECTION_TIMEOUT_MS () {
        return FILE_STORAGE_S3_CONNECTION_TIMEOUT_MS;
    },
    get FILE_STORAGE_S3_MAX_SOCKETS () {
        return FILE_STORAGE_S3_MAX_SOCKETS;
    },
    get FILE_STORAGE_S3_REQUEST_TIMEOUT_MS () {
        return FILE_STORAGE_S3_REQUEST_TIMEOUT_MS;
    }
});
const FILE_STORAGE_S3_REQUEST_TIMEOUT_MS = 5 * 60 * 1000;
const FILE_STORAGE_S3_CONNECTION_TIMEOUT_MS = 30 * 1000;
const FILE_STORAGE_S3_MAX_SOCKETS = 200;

//# sourceMappingURL=s3-client-timeouts.constant.js.map