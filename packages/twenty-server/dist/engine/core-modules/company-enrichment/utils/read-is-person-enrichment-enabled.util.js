"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "readIsPersonEnrichmentEnabled", {
    enumerable: true,
    get: function() {
        return readIsPersonEnrichmentEnabled;
    }
});
const _guards = require("@sniptt/guards");
const readIsPersonEnrichmentEnabled = (twentyConfigService)=>twentyConfigService.get('IS_ONBOARDING_AI_CHAT_ENABLED') && (0, _guards.isNonEmptyString)(twentyConfigService.get('PEOPLE_DATA_LABS_API_KEY'));

//# sourceMappingURL=read-is-person-enrichment-enabled.util.js.map