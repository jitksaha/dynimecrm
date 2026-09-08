"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findInvalidTranslationOverrideProperties", {
    enumerable: true,
    get: function() {
        return findInvalidTranslationOverrideProperties;
    }
});
const _alltranslatablepropertiesbymetadatanameconstant = require("../flat-entity/constant/all-translatable-properties-by-metadata-name.constant");
const findInvalidTranslationOverrideProperties = (translationEntries, metadataName)=>{
    const translatableProperties = _alltranslatablepropertiesbymetadatanameconstant.ALL_TRANSLATABLE_PROPERTIES_BY_METADATA_NAME[metadataName] ?? [];
    return [
        ...new Set(translationEntries.map(({ property })=>property).filter((property)=>!translatableProperties.includes(property)))
    ];
};

//# sourceMappingURL=find-invalid-translation-override-properties.util.js.map