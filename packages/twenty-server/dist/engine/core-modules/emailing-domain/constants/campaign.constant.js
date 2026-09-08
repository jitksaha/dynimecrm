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
    get CAMPAIGN_MESSAGE_ID_NAMESPACE () {
        return CAMPAIGN_MESSAGE_ID_NAMESPACE;
    },
    get CAMPAIGN_STATS_REFRESH_DEBOUNCE_MS () {
        return CAMPAIGN_STATS_REFRESH_DEBOUNCE_MS;
    },
    get MATERIALIZE_CAMPAIGN_CHUNK_JOB () {
        return MATERIALIZE_CAMPAIGN_CHUNK_JOB;
    },
    get MATERIALIZE_CAMPAIGN_JOB () {
        return MATERIALIZE_CAMPAIGN_JOB;
    },
    get MAX_CAMPAIGN_RECIPIENTS () {
        return MAX_CAMPAIGN_RECIPIENTS;
    },
    get RECONCILE_WORKSPACE_CAMPAIGN_STATS_JOB () {
        return RECONCILE_WORKSPACE_CAMPAIGN_STATS_JOB;
    },
    get REFRESH_CAMPAIGN_STATS_JOB () {
        return REFRESH_CAMPAIGN_STATS_JOB;
    },
    get SEND_CAMPAIGN_EMAIL_JOB () {
        return SEND_CAMPAIGN_EMAIL_JOB;
    }
});
const MATERIALIZE_CAMPAIGN_JOB = 'MaterializeCampaignJob';
const MATERIALIZE_CAMPAIGN_CHUNK_JOB = 'MaterializeCampaignChunkJob';
const SEND_CAMPAIGN_EMAIL_JOB = 'SendCampaignEmailJob';
const REFRESH_CAMPAIGN_STATS_JOB = 'RefreshCampaignStatsJob';
const RECONCILE_WORKSPACE_CAMPAIGN_STATS_JOB = 'ReconcileWorkspaceCampaignStatsJob';
const CAMPAIGN_STATS_REFRESH_DEBOUNCE_MS = 10_000;
const MAX_CAMPAIGN_RECIPIENTS = 10000;
const CAMPAIGN_MESSAGE_ID_NAMESPACE = '0c4b9e7a-3f2d-4b6c-9e1a-7d8f5a2c3b4e';

//# sourceMappingURL=campaign.constant.js.map