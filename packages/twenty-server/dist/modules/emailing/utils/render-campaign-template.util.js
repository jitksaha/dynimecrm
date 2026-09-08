"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "renderCampaignTemplate", {
    enumerable: true,
    get: function() {
        return renderCampaignTemplate;
    }
});
const _escapehtmlutil = require("../../../engine/core-modules/emailing-domain/utils/escape-html.util");
const _campaignvariablepatternconstant = require("../constants/campaign-variable-pattern.constant");
const renderCampaignTemplate = (template, variables, { escapeValues })=>template.replace(_campaignvariablepatternconstant.CAMPAIGN_VARIABLE_PATTERN, (_match, variableName)=>{
        const value = variables[variableName] ?? '';
        return escapeValues ? (0, _escapehtmlutil.escapeHtml)(value) : value;
    });

//# sourceMappingURL=render-campaign-template.util.js.map