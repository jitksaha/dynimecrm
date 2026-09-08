"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getEmptinessColumnNamesForField", {
    enumerable: true,
    get: function() {
        return getEmptinessColumnNamesForField;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _computecolumnnameutil = require("../../field-metadata/utils/compute-column-name.util");
// Composite properties that carry workspace defaults (currency codes, phone
// country/calling codes): a stamped default would mask emptiness of the value
// users actually fill in
const DEFAULT_BEARING_COMPOSITE_PROPERTIES = {
    [_types.FieldMetadataType.CURRENCY]: [
        'currencyCode'
    ],
    [_types.FieldMetadataType.PHONES]: [
        'primaryPhoneCountryCode',
        'primaryPhoneCallingCode'
    ]
};
const getCompositeEmptinessColumnNames = (flatFieldMetadata)=>{
    const compositeType = _types.compositeTypeDefinitions.get(flatFieldMetadata.type);
    if (!(0, _utils.isDefined)(compositeType)) {
        return null;
    }
    const defaultBearingProperties = DEFAULT_BEARING_COMPOSITE_PROPERTIES[flatFieldMetadata.type] ?? [];
    return compositeType.properties.filter((property)=>!defaultBearingProperties.includes(property.name)).map((property)=>(0, _computecolumnnameutil.computeCompositeColumnName)(flatFieldMetadata.name, property));
};
const getEmptinessColumnNamesForField = (flatFieldMetadata)=>{
    switch(flatFieldMetadata.type){
        case _types.FieldMetadataType.TEXT:
        case _types.FieldMetadataType.NUMBER:
        case _types.FieldMetadataType.NUMERIC:
        case _types.FieldMetadataType.DATE:
        case _types.FieldMetadataType.DATE_TIME:
        case _types.FieldMetadataType.RATING:
        case _types.FieldMetadataType.SELECT:
        case _types.FieldMetadataType.MULTI_SELECT:
        case _types.FieldMetadataType.ARRAY:
        case _types.FieldMetadataType.RAW_JSON:
        case _types.FieldMetadataType.FILES:
            return [
                flatFieldMetadata.name
            ];
        case _types.FieldMetadataType.CURRENCY:
        case _types.FieldMetadataType.PHONES:
        case _types.FieldMetadataType.FULL_NAME:
        case _types.FieldMetadataType.ADDRESS:
        case _types.FieldMetadataType.LINKS:
        case _types.FieldMetadataType.EMAILS:
        case _types.FieldMetadataType.RICH_TEXT:
            return getCompositeEmptinessColumnNames(flatFieldMetadata);
        case _types.FieldMetadataType.ACTOR:
        case _types.FieldMetadataType.BOOLEAN:
        case _types.FieldMetadataType.MORPH_RELATION:
        case _types.FieldMetadataType.POSITION:
        case _types.FieldMetadataType.RELATION:
        case _types.FieldMetadataType.TS_VECTOR:
        case _types.FieldMetadataType.UUID:
            return null;
        default:
            return (0, _utils.assertUnreachable)(flatFieldMetadata.type);
    }
};

//# sourceMappingURL=get-emptiness-column-names-for-field.util.js.map