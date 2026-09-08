"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildNavigationPlaceholderValues", {
    enumerable: true,
    get: function() {
        return buildNavigationPlaceholderValues;
    }
});
const _i18n = require("twenty-shared/i18n");
const _resolveeffectiveentitypropertyutil = require("../../utils/resolve-effective-entity-property.util");
const buildNavigationPlaceholderValues = ({ objectMetadata, i18nContext })=>{
    const overrides = objectMetadata.overrides ?? undefined;
    const resolvedLabelPlural = (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
        metadataName: 'objectMetadata',
        baseValue: objectMetadata.labelPlural,
        overrides,
        property: 'labelPlural',
        i18nContext
    });
    const resolvedIcon = (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
        metadataName: 'objectMetadata',
        baseValue: objectMetadata.icon,
        overrides,
        property: 'icon',
        i18nContext
    });
    return (0, _i18n.buildObjectMetadataLabelPlaceholderValues)({
        labelPlural: resolvedLabelPlural,
        icon: resolvedIcon
    });
};

//# sourceMappingURL=build-navigation-placeholder-values.util.js.map