"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MESSAGING_ONGOING_STALE_SYNC_STAGES", {
    enumerable: true,
    get: function() {
        return MESSAGING_ONGOING_STALE_SYNC_STAGES;
    }
});
const _types = require("twenty-shared/types");
const MESSAGING_ONGOING_STALE_SYNC_STAGES = [
    _types.MessageChannelSyncStage.MESSAGES_IMPORT_ONGOING,
    _types.MessageChannelSyncStage.MESSAGE_LIST_FETCH_ONGOING,
    _types.MessageChannelSyncStage.MESSAGES_IMPORT_SCHEDULED,
    _types.MessageChannelSyncStage.MESSAGE_LIST_FETCH_SCHEDULED
];

//# sourceMappingURL=messaging-ongoing-stale-sync-stages.constant.js.map