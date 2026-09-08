"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFrontComponentFlatPageLayoutWidgetForUpdate", {
    enumerable: true,
    get: function() {
        return validateFrontComponentFlatPageLayoutWidgetForUpdate;
    }
});
const _utils = require("twenty-shared/utils");
const _validatefrontcomponentconfigurationtypeutil = require("./validate-front-component-configuration-type.util");
const _validatefrontcomponentheadercommandmenuitemsutil = require("./validate-front-component-header-command-menu-items.util");
const validateFrontComponentFlatPageLayoutWidgetForUpdate = (args)=>{
    const { flatEntityToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatCommandMenuItemMaps } } = args;
    const { universalConfiguration, title } = flatEntityToValidate;
    const errors = [];
    if (!(0, _utils.isDefined)(universalConfiguration)) {
        return [];
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

//# sourceMappingURL=validate-front-component-flat-page-layout-widget-for-update.util.js.map