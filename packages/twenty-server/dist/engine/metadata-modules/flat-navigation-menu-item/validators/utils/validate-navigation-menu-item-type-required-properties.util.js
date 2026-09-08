"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateNavigationMenuItemTypeRequiredProperties", {
    enumerable: true,
    get: function() {
        return validateNavigationMenuItemTypeRequiredProperties;
    }
});
const _core = require("@lingui/core");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _navigationmenuitemexception = require("../../../navigation-menu-item/navigation-menu-item.exception");
const buildInvalidInputError = (message, userFriendlyMessage)=>({
        code: _navigationmenuitemexception.NavigationMenuItemExceptionCode.INVALID_NAVIGATION_MENU_ITEM_INPUT,
        message,
        userFriendlyMessage
    });
const validateUuidProperty = ({ value, message, userFriendlyMessage })=>(0, _utils.isDefined)(value) && (0, _utils.isValidUuid)(value) ? [] : [
        buildInvalidInputError(message, userFriendlyMessage)
    ];
const validateNavigationMenuItemTypeRequiredProperties = ({ flatNavigationMenuItem })=>{
    const { type, name, link, targetRecordId, targetObjectMetadataUniversalIdentifier, viewUniversalIdentifier, pageLayoutUniversalIdentifier } = flatNavigationMenuItem;
    if (!(0, _utils.isDefined)(type)) {
        return [
            buildInvalidInputError(_core.i18n._(/*i18n*/ {
                id: "Ii6d/e",
                message: "Navigation menu item type is required"
            }), /*i18n*/ {
                id: "Ii6d/e",
                message: "Navigation menu item type is required"
            })
        ];
    }
    switch(type){
        case _types.NavigationMenuItemType.FOLDER:
            {
                return (0, _utils.isDefined)(name) && name.trim() !== '' ? [] : [
                    buildInvalidInputError(_core.i18n._(/*i18n*/ {
                        id: "idm+pJ",
                        message: "A name is required for FOLDER type"
                    }), /*i18n*/ {
                        id: "idm+pJ",
                        message: "A name is required for FOLDER type"
                    })
                ];
            }
        case _types.NavigationMenuItemType.OBJECT:
            {
                return validateUuidProperty({
                    value: targetObjectMetadataUniversalIdentifier,
                    message: _core.i18n._(/*i18n*/ {
                        id: "jS+jUv",
                        message: "A valid targetObjectMetadataUniversalIdentifier is required for OBJECT type"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "jS+jUv",
                        message: "A valid targetObjectMetadataUniversalIdentifier is required for OBJECT type"
                    }
                });
            }
        case _types.NavigationMenuItemType.VIEW:
            {
                return validateUuidProperty({
                    value: viewUniversalIdentifier,
                    message: _core.i18n._(/*i18n*/ {
                        id: "+FHERL",
                        message: "A valid viewUniversalIdentifier is required for VIEW type"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "+FHERL",
                        message: "A valid viewUniversalIdentifier is required for VIEW type"
                    }
                });
            }
        case _types.NavigationMenuItemType.RECORD:
            {
                return [
                    ...validateUuidProperty({
                        value: targetRecordId,
                        message: _core.i18n._(/*i18n*/ {
                            id: "RfwvVB",
                            message: "A valid targetRecordId is required for RECORD type"
                        }),
                        userFriendlyMessage: /*i18n*/ {
                            id: "RfwvVB",
                            message: "A valid targetRecordId is required for RECORD type"
                        }
                    }),
                    ...validateUuidProperty({
                        value: targetObjectMetadataUniversalIdentifier,
                        message: _core.i18n._(/*i18n*/ {
                            id: "KUnzGr",
                            message: "A valid targetObjectMetadataUniversalIdentifier is required for RECORD type"
                        }),
                        userFriendlyMessage: /*i18n*/ {
                            id: "KUnzGr",
                            message: "A valid targetObjectMetadataUniversalIdentifier is required for RECORD type"
                        }
                    })
                ];
            }
        case _types.NavigationMenuItemType.LINK:
            {
                return (0, _utils.isDefined)(link) && (0, _utils.isValidUrl)(link) ? [] : [
                    buildInvalidInputError(_core.i18n._(/*i18n*/ {
                        id: "Dwa/Bm",
                        message: "A valid link is required for LINK type"
                    }), /*i18n*/ {
                        id: "Dwa/Bm",
                        message: "A valid link is required for LINK type"
                    })
                ];
            }
        case _types.NavigationMenuItemType.PAGE_LAYOUT:
            {
                return validateUuidProperty({
                    value: pageLayoutUniversalIdentifier,
                    message: _core.i18n._(/*i18n*/ {
                        id: "hfYxN9",
                        message: "A valid pageLayoutUniversalIdentifier is required for PAGE_LAYOUT type"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "hfYxN9",
                        message: "A valid pageLayoutUniversalIdentifier is required for PAGE_LAYOUT type"
                    }
                });
            }
        default:
            {
                return [
                    buildInvalidInputError(_core.i18n._(/*i18n*/ {
                        id: "of4ZuG",
                        message: "Unknown navigation menu item type {type}",
                        values: {
                            type: type
                        }
                    }), /*i18n*/ {
                        id: "of4ZuG",
                        message: "Unknown navigation menu item type {type}",
                        values: {
                            type: type
                        }
                    })
                ];
            }
    }
};

//# sourceMappingURL=validate-navigation-menu-item-type-required-properties.util.js.map