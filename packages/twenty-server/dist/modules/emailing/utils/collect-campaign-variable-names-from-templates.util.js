"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "collectCampaignVariableNamesFromTemplates", {
    enumerable: true,
    get: function() {
        return collectCampaignVariableNamesFromTemplates;
    }
});
const _utils = require("twenty-shared/utils");
const _collectcampaignvariablenamesutil = require("./collect-campaign-variable-names.util");
const _collectcampaignvariablenamesfromstringutil = require("./collect-campaign-variable-names-from-string.util");
const collectCampaignVariableNamesFromTemplates = ({ subject, bodyTemplate })=>{
    const names = new Set((0, _collectcampaignvariablenamesfromstringutil.collectCampaignVariableNamesFromString)(subject));
    const parsedBody = (0, _utils.parseJson)(bodyTemplate);
    const collected = typeof parsedBody === 'object' && parsedBody !== null && parsedBody.type === 'doc' ? (0, _collectcampaignvariablenamesutil.collectCampaignVariableNames)(parsedBody) : (0, _collectcampaignvariablenamesfromstringutil.collectCampaignVariableNamesFromString)(bodyTemplate);
    for (const name of collected){
        names.add(name);
    }
    return names;
};

//# sourceMappingURL=collect-campaign-variable-names-from-templates.util.js.map