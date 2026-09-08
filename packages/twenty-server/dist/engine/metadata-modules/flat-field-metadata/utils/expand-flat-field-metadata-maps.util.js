"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "expandFlatFieldMetadataMaps", {
    enumerable: true,
    get: function() {
        return expandFlatFieldMetadataMaps;
    }
});
const _flatfieldmetadatacachecodecconstant = require("../constants/flat-field-metadata-cache-codec.constant");
const expandFlatFieldMetadata = (compacted)=>{
    const expanded = {};
    for (const [shortCode, value] of Object.entries(compacted)){
        expanded[_flatfieldmetadatacachecodecconstant.FLAT_FIELD_METADATA_KEY_LOOKUP.get(shortCode) ?? shortCode] = value;
    }
    for (const key of _flatfieldmetadatacachecodecconstant.FLAT_FIELD_METADATA_EMPTY_ARRAY_KEYS){
        if (!(key in expanded)) {
            expanded[key] = [];
        }
    }
    return expanded;
};
const expandFlatFieldMetadataMaps = (compacted)=>{
    const byUniversalIdentifier = {};
    for (const [universalIdentifier, compactFlatFieldMetadata] of Object.entries(compacted.byUniversalIdentifier)){
        byUniversalIdentifier[universalIdentifier] = expandFlatFieldMetadata(compactFlatFieldMetadata);
    }
    return {
        byUniversalIdentifier,
        universalIdentifierById: compacted.universalIdentifierById,
        universalIdentifiersByApplicationId: compacted.universalIdentifiersByApplicationId
    };
};

//# sourceMappingURL=expand-flat-field-metadata-maps.util.js.map