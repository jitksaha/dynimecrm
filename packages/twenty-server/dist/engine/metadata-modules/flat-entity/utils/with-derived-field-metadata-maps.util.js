"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "withDerivedFieldMetadataMaps", {
    enumerable: true,
    get: function() {
        return withDerivedFieldMetadataMaps;
    }
});
const withDerivedFieldMetadataMaps = (keys)=>keys.includes('flatFieldMetadataMaps') ? [
        ...keys,
        'flatFieldMetadataMapsOrm'
    ] : keys;

//# sourceMappingURL=with-derived-field-metadata-maps.util.js.map