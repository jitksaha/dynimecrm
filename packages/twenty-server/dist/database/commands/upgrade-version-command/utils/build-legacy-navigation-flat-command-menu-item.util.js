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
    get LEGACY_NAVIGATION_COMMAND_UUID_NAMESPACE () {
        return LEGACY_NAVIGATION_COMMAND_UUID_NAMESPACE;
    },
    get buildLegacyNavigationFlatCommandMenuItem () {
        return buildLegacyNavigationFlatCommandMenuItem;
    },
    get getLegacyNavigationCommandUniversalIdentifier () {
        return getLegacyNavigationCommandUniversalIdentifier;
    }
});
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _types = require("twenty-shared/types");
const _enginecomponentkeyenum = require("../../../../engine/metadata-modules/command-menu-item/enums/engine-component-key.enum");
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("../../../../engine/metadata-modules/flat-command-menu-item/utils/build-object-navigation-universal-flat-command-menu-item.util");
const LEGACY_NAVIGATION_COMMAND_UUID_NAMESPACE = 'b31830da-2ae0-48eb-a915-12fa4ab96dd3';
const getLegacyNavigationCommandUniversalIdentifier = (objectUniversalIdentifier)=>(0, _uuid.v5)(objectUniversalIdentifier, LEGACY_NAVIGATION_COMMAND_UUID_NAMESPACE);
const buildLegacyNavigationFlatCommandMenuItem = ({ objectMetadata, commandMenuItemId, applicationId, applicationUniversalIdentifier, workspaceId, position, now })=>{
    const universalIdentifier = getLegacyNavigationCommandUniversalIdentifier(objectMetadata.universalIdentifier);
    const conditionalAvailabilityExpression = (0, _buildobjectnavigationuniversalflatcommandmenuitemutil.buildNavigationConditionalAvailabilityExpression)({
        universalIdentifier: objectMetadata.universalIdentifier,
        nameSingular: objectMetadata.nameSingular
    });
    return {
        id: commandMenuItemId,
        universalIdentifier,
        applicationId,
        applicationUniversalIdentifier,
        workspaceId,
        label: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_LABEL,
        shortLabel: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_SHORT_LABEL,
        icon: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_ICON,
        position,
        isPinned: false,
        availabilityType: _types.CommandMenuItemAvailabilityType.GLOBAL,
        conditionalAvailabilityExpression,
        frontComponentId: null,
        frontComponentUniversalIdentifier: null,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        payload: {
            objectMetadataItemId: objectMetadata.id
        },
        navigationTargetObjectMetadataId: null,
        navigationTargetObjectMetadataUniversalIdentifier: null,
        hotKeys: (0, _utils.isDefined)(objectMetadata.shortcut) ? [
            'G',
            objectMetadata.shortcut
        ] : null,
        workflowVersionId: null,
        availabilityObjectMetadataId: null,
        availabilityObjectMetadataUniversalIdentifier: null,
        pageLayoutId: null,
        pageLayoutUniversalIdentifier: null,
        isActive: true,
        isSystemSideEffect: true,
        overrides: null,
        universalOverrides: null,
        createdAt: now,
        updatedAt: now
    };
};

//# sourceMappingURL=build-legacy-navigation-flat-command-menu-item.util.js.map