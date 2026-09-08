"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "readIsCompanyEnrichmentEnabled", {
    enumerable: true,
    get: function() {
        return readIsCompanyEnrichmentEnabled;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _readbookcallstepminemployeecountutil = require("../../onboarding/utils/read-book-call-step-min-employee-count.util");
const readIsCompanyEnrichmentEnabled = (twentyConfigService)=>{
    const hasConsumer = twentyConfigService.get('IS_ONBOARDING_AI_CHAT_ENABLED') || (0, _utils.isDefined)((0, _readbookcallstepminemployeecountutil.readBookCallStepMinEmployeeCount)(twentyConfigService));
    return hasConsumer && (0, _guards.isNonEmptyString)(twentyConfigService.get('PEOPLE_DATA_LABS_API_KEY'));
};

//# sourceMappingURL=read-is-company-enrichment-enabled.util.js.map