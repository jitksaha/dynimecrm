"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildViewNameObjectLabels", {
    enumerable: true,
    get: function() {
        return buildViewNameObjectLabels;
    }
});
const _i18n = require("twenty-shared/i18n");
const _resolveeffectiveentitypropertyutil = require("../../utils/resolve-effective-entity-property.util");
const buildViewNameObjectLabels = ({ viewName, objectMetadata, i18nContext })=>{
    const resolveLabel = (property)=>(0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
            metadataName: 'objectMetadata',
            baseValue: objectMetadata[property],
            overrides: objectMetadata.overrides ?? undefined,
            property,
            i18nContext
        });
    return (0, _i18n.buildObjectMetadataLabelPlaceholderValues)({
        labelSingular: viewName.includes((0, _i18n.getMetadataLabelPlaceholder)('objectLabelSingular')) ? resolveLabel('labelSingular') : undefined,
        labelPlural: viewName.includes((0, _i18n.getMetadataLabelPlaceholder)('objectLabelPlural')) ? resolveLabel('labelPlural') : undefined
    });
};

//# sourceMappingURL=build-view-name-object-labels.util.js.map