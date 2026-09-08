"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromCommandMenuItemManifestToUniversalFlatCommandMenuItem", {
    enumerable: true,
    get: function() {
        return fromCommandMenuItemManifestToUniversalFlatCommandMenuItem;
    }
});
const _types = require("twenty-shared/types");
const _enginecomponentkeyenum = require("../../../../metadata-modules/command-menu-item/enums/engine-component-key.enum");
const fromCommandMenuItemManifestToUniversalFlatCommandMenuItem = ({ commandMenuItemManifest, applicationUniversalIdentifier, now })=>{
    return {
        universalIdentifier: commandMenuItemManifest.universalIdentifier,
        applicationUniversalIdentifier,
        label: commandMenuItemManifest.label,
        shortLabel: commandMenuItemManifest.shortLabel ?? null,
        position: 0,
        icon: commandMenuItemManifest.icon ?? null,
        isPinned: commandMenuItemManifest.isPinned ?? false,
        availabilityType: commandMenuItemManifest.availabilityType ?? _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression: commandMenuItemManifest.conditionalAvailabilityExpression ?? null,
        frontComponentUniversalIdentifier: commandMenuItemManifest.frontComponentUniversalIdentifier,
        availabilityObjectMetadataUniversalIdentifier: commandMenuItemManifest.availabilityObjectUniversalIdentifier ?? null,
        navigationTargetObjectMetadataUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.FRONT_COMPONENT_RENDERER,
        payload: null,
        hotKeys: null,
        workflowVersionId: null,
        pageLayoutUniversalIdentifier: null,
        isActive: true,
        isSystemSideEffect: false,
        universalOverrides: null,
        createdAt: now,
        updatedAt: now
    };
};

//# sourceMappingURL=from-command-menu-item-manifest-to-universal-flat-command-menu-item.util.js.map