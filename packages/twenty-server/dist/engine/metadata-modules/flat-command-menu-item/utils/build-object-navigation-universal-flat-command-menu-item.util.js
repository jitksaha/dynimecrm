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
    get NAVIGATION_INTERPOLATED_ICON () {
        return NAVIGATION_INTERPOLATED_ICON;
    },
    get NAVIGATION_INTERPOLATED_LABEL () {
        return NAVIGATION_INTERPOLATED_LABEL;
    },
    get NAVIGATION_INTERPOLATED_SHORT_LABEL () {
        return NAVIGATION_INTERPOLATED_SHORT_LABEL;
    },
    get buildNavigationConditionalAvailabilityExpression () {
        return buildNavigationConditionalAvailabilityExpression;
    },
    get buildObjectNavigationUniversalFlatCommandMenuItem () {
        return buildObjectNavigationUniversalFlatCommandMenuItem;
    }
});
const _application = require("twenty-shared/application");
const _i18n = require("twenty-shared/i18n");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _enginecomponentkeyenum = require("../../command-menu-item/enums/engine-component-key.enum");
const _i18nlabelutil = require("../../../workspace-manager/twenty-standard-application/utils/i18n-label.util");
const NAVIGATION_INTERPOLATED_LABEL = (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
    id: "crn/PJ",
    message: "Go to {objectLabelPlural}"
});
const NAVIGATION_INTERPOLATED_SHORT_LABEL = (0, _i18n.getMetadataLabelPlaceholder)('objectLabelPlural');
const NAVIGATION_INTERPOLATED_ICON = (0, _i18n.getMetadataLabelPlaceholder)('objectIcon');
const NAVIGATION_FEATURE_FLAG_GATE_BY_OBJECT_UNIVERSAL_IDENTIFIER = {
    [_metadata.STANDARD_OBJECTS.messageCampaign.universalIdentifier]: _types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED,
    [_metadata.STANDARD_OBJECTS.messageList.universalIdentifier]: _types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED
};
const buildNavigationConditionalAvailabilityExpression = ({ universalIdentifier, nameSingular })=>{
    const targetObjectReadPermissionExpression = `targetObjectReadPermissions.${nameSingular}`;
    const featureFlagGate = NAVIGATION_FEATURE_FLAG_GATE_BY_OBJECT_UNIVERSAL_IDENTIFIER[universalIdentifier];
    return (0, _utils.isDefined)(featureFlagGate) ? `featureFlags.${featureFlagGate} and ${targetObjectReadPermissionExpression}` : targetObjectReadPermissionExpression;
};
const buildObjectNavigationUniversalFlatCommandMenuItem = ({ objectMetadata, applicationUniversalIdentifier, position, now })=>{
    const universalIdentifier = (0, _application.getSystemNavigationCommandMenuItemUniversalIdentifier)({
        objectMetadataApplicationUniversalIdentifier: applicationUniversalIdentifier,
        objectUniversalIdentifier: objectMetadata.universalIdentifier
    });
    const conditionalAvailabilityExpression = buildNavigationConditionalAvailabilityExpression({
        universalIdentifier: objectMetadata.universalIdentifier,
        nameSingular: objectMetadata.nameSingular
    });
    return {
        universalIdentifier,
        applicationUniversalIdentifier,
        label: NAVIGATION_INTERPOLATED_LABEL,
        shortLabel: NAVIGATION_INTERPOLATED_SHORT_LABEL,
        icon: NAVIGATION_INTERPOLATED_ICON,
        position,
        isPinned: false,
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        payload: null,
        navigationTargetObjectMetadataUniversalIdentifier: objectMetadata.universalIdentifier,
        hotKeys: (0, _utils.isDefined)(objectMetadata.shortcut) ? [
            'G',
            objectMetadata.shortcut
        ] : null,
        workflowVersionId: null,
        availabilityObjectMetadataUniversalIdentifier: null,
        pageLayoutUniversalIdentifier: null,
        isActive: objectMetadata.isActive,
        isSystemSideEffect: true,
        universalOverrides: null,
        createdAt: now,
        updatedAt: now
    };
};

//# sourceMappingURL=build-object-navigation-universal-flat-command-menu-item.util.js.map