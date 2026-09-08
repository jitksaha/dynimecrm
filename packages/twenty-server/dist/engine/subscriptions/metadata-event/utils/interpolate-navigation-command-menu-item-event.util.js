"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "interpolateNavigationCommandMenuItemEvent", {
    enumerable: true,
    get: function() {
        return interpolateNavigationCommandMenuItemEvent;
    }
});
const _guards = require("@sniptt/guards");
const _i18n = require("twenty-shared/i18n");
const _utils = require("twenty-shared/utils");
const _enginecomponentkeyenum = require("../../../metadata-modules/command-menu-item/enums/engine-component-key.enum");
const _buildnavigationplaceholdervaluesutil = require("../../../metadata-modules/command-menu-item/utils/build-navigation-placeholder-values.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const INTERPOLATED_FIELDS = [
    'label',
    'shortLabel',
    'icon'
];
const interpolateNavigationCommandMenuItemEvent = ({ record, flatObjectMetadataMaps, buildI18nContext })=>{
    if (record.engineComponentKey !== _enginecomponentkeyenum.EngineComponentKey.NAVIGATION) {
        return record;
    }
    const navigationTargetObjectMetadataId = record.navigationTargetObjectMetadataId;
    if (!(0, _guards.isNonEmptyString)(navigationTargetObjectMetadataId)) {
        return record;
    }
    const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: navigationTargetObjectMetadataId,
        flatEntityMaps: flatObjectMetadataMaps
    });
    if (!(0, _utils.isDefined)(flatObjectMetadata)) {
        return record;
    }
    const placeholderValues = (0, _buildnavigationplaceholdervaluesutil.buildNavigationPlaceholderValues)({
        objectMetadata: flatObjectMetadata,
        i18nContext: buildI18nContext(flatObjectMetadata.applicationId ?? undefined)
    });
    const interpolated = {
        ...record
    };
    for (const field of INTERPOLATED_FIELDS){
        const value = interpolated[field];
        if (!(0, _guards.isNonEmptyString)(value)) {
            continue;
        }
        interpolated[field] = (0, _i18n.interpolateMessagePlaceholders)(value, placeholderValues);
    }
    return interpolated;
};

//# sourceMappingURL=interpolate-navigation-command-menu-item-event.util.js.map