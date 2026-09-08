"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "renderCampaignEmail", {
    enumerable: true,
    get: function() {
        return renderCampaignEmail;
    }
});
const _compilecampaignemailcontentutil = require("./compile-campaign-email-content.util");
const _rendercampaigntemplateutil = require("./render-campaign-template.util");
const renderCampaignEmail = async ({ subjectTemplate, bodyTemplate, variables })=>{
    const { html, plainText } = await (0, _compilecampaignemailcontentutil.compileCampaignEmailContent)(bodyTemplate, variables);
    return {
        subject: (0, _rendercampaigntemplateutil.renderCampaignTemplate)(subjectTemplate, variables, {
            escapeValues: false
        }),
        html,
        plainText
    };
};

//# sourceMappingURL=render-campaign-email.util.js.map