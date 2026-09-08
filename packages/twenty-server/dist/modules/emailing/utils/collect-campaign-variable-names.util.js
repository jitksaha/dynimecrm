"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "collectCampaignVariableNames", {
    enumerable: true,
    get: function() {
        return collectCampaignVariableNames;
    }
});
const _utils = require("twenty-shared/utils");
const _collectcampaignvariablenamesfromstringutil = require("./collect-campaign-variable-names-from-string.util");
const collectCampaignVariableNames = (node)=>{
    const names = new Set();
    (0, _utils.transformEmailDocumentStrings)(node, (value)=>{
        for (const name of (0, _collectcampaignvariablenamesfromstringutil.collectCampaignVariableNamesFromString)(value)){
            names.add(name);
        }
        return value;
    });
    return names;
};

//# sourceMappingURL=collect-campaign-variable-names.util.js.map