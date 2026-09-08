"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getgroupablesubfieldsforcompositetypeutil = require("../get-groupable-sub-fields-for-composite-type.util");
const _iscompositepropertysupportedingroupbyutil = require("../is-composite-property-supported-in-group-by.util");
const buildCompositeProperty = (type, hidden = false)=>({
        name: 'subField',
        type,
        hidden,
        isRequired: false
    });
describe('isCompositePropertySupportedInGroupBy', ()=>{
    it('returns false for hidden or raw_json composite properties', ()=>{
        expect((0, _iscompositepropertysupportedingroupbyutil.isCompositePropertySupportedInGroupBy)(buildCompositeProperty(_types.FieldMetadataType.TEXT, true))).toBe(false);
        expect((0, _iscompositepropertysupportedingroupbyutil.isCompositePropertySupportedInGroupBy)(buildCompositeProperty(_types.FieldMetadataType.RAW_JSON))).toBe(false);
    });
    it('returns true for visible non-raw_json composite properties', ()=>{
        expect((0, _iscompositepropertysupportedingroupbyutil.isCompositePropertySupportedInGroupBy)(buildCompositeProperty(_types.FieldMetadataType.TEXT))).toBe(true);
    });
});
describe('getGroupableSubFieldsForCompositeType', ()=>{
    it('returns null for non-composite field types', ()=>{
        expect((0, _getgroupablesubfieldsforcompositetypeutil.getGroupableSubFieldsForCompositeType)(_types.FieldMetadataType.TEXT)).toBe(null);
    });
    it('returns supported subfields for composite field types', ()=>{
        expect((0, _getgroupablesubfieldsforcompositetypeutil.getGroupableSubFieldsForCompositeType)(_types.FieldMetadataType.CURRENCY)).toEqual(expect.arrayContaining([
            'amountMicros',
            'currencyCode'
        ]));
    });
});

//# sourceMappingURL=is-supported-in-group-by.spec.js.map