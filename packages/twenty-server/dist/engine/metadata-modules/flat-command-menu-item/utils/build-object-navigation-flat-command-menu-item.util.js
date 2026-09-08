"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildObjectNavigationFlatCommandMenuItem", {
    enumerable: true,
    get: function() {
        return buildObjectNavigationFlatCommandMenuItem;
    }
});
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("./build-object-navigation-universal-flat-command-menu-item.util");
const buildObjectNavigationFlatCommandMenuItem = ({ objectMetadata, commandMenuItemId, applicationId, applicationUniversalIdentifier, workspaceId, position, now })=>({
        ...(0, _buildobjectnavigationuniversalflatcommandmenuitemutil.buildObjectNavigationUniversalFlatCommandMenuItem)({
            objectMetadata,
            applicationUniversalIdentifier,
            position,
            now
        }),
        id: commandMenuItemId,
        applicationId,
        workspaceId,
        frontComponentId: null,
        navigationTargetObjectMetadataId: objectMetadata.id,
        availabilityObjectMetadataId: null,
        pageLayoutId: null,
        overrides: null
    });

//# sourceMappingURL=build-object-navigation-flat-command-menu-item.util.js.map