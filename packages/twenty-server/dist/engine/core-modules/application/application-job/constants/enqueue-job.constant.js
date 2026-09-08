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
    get ENQUEUE_JOB_DEFAULT_RETRY_LIMIT () {
        return ENQUEUE_JOB_DEFAULT_RETRY_LIMIT;
    },
    get ENQUEUE_JOB_MAX_DELAY_MS () {
        return ENQUEUE_JOB_MAX_DELAY_MS;
    },
    get ENQUEUE_JOB_MAX_RETRY_LIMIT () {
        return ENQUEUE_JOB_MAX_RETRY_LIMIT;
    },
    get ENQUEUE_JOB_MIN_DELAY_MS () {
        return ENQUEUE_JOB_MIN_DELAY_MS;
    },
    get ENQUEUE_JOB_MIN_RETRY_LIMIT () {
        return ENQUEUE_JOB_MIN_RETRY_LIMIT;
    },
    get ENQUEUE_JOB_PRIORITY () {
        return ENQUEUE_JOB_PRIORITY;
    },
    get MAX_JOBS_PER_ENQUEUE () {
        return MAX_JOBS_PER_ENQUEUE;
    }
});
const ENQUEUE_JOB_MIN_RETRY_LIMIT = 0;
const ENQUEUE_JOB_MAX_RETRY_LIMIT = 10;
const ENQUEUE_JOB_DEFAULT_RETRY_LIMIT = 0;
const ENQUEUE_JOB_PRIORITY = 10;
const ENQUEUE_JOB_MIN_DELAY_MS = 0;
const ENQUEUE_JOB_MAX_DELAY_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_JOBS_PER_ENQUEUE = 200;

//# sourceMappingURL=enqueue-job.constant.js.map