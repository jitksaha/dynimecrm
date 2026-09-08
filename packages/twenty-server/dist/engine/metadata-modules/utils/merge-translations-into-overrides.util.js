"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "mergeTranslationsIntoOverrides", {
    enumerable: true,
    get: function() {
        return mergeTranslationsIntoOverrides;
    }
});
const _guards = require("@sniptt/guards");
// Locale and property are allowlist-validated by the callers; this re-checks
// object-safety so a hostile key can never reach the prototype chain.
const isSafeObjectKey = (key)=>![
        '__proto__',
        'constructor',
        'prototype'
    ].includes(key);
const mergeTranslationsIntoOverrides = ({ existingOverrides, translationEntries })=>{
    const safeTranslationEntries = translationEntries.filter(({ locale, property })=>isSafeObjectKey(locale) && isSafeObjectKey(property));
    if (safeTranslationEntries.length === 0) {
        return existingOverrides;
    }
    const { translations: existingTranslations, ...otherOverrides } = existingOverrides ?? {};
    const locales = new Set([
        ...Object.keys(existingTranslations ?? {}),
        ...safeTranslationEntries.map(({ locale })=>locale)
    ]);
    const mergedTranslations = Object.fromEntries([
        ...locales
    ].map((locale)=>{
        const localeEntries = safeTranslationEntries.filter((entry)=>entry.locale === locale);
        const removedProperties = new Set(localeEntries.filter(({ value })=>!(0, _guards.isNonEmptyString)(value)).map(({ property })=>property));
        const addedValues = Object.fromEntries(localeEntries.filter(({ value })=>(0, _guards.isNonEmptyString)(value)).map(({ property, value })=>[
                property,
                value
            ]));
        return [
            locale,
            {
                ...Object.fromEntries(Object.entries(existingTranslations?.[locale] ?? {}).filter(([property])=>!removedProperties.has(property))),
                ...addedValues
            }
        ];
    }).filter(([, values])=>Object.keys(values).length > 0));
    const overrides = Object.keys(mergedTranslations).length > 0 ? {
        ...otherOverrides,
        translations: mergedTranslations
    } : otherOverrides;
    if (Object.keys(overrides).length === 0) {
        return null;
    }
    return overrides;
};

//# sourceMappingURL=merge-translations-into-overrides.util.js.map