"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getenglishlanguagenamefromlocaleutil = require("../get-english-language-name-from-locale.util");
describe('getEnglishLanguageNameFromLocale', ()=>{
    it.each([
        [
            'fr-FR',
            'French'
        ],
        [
            'de-DE',
            'German'
        ],
        [
            'ja-JP',
            'Japanese'
        ],
        [
            'zh-CN',
            'Chinese'
        ],
        [
            'en',
            'English'
        ]
    ])('should return %s as %s', (locale, expectedLanguageName)=>{
        expect((0, _getenglishlanguagenamefromlocaleutil.getEnglishLanguageNameFromLocale)(locale)).toBe(expectedLanguageName);
    });
    it('should return the locale itself when it is not a structurally valid language tag', ()=>{
        expect((0, _getenglishlanguagenamefromlocaleutil.getEnglishLanguageNameFromLocale)('!')).toBe('!');
    });
    it('should return the language subtag when it has no display name', ()=>{
        expect((0, _getenglishlanguagenamefromlocaleutil.getEnglishLanguageNameFromLocale)('xx-XX')).toBe('xx');
    });
});

//# sourceMappingURL=get-english-language-name-from-locale.util.spec.js.map