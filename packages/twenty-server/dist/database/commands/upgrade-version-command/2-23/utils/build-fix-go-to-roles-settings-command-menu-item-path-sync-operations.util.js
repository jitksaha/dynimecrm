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
    get GO_TO_ROLES_SETTINGS_PATH () {
        return GO_TO_ROLES_SETTINGS_PATH;
    },
    get LEGACY_GO_TO_ROLES_SETTINGS_PATH () {
        return LEGACY_GO_TO_ROLES_SETTINGS_PATH;
    },
    get buildFixGoToRolesSettingsCommandMenuItemPathSyncOperations () {
        return buildFixGoToRolesSettingsCommandMenuItemPathSyncOperations;
    }
});
const _utils = require("twenty-shared/utils");
const _standardcommandmenuitemconstant = require("../../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
const LEGACY_GO_TO_ROLES_SETTINGS_PATH = '/settings/roles';
const GO_TO_ROLES_SETTINGS_PATH = '/settings/members#roles';
const GO_TO_ROLES_SETTINGS_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER = _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.goToSettingsRoles.universalIdentifier;
const buildFixGoToRolesSettingsCommandMenuItemPathSyncOperations = ({ existingFlatCommandMenuItemMaps, now })=>{
    const existingGoToRolesSettingsCommandMenuItem = existingFlatCommandMenuItemMaps.byUniversalIdentifier[GO_TO_ROLES_SETTINGS_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER];
    const existingPath = existingGoToRolesSettingsCommandMenuItem?.payload && 'path' in existingGoToRolesSettingsCommandMenuItem.payload ? existingGoToRolesSettingsCommandMenuItem.payload.path : undefined;
    if (!(0, _utils.isDefined)(existingGoToRolesSettingsCommandMenuItem) || existingPath !== LEGACY_GO_TO_ROLES_SETTINGS_PATH) {
        return {
            flatEntityToCreate: [],
            flatEntityToDelete: [],
            flatEntityToUpdate: []
        };
    }
    return {
        flatEntityToCreate: [],
        flatEntityToDelete: [],
        flatEntityToUpdate: [
            {
                ...existingGoToRolesSettingsCommandMenuItem,
                payload: {
                    path: GO_TO_ROLES_SETTINGS_PATH
                },
                updatedAt: now
            }
        ]
    };
};

//# sourceMappingURL=build-fix-go-to-roles-settings-command-menu-item-path-sync-operations.util.js.map