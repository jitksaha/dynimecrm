"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromCommandMenuItemOverridesToUniversalOverrides", {
    enumerable: true,
    get: function() {
        return fromCommandMenuItemOverridesToUniversalOverrides;
    }
});
const _utils = require("twenty-shared/utils");
const _flatentitymapsexception = require("../../flat-entity/exceptions/flat-entity-maps.exception");
const COMMAND_MENU_ITEM_OVERRIDES_FOREIGN_KEYS = [
    {
        foreignKey: 'availabilityObjectMetadataId',
        universalProperty: 'availabilityObjectMetadataUniversalIdentifier',
        mapName: 'objectMetadata'
    },
    {
        foreignKey: 'pageLayoutId',
        universalProperty: 'pageLayoutUniversalIdentifier',
        mapName: 'pageLayout'
    }
];
const fromCommandMenuItemOverridesToUniversalOverrides = ({ overrides, objectMetadataUniversalIdentifierById, pageLayoutUniversalIdentifierById, shouldThrowOnMissingIdentifier = true })=>{
    const { availabilityObjectMetadataId: _availabilityObjectMetadataId, pageLayoutId: _pageLayoutId, ...scalarOverrides } = overrides;
    const universalIdentifierByIdByMapName = {
        objectMetadata: objectMetadataUniversalIdentifierById,
        pageLayout: pageLayoutUniversalIdentifierById
    };
    return COMMAND_MENU_ITEM_OVERRIDES_FOREIGN_KEYS.reduce((acc, { foreignKey, universalProperty, mapName })=>{
        const foreignKeyValue = overrides[foreignKey];
        if (foreignKeyValue === undefined) {
            return acc;
        }
        if (foreignKeyValue === null) {
            return {
                ...acc,
                [universalProperty]: null
            };
        }
        const universalIdentifier = universalIdentifierByIdByMapName[mapName][foreignKeyValue];
        if (!(0, _utils.isDefined)(universalIdentifier)) {
            if (shouldThrowOnMissingIdentifier) {
                throw new _flatentitymapsexception.FlatEntityMapsException(`${mapName} universal identifier not found for id: ${foreignKeyValue}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.RELATION_UNIVERSAL_IDENTIFIER_NOT_FOUND);
            }
            return {
                ...acc,
                [universalProperty]: null
            };
        }
        return {
            ...acc,
            [universalProperty]: universalIdentifier
        };
    }, scalarOverrides);
};

//# sourceMappingURL=from-command-menu-item-overrides-to-universal-overrides.util.js.map