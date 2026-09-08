"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _createemptyflatentitymapsconstant = require("../../../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _widgetconfigurationtypetype = require("../../../../page-layout-widget/enums/widget-configuration-type.type");
const _pagelayoutwidgetexception = require("../../../../page-layout-widget/exceptions/page-layout-widget.exception");
const _validatefrontcomponentheadercommandmenuitemsutil = require("../validate-front-component-header-command-menu-items.util");
const COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER = '11111111-1111-4111-8111-111111111111';
const makeWidget = ({ headerCommandMenuItemUniversalIdentifiers, applicationUniversalIdentifier = 'application-universal-identifier' })=>({
        applicationUniversalIdentifier,
        universalConfiguration: {
            configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FRONT_COMPONENT,
            frontComponentUniversalIdentifier: '22222222-2222-4222-8222-222222222222',
            headerCommandMenuItemUniversalIdentifiers
        }
    });
const makeCommandMenuItemMaps = ({ applicationUniversalIdentifier = 'application-universal-identifier' } = {})=>{
    const commandMenuItemMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
    const commandMenuItem = {
        universalIdentifier: COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER,
        applicationUniversalIdentifier
    };
    commandMenuItemMaps.byUniversalIdentifier[COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER] = commandMenuItem;
    return commandMenuItemMaps;
};
describe('validateFrontComponentHeaderCommandMenuItems', ()=>{
    it('accepts command menu items from the widget application', ()=>{
        expect((0, _validatefrontcomponentheadercommandmenuitemsutil.validateFrontComponentHeaderCommandMenuItems)({
            flatPageLayoutWidget: makeWidget({
                headerCommandMenuItemUniversalIdentifiers: [
                    COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER
                ]
            }),
            flatCommandMenuItemMaps: makeCommandMenuItemMaps()
        })).toEqual([]);
    });
    it('rejects missing, duplicate, and cross-application references', ()=>{
        const errors = (0, _validatefrontcomponentheadercommandmenuitemsutil.validateFrontComponentHeaderCommandMenuItems)({
            flatPageLayoutWidget: makeWidget({
                headerCommandMenuItemUniversalIdentifiers: [
                    COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER,
                    COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER,
                    '33333333-3333-4333-8333-333333333333'
                ]
            }),
            flatCommandMenuItemMaps: makeCommandMenuItemMaps({
                applicationUniversalIdentifier: 'another-application'
            })
        });
        expect(errors).toHaveLength(3);
        expect(errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                code: _pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA,
                value: COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER
            }),
            expect.objectContaining({
                code: _pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA,
                value: '33333333-3333-4333-8333-333333333333'
            })
        ]));
    });
});

//# sourceMappingURL=validate-front-component-header-command-menu-items.util.spec.js.map