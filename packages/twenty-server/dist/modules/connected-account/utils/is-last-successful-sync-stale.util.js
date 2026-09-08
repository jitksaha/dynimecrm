"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLastSuccessfulSyncStale", {
    enumerable: true,
    get: function() {
        return isLastSuccessfulSyncStale;
    }
});
const _utils = require("twenty-shared/utils");
const _webhooksyncstalenessthresholdmsconstant = require("../webhook-subscription-manager/constants/webhook-sync-staleness-threshold-ms.constant");
const isLastSuccessfulSyncStale = (syncedAt)=>{
    if (!(0, _utils.isDefined)(syncedAt)) {
        return true;
    }
    const syncedTime = new Date(syncedAt).getTime();
    if (isNaN(syncedTime)) {
        throw new Error('Invalid date format');
    }
    return Date.now() - syncedTime > _webhooksyncstalenessthresholdmsconstant.WEBHOOK_SYNC_STALENESS_THRESHOLD_MS;
};

//# sourceMappingURL=is-last-successful-sync-stale.util.js.map