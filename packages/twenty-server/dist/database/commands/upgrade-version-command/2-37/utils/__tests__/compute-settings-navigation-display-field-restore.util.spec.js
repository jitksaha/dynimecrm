"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _computesettingsnavigationdisplayfieldrestoreutil = require("../compute-settings-navigation-display-field-restore.util");
const _enginecomponentkeyenum = require("../../../../../../engine/metadata-modules/command-menu-item/enums/engine-component-key.enum");
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("../../../../../../engine/metadata-modules/flat-command-menu-item/utils/build-object-navigation-universal-flat-command-menu-item.util");
const _standardcommandmenuitemconstant = require("../../../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
const NOW = '2026-08-27T00:00:00.000Z';
const GO_TO_SETTINGS = _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.goToSettings;
const buildFlatCommandMenuItem = (overrides)=>({
        universalIdentifier: overrides.id,
        engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.NAVIGATION,
        payload: {
            path: '/settings/profile'
        },
        label: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_LABEL,
        shortLabel: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_SHORT_LABEL,
        icon: _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_ICON,
        updatedAt: '2026-01-01T00:00:00.000Z',
        ...overrides
    });
const buildFlatCommandMenuItemMaps = (flatCommandMenuItems)=>({
        byUniversalIdentifier: Object.fromEntries(flatCommandMenuItems.map((item)=>[
                item.universalIdentifier,
                item
            ])),
        universalIdentifierById: Object.fromEntries(flatCommandMenuItems.map((item)=>[
                item.id,
                item.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
describe('computeSettingsNavigationDisplayFieldRestore', ()=>{
    it('restores the standard display fields on a corrupted settings navigation item', ()=>{
        const itemsToUpdate = (0, _computesettingsnavigationdisplayfieldrestoreutil.computeSettingsNavigationDisplayFieldRestore)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1',
                    universalIdentifier: GO_TO_SETTINGS.universalIdentifier
                })
            ]),
            now: NOW
        });
        expect(itemsToUpdate).toHaveLength(1);
        expect(itemsToUpdate[0]).toMatchObject({
            id: 'command-1',
            label: GO_TO_SETTINGS.label,
            shortLabel: GO_TO_SETTINGS.shortLabel,
            icon: GO_TO_SETTINGS.icon,
            updatedAt: NOW
        });
    });
    it('is idempotent once the display fields match the standard definition', ()=>{
        const itemsToUpdate = (0, _computesettingsnavigationdisplayfieldrestoreutil.computeSettingsNavigationDisplayFieldRestore)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1',
                    universalIdentifier: GO_TO_SETTINGS.universalIdentifier,
                    label: GO_TO_SETTINGS.label,
                    shortLabel: GO_TO_SETTINGS.shortLabel,
                    icon: GO_TO_SETTINGS.icon
                })
            ]),
            now: NOW
        });
        expect(itemsToUpdate).toEqual([]);
    });
    it('leaves an object navigation item on its placeholder templates', ()=>{
        const itemsToUpdate = (0, _computesettingsnavigationdisplayfieldrestoreutil.computeSettingsNavigationDisplayFieldRestore)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1',
                    payload: {
                        objectMetadataItemId: 'object-1'
                    }
                })
            ]),
            now: NOW
        });
        expect(itemsToUpdate).toEqual([]);
    });
    it('leaves a path navigation item that is not in the standard definition untouched', ()=>{
        const itemsToUpdate = (0, _computesettingsnavigationdisplayfieldrestoreutil.computeSettingsNavigationDisplayFieldRestore)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1'
                })
            ]),
            now: NOW
        });
        expect(itemsToUpdate).toEqual([]);
    });
    it('leaves a non navigation item untouched even when its label differs from the definition', ()=>{
        const itemsToUpdate = (0, _computesettingsnavigationdisplayfieldrestoreutil.computeSettingsNavigationDisplayFieldRestore)({
            flatCommandMenuItemMaps: buildFlatCommandMenuItemMaps([
                buildFlatCommandMenuItem({
                    id: 'command-1',
                    universalIdentifier: GO_TO_SETTINGS.universalIdentifier,
                    engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.FRONT_COMPONENT_RENDERER
                })
            ]),
            now: NOW
        });
        expect(itemsToUpdate).toEqual([]);
    });
});

//# sourceMappingURL=compute-settings-navigation-display-field-restore.util.spec.js.map