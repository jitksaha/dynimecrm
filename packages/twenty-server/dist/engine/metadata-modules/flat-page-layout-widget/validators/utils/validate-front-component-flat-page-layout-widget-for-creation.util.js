"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFrontComponentFlatPageLayoutWidgetForCreation", {
    enumerable: true,
    get: function() {
        return validateFrontComponentFlatPageLayoutWidgetForCreation;
    }
});
const _core = require("@lingui/core");
const _utils = require("twenty-shared/utils");
const _validatefrontcomponentconfigurationtypeutil = require("./validate-front-component-configuration-type.util");
const _validatefrontcomponentheadercommandmenuitemsutil = require("./validate-front-component-header-command-menu-items.util");
const _pagelayoutwidgetexception = require("../../../page-layout-widget/exceptions/page-layout-widget.exception");
const validateFrontComponentFlatPageLayoutWidgetForCreation = (args)=>{
    const { flatEntityToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatCommandMenuItemMaps } } = args;
    const { universalConfiguration, title } = flatEntityToValidate;
    const errors = [];
    if (!(0, _utils.isDefined)(universalConfiguration)) {
        errors.push({
            code: _pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "tBK3H8",
                message: 'Configuration is required for front component widget "{title}"',
                values: {
                    title: title
                }
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "3UUjIe",
                message: "Configuration is required for front component widget"
            }
        });
        return errors;
    }
    const configurationTypeErrors = (0, _validatefrontcomponentconfigurationtypeutil.validateFrontComponentConfigurationType)({
        universalConfiguration,
        title
    });
    errors.push(...configurationTypeErrors);
    errors.push(...(0, _validatefrontcomponentheadercommandmenuitemsutil.validateFrontComponentHeaderCommandMenuItems)({
        flatPageLayoutWidget: flatEntityToValidate,
        flatCommandMenuItemMaps
    }));
    return errors;
};

//# sourceMappingURL=validate-front-component-flat-page-layout-widget-for-creation.util.js.map