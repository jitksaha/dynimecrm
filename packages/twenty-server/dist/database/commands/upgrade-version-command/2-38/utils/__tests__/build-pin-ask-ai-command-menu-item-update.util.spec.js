"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildpinaskaicommandmenuitemupdateutil = require("../build-pin-ask-ai-command-menu-item-update.util");
const _createemptyflatentitymapsconstant = require("../../../../../../engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _createstandardcommandmenuitemflatmetadatautil = require("../../../../../../engine/workspace-manager/twenty-standard-application/utils/command-menu-item/create-standard-command-menu-item-flat-metadata.util");
const NOW = '2026-08-28T14:00:00.000Z';
const LEGACY_COMMAND_MENU_ITEM = Object.freeze({
    ...(0, _createstandardcommandmenuitemflatmetadatautil.createStandardCommandMenuItemFlatMetadata)({
        commandMenuItemName: 'askAi',
        commandMenuItemId: 'ask-ai-command-id',
        workspaceId: 'workspace-id',
        twentyStandardApplicationId: 'application-id',
        dependencyFlatEntityMaps: {
            flatObjectMetadataMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
        },
        now: '2026-08-01T00:00:00.000Z'
    }),
    isPinned: false,
    shortLabel: 'Ask AI',
    icon: 'IconSparkles'
});
describe('buildPinAskAiCommandMenuItemUpdate', ()=>{
    it('pins the command, drops its short label, and updates its icon', ()=>{
        expect((0, _buildpinaskaicommandmenuitemupdateutil.buildPinAskAiCommandMenuItemUpdate)({
            existingCommandMenuItem: LEGACY_COMMAND_MENU_ITEM,
            now: NOW
        })).toEqual({
            ...LEGACY_COMMAND_MENU_ITEM,
            isPinned: true,
            shortLabel: null,
            icon: 'IconMessageCirclePlus',
            updatedAt: NOW
        });
    });
    it.each([
        {
            name: 'missing command',
            existingCommandMenuItem: undefined
        },
        {
            name: 'command already pinned',
            existingCommandMenuItem: {
                ...LEGACY_COMMAND_MENU_ITEM,
                isPinned: true
            }
        },
        {
            name: 'custom short label',
            existingCommandMenuItem: {
                ...LEGACY_COMMAND_MENU_ITEM,
                shortLabel: 'Ask Twenty'
            }
        },
        {
            name: 'custom icon',
            existingCommandMenuItem: {
                ...LEGACY_COMMAND_MENU_ITEM,
                icon: 'IconRobot'
            }
        },
        {
            name: 'workspace pinning override',
            existingCommandMenuItem: {
                ...LEGACY_COMMAND_MENU_ITEM,
                overrides: {
                    isPinned: false
                }
            }
        },
        {
            name: 'workspace short label override',
            existingCommandMenuItem: {
                ...LEGACY_COMMAND_MENU_ITEM,
                overrides: {
                    shortLabel: 'Ask AI'
                }
            }
        },
        {
            name: 'workspace icon override',
            existingCommandMenuItem: {
                ...LEGACY_COMMAND_MENU_ITEM,
                overrides: {
                    icon: 'IconSparkles'
                }
            }
        }
    ])('skips $name', ({ existingCommandMenuItem })=>{
        expect((0, _buildpinaskaicommandmenuitemupdateutil.buildPinAskAiCommandMenuItemUpdate)({
            existingCommandMenuItem,
            now: NOW
        })).toBeUndefined();
    });
    it('does not update an already migrated command', ()=>{
        const updatedCommandMenuItem = (0, _buildpinaskaicommandmenuitemupdateutil.buildPinAskAiCommandMenuItemUpdate)({
            existingCommandMenuItem: LEGACY_COMMAND_MENU_ITEM,
            now: NOW
        });
        expect(updatedCommandMenuItem).toBeDefined();
        expect((0, _buildpinaskaicommandmenuitemupdateutil.buildPinAskAiCommandMenuItemUpdate)({
            existingCommandMenuItem: updatedCommandMenuItem,
            now: '2026-08-29T14:00:00.000Z'
        })).toBeUndefined();
    });
});

//# sourceMappingURL=build-pin-ask-ai-command-menu-item-update.util.spec.js.map