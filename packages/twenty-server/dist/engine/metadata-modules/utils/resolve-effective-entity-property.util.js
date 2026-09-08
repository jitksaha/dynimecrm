"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get readOverrideTranslation () {
        return readOverrideTranslation;
    },
    get resolveEffectiveEntityProperty () {
        return resolveEffectiveEntityProperty;
    },
    get resolveEffectiveEntityPropertyByName () {
        return resolveEffectiveEntityPropertyByName;
    }
});
const _guards = require("@sniptt/guards");
const _translations = require("twenty-shared/translations");
const _utils = require("twenty-shared/utils");
const _translatestandardlabelutil = require("../../core-modules/i18n/utils/translate-standard-label.util");
const _alltranslatablepropertiesbymetadatanameconstant = require("../flat-entity/constant/all-translatable-properties-by-metadata-name.constant");
const readOverrideProperty = (overrides, property)=>(0, _utils.isDefined)(overrides) && typeof overrides === 'object' ? overrides[property] : undefined;
const readOverrideTranslation = ({ overrides, locale, property })=>{
    const translations = readOverrideProperty(overrides, 'translations');
    const translationsForLocale = readOverrideProperty(translations, locale);
    const translation = readOverrideProperty(translationsForLocale, property);
    return typeof translation === 'string' ? translation : undefined;
};
const resolveEffectiveProperty = ({ metadataName, baseValue, overrides, property, i18nContext })=>{
    const translatableProperties = _alltranslatablepropertiesbymetadatanameconstant.ALL_TRANSLATABLE_PROPERTIES_BY_METADATA_NAME[metadataName] ?? [];
    const isTranslatable = translatableProperties.includes(property);
    const overrideValue = readOverrideProperty(overrides, property);
    const { locale, i18nInstance, isStandardApp, applicationCatalog } = i18nContext;
    const safeLocale = locale ?? _translations.SOURCE_LOCALE;
    const safeBaseValue = baseValue ?? '';
    // Workspace-authored translations apply to every entity, custom ones
    // included: a custom object created in French can still carry an English
    // translation even though it has no catalog to fall back to.
    if (isTranslatable) {
        const translation = readOverrideTranslation({
            overrides,
            locale: safeLocale,
            property
        });
        if ((0, _utils.isDefined)(translation)) {
            return translation;
        }
    }
    // Custom (non-standard) entities without a catalog have no standard label
    // to resolve or translate, and property renames live in base columns.
    if (!isStandardApp && !(0, _utils.isDefined)(applicationCatalog)) {
        return safeBaseValue;
    }
    if (!isTranslatable && (0, _utils.isDefined)(overrideValue)) {
        return overrideValue;
    }
    if ((0, _guards.isNonEmptyString)(overrideValue)) {
        return overrideValue;
    }
    return (0, _translatestandardlabelutil.translateStandardLabel)({
        sourceValue: safeBaseValue,
        context: `${metadataName}.${property}`,
        isStandardApp,
        applicationCatalog,
        i18nInstance
    });
};
const resolveEffectiveEntityProperty = ({ metadataName, baseValue, overrides, property, i18nContext })=>resolveEffectiveProperty({
        metadataName,
        baseValue,
        overrides,
        property,
        i18nContext
    });
const resolveEffectiveEntityPropertyByName = ({ metadataName, baseValue, overrides, property, i18nContext })=>resolveEffectiveProperty({
        metadataName,
        baseValue: typeof baseValue === 'string' ? baseValue : undefined,
        overrides,
        property,
        i18nContext
    });

//# sourceMappingURL=resolve-effective-entity-property.util.js.map