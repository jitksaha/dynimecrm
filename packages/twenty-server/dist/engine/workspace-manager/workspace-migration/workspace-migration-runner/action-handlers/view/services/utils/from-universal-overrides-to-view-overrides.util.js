"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromUniversalOverridesToViewOverrides", {
    enumerable: true,
    get: function() {
        return fromUniversalOverridesToViewOverrides;
    }
});
const _findflatentitybyuniversalidentifierutil = require("../../../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const VIEW_OVERRIDES_UNIVERSAL_FIELD_METADATA_PROPERTIES = [
    'kanbanAggregateOperationFieldMetadataUniversalIdentifier',
    'calendarFieldMetadataUniversalIdentifier',
    'calendarEndFieldMetadataUniversalIdentifier',
    'mainGroupByFieldMetadataUniversalIdentifier'
];
const toForeignKeyProperty = (universalProperty)=>universalProperty.replace(/UniversalIdentifier$/, 'Id');
const fromUniversalOverridesToViewOverrides = ({ universalOverrides, flatFieldMetadataMaps })=>{
    const { kanbanAggregateOperationFieldMetadataUniversalIdentifier: _kanban, calendarFieldMetadataUniversalIdentifier: _calendar, calendarEndFieldMetadataUniversalIdentifier: _calendarEnd, mainGroupByFieldMetadataUniversalIdentifier: _mainGroupBy, ...scalarOverrides } = universalOverrides;
    return VIEW_OVERRIDES_UNIVERSAL_FIELD_METADATA_PROPERTIES.reduce((acc, universalProperty)=>{
        const universalIdentifier = universalOverrides[universalProperty];
        if (universalIdentifier === undefined) {
            return acc;
        }
        const foreignKeyProperty = toForeignKeyProperty(universalProperty);
        if (universalIdentifier === null) {
            return {
                ...acc,
                [foreignKeyProperty]: null
            };
        }
        const flatFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatFieldMetadataMaps,
            universalIdentifier
        });
        return {
            ...acc,
            [foreignKeyProperty]: flatFieldMetadata?.id ?? null
        };
    }, scalarOverrides);
};

//# sourceMappingURL=from-universal-overrides-to-view-overrides.util.js.map