"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "collectCampaignVariableNamesFromString", {
    enumerable: true,
    get: function() {
        return collectCampaignVariableNamesFromString;
    }
});
const _campaignvariablepatternconstant = require("../constants/campaign-variable-pattern.constant");
const collectCampaignVariableNamesFromString = (value)=>{
    const names = new Set();
    if (typeof value !== 'string') {
        return names;
    }
    for (const match of value.matchAll(_campaignvariablepatternconstant.CAMPAIGN_VARIABLE_PATTERN)){
        names.add(match[1]);
    }
    return names;
};

//# sourceMappingURL=collect-campaign-variable-names-from-string.util.js.map