"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveViewName", {
    enumerable: true,
    get: function() {
        return resolveViewName;
    }
});
const _i18n = require("twenty-shared/i18n");
const _resolveeffectiveentitypropertyutil = require("../../utils/resolve-effective-entity-property.util");
const resolveViewName = ({ view, objectLabelPlaceholderValues, i18nContext })=>{
    const resolvedName = (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
        metadataName: 'view',
        baseValue: view.name,
        overrides: view.overrides,
        property: 'name',
        i18nContext
    });
    return (0, _i18n.interpolateMessagePlaceholders)(resolvedName, objectLabelPlaceholderValues);
};

//# sourceMappingURL=resolve-view-name.util.js.map