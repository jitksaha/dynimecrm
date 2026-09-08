"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveEffectiveFieldDescription", {
    enumerable: true,
    get: function() {
        return resolveEffectiveFieldDescription;
    }
});
const _belongstotwentystandardapputil = require("../../../metadata-modules/utils/belongs-to-twenty-standard-app.util");
const _resolveeffectiveentitypropertyutil = require("../../../metadata-modules/utils/resolve-effective-entity-property.util");
const resolveEffectiveFieldDescription = ({ flatFieldMetadata, locale, i18nInstance })=>(0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
        metadataName: 'fieldMetadata',
        baseValue: flatFieldMetadata.description,
        overrides: flatFieldMetadata.overrides ?? undefined,
        property: 'description',
        i18nContext: {
            locale,
            i18nInstance,
            isStandardApp: (0, _belongstotwentystandardapputil.belongsToTwentyStandardApp)(flatFieldMetadata)
        }
    });

//# sourceMappingURL=resolve-effective-field-description.util.js.map