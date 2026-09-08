"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeSettingsNavigationDisplayFieldRestore", {
    enumerable: true,
    get: function() {
        return computeSettingsNavigationDisplayFieldRestore;
    }
});
const _utils = require("twenty-shared/utils");
const _enginecomponentkeyenum = require("../../../../../engine/metadata-modules/command-menu-item/enums/engine-component-key.enum");
const _isobjectmetadatacommandmenuitempayloadutil = require("../../../../../engine/metadata-modules/command-menu-item/utils/is-object-metadata-command-menu-item-payload.util");
const _standardcommandmenuitemconstant = require("../../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
const DISPLAY_FIELDS = [
    'label',
    'shortLabel',
    'icon'
];
const STANDARD_DISPLAY_FIELDS_BY_UNIVERSAL_IDENTIFIER = Object.fromEntries(Object.values(_standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS).map((item)=>[
        item.universalIdentifier,
        {
            label: item.label,
            shortLabel: item.shortLabel,
            icon: item.icon
        }
    ]));
const computeSettingsNavigationDisplayFieldRestore = ({ flatCommandMenuItemMaps, now })=>{
    return Object.values(flatCommandMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatCommandMenuItem)=>flatCommandMenuItem.engineComponentKey === _enginecomponentkeyenum.EngineComponentKey.NAVIGATION && !(0, _isobjectmetadatacommandmenuitempayloadutil.isObjectMetadataCommandMenuItemPayload)(flatCommandMenuItem.payload)).flatMap((flatCommandMenuItem)=>{
        const standardDisplayFields = STANDARD_DISPLAY_FIELDS_BY_UNIVERSAL_IDENTIFIER[flatCommandMenuItem.universalIdentifier];
        if (!(0, _utils.isDefined)(standardDisplayFields) || DISPLAY_FIELDS.every((field)=>flatCommandMenuItem[field] === standardDisplayFields[field])) {
            return [];
        }
        return [
            {
                ...flatCommandMenuItem,
                ...standardDisplayFields,
                updatedAt: now
            }
        ];
    });
};

//# sourceMappingURL=compute-settings-navigation-display-field-restore.util.js.map