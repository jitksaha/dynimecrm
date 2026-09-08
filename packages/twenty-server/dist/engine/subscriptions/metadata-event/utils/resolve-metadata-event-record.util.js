"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveMetadataEventRecord", {
    enumerable: true,
    get: function() {
        return resolveMetadataEventRecord;
    }
});
const _guards = require("@sniptt/guards");
const _i18n = require("twenty-shared/i18n");
const _utils = require("twenty-shared/utils");
const _resolveeffectiveentitypropertyutil = require("../../../metadata-modules/utils/resolve-effective-entity-property.util");
const _istranslatablemetadatanameutil = require("./is-translatable-metadata-name.util");
const TRANSLATIONS_OVERRIDE_KEY = 'translations';
const resolveMetadataEventRecord = ({ metadataName, record, i18nContext })=>{
    const { overrides, ...baseRecord } = record;
    const overrideRecord = overrides ?? {};
    const translatable = (0, _istranslatablemetadatanameutil.isTranslatableMetadataName)(metadataName);
    const translatableProperties = new Set(translatable ? _i18n.TRANSLATABLE_PROPERTIES_BY_METADATA_NAME[metadataName] : []);
    const resolved = {
        ...baseRecord
    };
    // Overridable-but-not-translatable properties are not all strings --
    // pageLayoutTab.position is a number, commandMenuItem.isPinned a boolean --
    // so they pass through as they are rather than through the resolver.
    for (const [property, overrideValue] of Object.entries(overrideRecord)){
        if (property === TRANSLATIONS_OVERRIDE_KEY || translatableProperties.has(property)) {
            continue;
        }
        resolved[property] = overrideValue;
    }
    if (!translatable) {
        return resolved;
    }
    for (const property of translatableProperties){
        const baseValue = baseRecord[property];
        // An override with no base value still has to win, so absence of a base is
        // not on its own a reason to skip.
        if (!(0, _guards.isNonEmptyString)(baseValue) && !(0, _utils.isDefined)(overrideRecord[property]) && !(0, _utils.isDefined)(overrideRecord[TRANSLATIONS_OVERRIDE_KEY])) {
            continue;
        }
        resolved[property] = (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityPropertyByName)({
            metadataName,
            baseValue,
            overrides,
            property,
            i18nContext
        });
    }
    return resolved;
};

//# sourceMappingURL=resolve-metadata-event-record.util.js.map