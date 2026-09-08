"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "translateStandardLabel", {
    enumerable: true,
    get: function() {
        return translateStandardLabel;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _i18n = require("twenty-shared/i18n");
const translateStandardLabel = ({ sourceValue, context, isStandardApp, applicationCatalog, i18nInstance })=>{
    if (!(0, _guards.isNonEmptyString)(sourceValue)) {
        return sourceValue ?? '';
    }
    if (!(0, _utils.isDefined)(applicationCatalog) && !isStandardApp) {
        return sourceValue;
    }
    const messageId = (0, _i18n.generateMessageId)(sourceValue, context);
    if ((0, _utils.isDefined)(applicationCatalog)) {
        return applicationCatalog[messageId] ?? sourceValue;
    }
    if (isStandardApp) {
        const translatedMessage = i18nInstance._(messageId, _i18n.METADATA_LABEL_PLACEHOLDER_PASS_THROUGH);
        return translatedMessage === messageId ? sourceValue : translatedMessage;
    }
    return sourceValue;
};

//# sourceMappingURL=translate-standard-label.util.js.map