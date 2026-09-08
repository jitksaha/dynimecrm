"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromViewOverridesToUniversalOverrides", {
    enumerable: true,
    get: function() {
        return fromViewOverridesToUniversalOverrides;
    }
});
const _utils = require("twenty-shared/utils");
const _flatentitymapsexception = require("../../flat-entity/exceptions/flat-entity-maps.exception");
const VIEW_OVERRIDES_FIELD_METADATA_FOREIGN_KEYS = [
    'kanbanAggregateOperationFieldMetadataId',
    'calendarFieldMetadataId',
    'calendarEndFieldMetadataId',
    'mainGroupByFieldMetadataId'
];
const toUniversalIdentifierProperty = (foreignKey)=>foreignKey.replace(/Id$/, 'UniversalIdentifier');
const fromViewOverridesToUniversalOverrides = ({ overrides, fieldMetadataUniversalIdentifierById, shouldThrowOnMissingIdentifier = true })=>{
    const { kanbanAggregateOperationFieldMetadataId: _kanban, calendarFieldMetadataId: _calendar, calendarEndFieldMetadataId: _calendarEnd, mainGroupByFieldMetadataId: _mainGroupBy, ...scalarOverrides } = overrides;
    return VIEW_OVERRIDES_FIELD_METADATA_FOREIGN_KEYS.reduce((acc, foreignKey)=>{
        const foreignKeyValue = overrides[foreignKey];
        if (foreignKeyValue === undefined) {
            return acc;
        }
        const universalIdentifierProperty = toUniversalIdentifierProperty(foreignKey);
        if (foreignKeyValue === null) {
            return {
                ...acc,
                [universalIdentifierProperty]: null
            };
        }
        const universalIdentifier = fieldMetadataUniversalIdentifierById[foreignKeyValue];
        if (!(0, _utils.isDefined)(universalIdentifier)) {
            if (shouldThrowOnMissingIdentifier) {
                throw new _flatentitymapsexception.FlatEntityMapsException(`FieldMetadata universal identifier not found for id: ${foreignKeyValue}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.RELATION_UNIVERSAL_IDENTIFIER_NOT_FOUND);
            }
            return {
                ...acc,
                [universalIdentifierProperty]: null
            };
        }
        return {
            ...acc,
            [universalIdentifierProperty]: universalIdentifier
        };
    }, scalarOverrides);
};

//# sourceMappingURL=from-view-overrides-to-universal-overrides.util.js.map