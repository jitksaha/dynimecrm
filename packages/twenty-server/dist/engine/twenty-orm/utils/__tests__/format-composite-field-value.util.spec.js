"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getflatfieldmetadatamock = require("../../../metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _formatcompositefieldvalueutil = require("../format-composite-field-value.util");
describe('formatCompositeFieldValue', ()=>{
    const addressFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: 'address',
        objectMetadataId: 'object-metadata-id',
        type: _types.FieldMetadataType.ADDRESS
    });
    const currencyFieldMetadata = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: 'amount',
        objectMetadataId: 'object-metadata-id',
        type: _types.FieldMetadataType.CURRENCY
    });
    it('should parse addressLat/addressLng returned as strings into numbers', ()=>{
        expect((0, _formatcompositefieldvalueutil.formatCompositeFieldValue)('40.7532256', 'addressLat', addressFieldMetadata)).toBe(40.7532256);
        expect((0, _formatcompositefieldvalueutil.formatCompositeFieldValue)('-73.99294600000002', 'addressLng', addressFieldMetadata)).toBe(-73.99294600000002);
    });
    it('should keep coordinates that are already numbers unchanged', ()=>{
        expect((0, _formatcompositefieldvalueutil.formatCompositeFieldValue)(40.7532256, 'addressLat', addressFieldMetadata)).toBe(40.7532256);
    });
    it('should not coerce text address subfields that look numeric', ()=>{
        expect((0, _formatcompositefieldvalueutil.formatCompositeFieldValue)('10001', 'addressPostcode', addressFieldMetadata)).toBe('10001');
    });
    it('should still parse currency amountMicros returned as a string', ()=>{
        expect((0, _formatcompositefieldvalueutil.formatCompositeFieldValue)('5000000', 'amountMicros', currencyFieldMetadata)).toBe(5000000);
    });
});

//# sourceMappingURL=format-composite-field-value.util.spec.js.map