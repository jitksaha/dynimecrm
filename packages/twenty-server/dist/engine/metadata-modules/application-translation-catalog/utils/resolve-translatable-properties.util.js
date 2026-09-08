"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveTranslatableProperties", {
    enumerable: true,
    get: function() {
        return resolveTranslatableProperties;
    }
});
const _utils = require("twenty-shared/utils");
const _alltranslatablepropertiesbymetadatanameconstant = require("../../flat-entity/constant/all-translatable-properties-by-metadata-name.constant");
const _resolveeffectiveentitypropertyutil = require("../../utils/resolve-effective-entity-property.util");
const resolveTranslatableProperties = ({ metadataName, entity, i18nContext })=>Object.fromEntries((_alltranslatablepropertiesbymetadatanameconstant.ALL_TRANSLATABLE_PROPERTIES_BY_METADATA_NAME[metadataName] ?? []).map((property)=>{
        const baseValue = entity[property];
        return (0, _utils.isDefined)(baseValue) ? [
            property,
            (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityPropertyByName)({
                metadataName,
                baseValue,
                overrides: entity.overrides,
                property,
                i18nContext
            })
        ] : undefined;
    }).filter(_utils.isDefined));

//# sourceMappingURL=resolve-translatable-properties.util.js.map