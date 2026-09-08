"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getEnglishLanguageNameFromLocale", {
    enumerable: true,
    get: function() {
        return getEnglishLanguageNameFromLocale;
    }
});
const _guards = require("@sniptt/guards");
const getEnglishLanguageNameFromLocale = (locale)=>{
    const languageTag = locale.split('-')[0];
    try {
        const languageName = new Intl.DisplayNames([
            'en'
        ], {
            type: 'language'
        }).of(languageTag);
        return (0, _guards.isNonEmptyString)(languageName) ? languageName : locale;
    } catch  {
        return locale;
    }
};

//# sourceMappingURL=get-english-language-name-from-locale.util.js.map