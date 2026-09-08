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
    get ALLOWED_APPLICATION_FILE_FOLDERS () {
        return ALLOWED_APPLICATION_FILE_FOLDERS;
    },
    get APP_DEV_RATE_LIMIT_MAX () {
        return APP_DEV_RATE_LIMIT_MAX;
    },
    get APP_DEV_RATE_LIMIT_WINDOW_MS () {
        return APP_DEV_RATE_LIMIT_WINDOW_MS;
    },
    get MAX_APPLICATION_FILE_UPLOAD_BATCH_SIZE () {
        return MAX_APPLICATION_FILE_UPLOAD_BATCH_SIZE;
    }
});
const _types = require("twenty-shared/types");
const APP_DEV_RATE_LIMIT_MAX = 30;
const APP_DEV_RATE_LIMIT_WINDOW_MS = 30_000;
const MAX_APPLICATION_FILE_UPLOAD_BATCH_SIZE = 100;
const ALLOWED_APPLICATION_FILE_FOLDERS = [
    _types.FileFolder.BuiltLogicFunction,
    _types.FileFolder.BuiltFrontComponent,
    _types.FileFolder.PublicAsset,
    _types.FileFolder.Source,
    _types.FileFolder.Dependencies
];

//# sourceMappingURL=application-development.constants.js.map