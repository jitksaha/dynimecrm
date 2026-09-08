"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFrontComponentHeaderCommandMenuItems", {
    enumerable: true,
    get: function() {
        return validateFrontComponentHeaderCommandMenuItems;
    }
});
const _core = require("@lingui/core");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _widgetconfigurationtypetype = require("../../../page-layout-widget/enums/widget-configuration-type.type");
const _pagelayoutwidgetexception = require("../../../page-layout-widget/exceptions/page-layout-widget.exception");
const validateFrontComponentHeaderCommandMenuItems = ({ flatPageLayoutWidget, flatCommandMenuItemMaps })=>{
    const { universalConfiguration } = flatPageLayoutWidget;
    if (universalConfiguration.configurationType !== _widgetconfigurationtypetype.WidgetConfigurationType.FRONT_COMPONENT) {
        return [];
    }
    const commandMenuItemUniversalIdentifiers = universalConfiguration.headerCommandMenuItemUniversalIdentifiers ?? [];
    const errors = [];
    const uniqueCommandMenuItemUniversalIdentifiers = new Set(commandMenuItemUniversalIdentifiers);
    if (uniqueCommandMenuItemUniversalIdentifiers.size !== commandMenuItemUniversalIdentifiers.length) {
        errors.push({
            code: _pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "pjpuGA",
                message: "Widget header command menu item references must be unique"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "GE0fWY",
                message: "Widget header actions must be unique"
            }
        });
    }
    for (const commandMenuItemUniversalIdentifier of uniqueCommandMenuItemUniversalIdentifiers){
        const commandMenuItem = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: commandMenuItemUniversalIdentifier,
            flatEntityMaps: flatCommandMenuItemMaps
        });
        if (!(0, _utils.isDefined)(commandMenuItem)) {
            errors.push({
                code: _pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "fmk0Wo",
                    message: "Command menu item {commandMenuItemUniversalIdentifier} referenced by widget header was not found",
                    values: {
                        commandMenuItemUniversalIdentifier: commandMenuItemUniversalIdentifier
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "I0rHKG",
                    message: "A widget header action was not found"
                },
                value: commandMenuItemUniversalIdentifier
            });
            continue;
        }
        if (commandMenuItem.applicationUniversalIdentifier !== flatPageLayoutWidget.applicationUniversalIdentifier) {
            errors.push({
                code: _pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "8nN8qg",
                    message: "Command menu item {commandMenuItemUniversalIdentifier} referenced by widget header belongs to another application",
                    values: {
                        commandMenuItemUniversalIdentifier: commandMenuItemUniversalIdentifier
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "djzz9p",
                    message: "Widget header actions must belong to the same application as the widget"
                },
                value: commandMenuItemUniversalIdentifier
            });
        }
    }
    return errors;
};

//# sourceMappingURL=validate-front-component-header-command-menu-items.util.js.map