"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "interpolateNavigationCommandMenuItemField", {
    enumerable: true,
    get: function() {
        return interpolateNavigationCommandMenuItemField;
    }
});
const _guards = require("@sniptt/guards");
const _i18n = require("twenty-shared/i18n");
const _utils = require("twenty-shared/utils");
const _enginecomponentkeyenum = require("../enums/engine-component-key.enum");
const _buildnavigationplaceholdervaluesutil = require("./build-navigation-placeholder-values.util");
const interpolateNavigationCommandMenuItemField = ({ commandMenuItem, resolvedValue, objectMetadata, objectMetadataI18nContext })=>{
    if (commandMenuItem.engineComponentKey !== _enginecomponentkeyenum.EngineComponentKey.NAVIGATION || !(0, _utils.isDefined)(commandMenuItem.navigationTargetObjectMetadataId)) {
        return resolvedValue;
    }
    if (!(0, _utils.isDefined)(objectMetadata)) {
        return undefined;
    }
    if (!(0, _guards.isNonEmptyString)(resolvedValue)) {
        return resolvedValue;
    }
    return (0, _i18n.interpolateMessagePlaceholders)(resolvedValue, (0, _buildnavigationplaceholdervaluesutil.buildNavigationPlaceholderValues)({
        objectMetadata,
        i18nContext: objectMetadataI18nContext
    }));
};

//# sourceMappingURL=interpolate-navigation-command-menu-item-field.util.js.map