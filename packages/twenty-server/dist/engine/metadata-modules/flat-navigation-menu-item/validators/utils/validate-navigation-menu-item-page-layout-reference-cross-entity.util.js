"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateNavigationMenuItemPageLayoutReferenceCrossEntity", {
    enumerable: true,
    get: function() {
        return validateNavigationMenuItemPageLayoutReferenceCrossEntity;
    }
});
const _core = require("@lingui/core");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _navigationmenuitemexception = require("../../../navigation-menu-item/navigation-menu-item.exception");
const _getflatentityvalidationerrorutil = require("../../../../workspace-manager/workspace-migration/workspace-migration-builder/builders/utils/get-flat-entity-validation-error.util");
const validateNavigationMenuItemPageLayoutReferenceCrossEntity = ({ optimisticUniversalFlatMaps, orchestratorActionsReport })=>{
    const validationErrors = {
        navigationMenuItem: []
    };
    const createdNavigationMenuItemUniversalIdentifiers = new Set(orchestratorActionsReport.navigationMenuItem.create.map((action)=>action.flatEntity.universalIdentifier));
    const updatedNavigationMenuItemUniversalIdentifiers = new Set(orchestratorActionsReport.navigationMenuItem.update.map((action)=>action.universalIdentifier));
    const touchedPageLayoutUniversalIdentifiers = new Set([
        ...orchestratorActionsReport.pageLayout.create.map((action)=>action.flatEntity.universalIdentifier),
        ...orchestratorActionsReport.pageLayout.update.map((action)=>action.universalIdentifier)
    ]);
    const navigationMenuItemUniversalIdentifiersToValidate = new Set([
        ...createdNavigationMenuItemUniversalIdentifiers,
        ...updatedNavigationMenuItemUniversalIdentifiers
    ]);
    if (touchedPageLayoutUniversalIdentifiers.size > 0) {
        for (const navigationMenuItem of Object.values(optimisticUniversalFlatMaps.flatNavigationMenuItemMaps.byUniversalIdentifier)){
            if ((0, _utils.isDefined)(navigationMenuItem) && (0, _utils.isDefined)(navigationMenuItem.pageLayoutUniversalIdentifier) && touchedPageLayoutUniversalIdentifiers.has(navigationMenuItem.pageLayoutUniversalIdentifier)) {
                navigationMenuItemUniversalIdentifiersToValidate.add(navigationMenuItem.universalIdentifier);
            }
        }
    }
    for (const universalIdentifier of navigationMenuItemUniversalIdentifiersToValidate){
        const navigationMenuItem = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier,
            flatEntityMaps: optimisticUniversalFlatMaps.flatNavigationMenuItemMaps
        });
        if (!(0, _utils.isDefined)(navigationMenuItem) || navigationMenuItem.type !== _types.NavigationMenuItemType.PAGE_LAYOUT || !(0, _utils.isDefined)(navigationMenuItem.pageLayoutUniversalIdentifier)) {
            continue;
        }
        const referencedPageLayout = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: navigationMenuItem.pageLayoutUniversalIdentifier,
            flatEntityMaps: optimisticUniversalFlatMaps.flatPageLayoutMaps
        });
        if (!(0, _utils.isDefined)(referencedPageLayout) || referencedPageLayout.type === _types.PageLayoutType.STANDALONE_PAGE) {
            continue;
        }
        const failedValidation = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier: navigationMenuItem.universalIdentifier
            },
            metadataName: 'navigationMenuItem',
            type: createdNavigationMenuItemUniversalIdentifiers.has(universalIdentifier) ? 'create' : 'update'
        });
        failedValidation.errors.push({
            code: _navigationmenuitemexception.NavigationMenuItemExceptionCode.INVALID_NAVIGATION_MENU_ITEM_INPUT,
            message: _core.i18n._(/*i18n*/ {
                id: "L7qZ9I",
                message: "PAGE_LAYOUT navigation menu item must reference a STANDALONE_PAGE page layout"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "IaspUK",
                message: "A page layout navigation menu item can only point to a standalone page"
            }
        });
        validationErrors.navigationMenuItem.push(failedValidation);
    }
    return validationErrors;
};

//# sourceMappingURL=validate-navigation-menu-item-page-layout-reference-cross-entity.util.js.map