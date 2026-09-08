"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get NullCheckEnum () {
        return _sharedfilterdefszodschema.NullCheckEnum;
    },
    get generateFieldFilterZodSchema () {
        return generateFieldFilterZodSchema;
    }
});
const _types = require("twenty-shared/types");
const _zod = require("zod");
const _relationtypeinterface = require("../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _sharedfilterdefszodschema = require("./shared-filter-defs.zod-schema");
const _isfieldmetadataoftypeutil = require("../../../utils/is-field-metadata-of-type.util");
const generateFieldFilterZodSchema = (field)=>{
    switch(field.type){
        case _types.FieldMetadataType.UUID:
            return _sharedfilterdefszodschema.UuidFilterSchema;
        case _types.FieldMetadataType.TEXT:
            return _sharedfilterdefszodschema.TextFilterSchema;
        case _types.FieldMetadataType.RICH_TEXT:
            return _sharedfilterdefszodschema.RichTextFilterSchema;
        case _types.FieldMetadataType.NUMBER:
        case _types.FieldMetadataType.NUMERIC:
        case _types.FieldMetadataType.POSITION:
            return _sharedfilterdefszodschema.NumberFilterSchema;
        case _types.FieldMetadataType.BOOLEAN:
            return _sharedfilterdefszodschema.BooleanFilterSchema;
        case _types.FieldMetadataType.DATE_TIME:
        case _types.FieldMetadataType.DATE:
            return _sharedfilterdefszodschema.DateFilterSchema;
        case _types.FieldMetadataType.SELECT:
            {
                const enumValues = field.options?.map((option)=>option.value) || [];
                if (enumValues.length === 0) {
                    return null;
                }
                const selectEnum = _zod.z.enum(enumValues);
                return _zod.z.object({
                    eq: selectEnum.optional().describe('Equals'),
                    neq: selectEnum.optional().describe('Not equals'),
                    in: _zod.z.array(selectEnum).optional().describe('In array of values'),
                    is: _sharedfilterdefszodschema.NullCheckEnum.optional()
                }).optional();
            }
        case _types.FieldMetadataType.MULTI_SELECT:
            {
                const enumValues = field.options?.map((option)=>option.value) || [];
                if (enumValues.length === 0) {
                    return null;
                }
                const multiSelectEnum = _zod.z.enum(enumValues);
                return _zod.z.object({
                    in: _zod.z.array(multiSelectEnum).optional().describe('Contains any of these values'),
                    is: _sharedfilterdefszodschema.NullCheckEnum.optional(),
                    isEmptyArray: _zod.z.boolean().optional().describe('Is empty array')
                }).optional();
            }
        case _types.FieldMetadataType.RATING:
            {
                const enumValues = field.options?.map((option)=>option.value) || [];
                if (enumValues.length === 0) {
                    return null;
                }
                const ratingEnum = _zod.z.enum(enumValues);
                return _zod.z.object({
                    eq: ratingEnum.optional().describe('Equals'),
                    in: _zod.z.array(ratingEnum).optional().describe('In array of values'),
                    is: _sharedfilterdefszodschema.NullCheckEnum.optional()
                }).optional();
            }
        case _types.FieldMetadataType.ARRAY:
            return _sharedfilterdefszodschema.ArrayFieldFilterSchema;
        case _types.FieldMetadataType.CURRENCY:
            return _sharedfilterdefszodschema.CurrencyFilterSchema;
        case _types.FieldMetadataType.FULL_NAME:
            return _sharedfilterdefszodschema.FullNameFilterSchema;
        case _types.FieldMetadataType.ADDRESS:
            return _sharedfilterdefszodschema.AddressFilterSchema;
        case _types.FieldMetadataType.EMAILS:
            return _sharedfilterdefszodschema.EmailsFilterSchema;
        case _types.FieldMetadataType.PHONES:
            return _sharedfilterdefszodschema.PhonesFilterSchema;
        case _types.FieldMetadataType.LINKS:
            return _sharedfilterdefszodschema.LinksFilterSchema;
        case _types.FieldMetadataType.MORPH_RELATION:
        case _types.FieldMetadataType.RELATION:
            if (((0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(field, _types.FieldMetadataType.RELATION) || (0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(field, _types.FieldMetadataType.MORPH_RELATION)) && field.settings?.relationType === _relationtypeinterface.RelationType.MANY_TO_ONE) {
                return _sharedfilterdefszodschema.UuidFilterSchema;
            }
            return null;
        case _types.FieldMetadataType.RAW_JSON:
        case _types.FieldMetadataType.FILES:
            return _sharedfilterdefszodschema.DefaultFilterSchema;
        default:
            return _sharedfilterdefszodschema.DefaultFilterSchema;
    }
};

//# sourceMappingURL=field-filters.zod-schema.js.map