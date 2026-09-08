"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeCampaignTerminalStatus", {
    enumerable: true,
    get: function() {
        return computeCampaignTerminalStatus;
    }
});
const _types = require("twenty-shared/types");
const computeCampaignTerminalStatus = ({ totalCount, inProgressCount, failedCount, skippedCount })=>{
    if (inProgressCount > 0) {
        return undefined;
    }
    if (totalCount === 0) {
        return _types.MessageCampaignStatus.SENT_WITH_ERRORS;
    }
    if (failedCount > 0 || skippedCount > 0) {
        return _types.MessageCampaignStatus.SENT_WITH_ERRORS;
    }
    return _types.MessageCampaignStatus.SENT;
};

//# sourceMappingURL=compute-campaign-terminal-status.util.js.map