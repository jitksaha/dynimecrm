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
    get PENDING_FILE_CLEANUP_BATCH_SIZE () {
        return PENDING_FILE_CLEANUP_BATCH_SIZE;
    },
    get PENDING_FILE_CLEANUP_CRON_PATTERN () {
        return PENDING_FILE_CLEANUP_CRON_PATTERN;
    },
    get PENDING_FILE_MAX_AGE_MS () {
        return PENDING_FILE_MAX_AGE_MS;
    }
});
const PENDING_FILE_CLEANUP_CRON_PATTERN = '0 * * * *';
const PENDING_FILE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const PENDING_FILE_CLEANUP_BATCH_SIZE = 200;

//# sourceMappingURL=pending-file-cleanup.constants.js.map