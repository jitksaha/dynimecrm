"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildhideaskaiinsidepanelcommandmenuitemupdateutil = require("../build-hide-ask-ai-in-side-panel-command-menu-item-update.util");
const _createemptyflatentitymapsconstant = require("../../../../../../engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _standardcommandmenuitemconstant = require("../../../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
const _createstandardcommandmenuitemflatmetadatautil = require("../../../../../../engine/workspace-manager/twenty-standard-application/utils/command-menu-item/create-standard-command-menu-item-flat-metadata.util");
const NOW = '2026-09-01T12:00:00.000Z';
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
    conditionalAvailabilityExpression: 'permissionFlags.AI'
});
describe('buildHideAskAiInSidePanelCommandMenuItemUpdate', ()=>{
    it('updates the legacy availability expression to the standard definition', ()=>{
        expect((0, _buildhideaskaiinsidepanelcommandmenuitemupdateutil.buildHideAskAiInSidePanelCommandMenuItemUpdate)({
            existingCommandMenuItem: LEGACY_COMMAND_MENU_ITEM,
            now: NOW
        })).toEqual({
            ...LEGACY_COMMAND_MENU_ITEM,
            conditionalAvailabilityExpression: _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.askAi.conditionalAvailabilityExpression,
            updatedAt: NOW
        });
    });
    it('keeps the migrated expression synchronized with the standard definition', ()=>{
        expect(_standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.askAi.conditionalAvailabilityExpression).toBe('permissionFlags.AI and not isInSidePanel');
    });
    it.each([
        {
            name: 'missing command',
            existingCommandMenuItem: undefined
        },
        {
            name: 'custom availability expression',
            existingCommandMenuItem: {
                ...LEGACY_COMMAND_MENU_ITEM,
                conditionalAvailabilityExpression: 'permissionFlags.AI and objectPermissions.canReadObjectRecords'
            }
        },
        {
            name: 'already migrated command',
            existingCommandMenuItem: {
                ...LEGACY_COMMAND_MENU_ITEM,
                conditionalAvailabilityExpression: _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.askAi.conditionalAvailabilityExpression
            }
        }
    ])('skips $name', ({ existingCommandMenuItem })=>{
        expect((0, _buildhideaskaiinsidepanelcommandmenuitemupdateutil.buildHideAskAiInSidePanelCommandMenuItemUpdate)({
            existingCommandMenuItem,
            now: NOW
        })).toBeUndefined();
    });
});

//# sourceMappingURL=build-hide-ask-ai-in-side-panel-command-menu-item-update.util.spec.js.map