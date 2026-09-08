"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "translateToolLabel", {
    enumerable: true,
    get: function() {
        return translateToolLabel;
    }
});
const _translations = require("twenty-shared/translations");
const _i18n = require("twenty-shared/i18n");
const translateToolLabel = (source, i18nService, locale)=>{
    if (source.length === 0) {
        return source;
    }
    const messageId = (0, _i18n.generateMessageId)(source);
    const translated = i18nService.translateMessage({
        messageId,
        locale: locale ?? _translations.SOURCE_LOCALE
    });
    return translated === messageId ? source : translated;
};

//# sourceMappingURL=translate-tool-label.util.js.map