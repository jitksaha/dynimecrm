"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "compactFlatFieldMetadataMaps", {
    enumerable: true,
    get: function() {
        return compactFlatFieldMetadataMaps;
    }
});
const _utils = require("twenty-shared/utils");
const _flatfieldmetadatacachecodecconstant = require("../constants/flat-field-metadata-cache-codec.constant");
const compactFlatFieldMetadata = (flatFieldMetadata)=>{
    const compacted = {};
    for (const [key, value] of Object.entries(flatFieldMetadata)){
        if (_flatfieldmetadatacachecodecconstant.FLAT_FIELD_METADATA_EMPTY_ARRAY_KEY_SET.has(key) && Array.isArray(value) && value.length === 0) {
            continue;
        }
        compacted[_flatfieldmetadatacachecodecconstant.FLAT_FIELD_METADATA_SHORT_CODE_LOOKUP.get(key) ?? key] = value;
    }
    return compacted;
};
const compactFlatFieldMetadataMaps = (flatEntityMaps)=>{
    const byUniversalIdentifier = {};
    for (const [universalIdentifier, flatFieldMetadata] of Object.entries(flatEntityMaps.byUniversalIdentifier)){
        if (!(0, _utils.isDefined)(flatFieldMetadata)) {
            continue;
        }
        byUniversalIdentifier[universalIdentifier] = compactFlatFieldMetadata(flatFieldMetadata);
    }
    return {
        byUniversalIdentifier,
        universalIdentifierById: flatEntityMaps.universalIdentifierById,
        universalIdentifiersByApplicationId: flatEntityMaps.universalIdentifiersByApplicationId
    };
};

//# sourceMappingURL=compact-flat-field-metadata-maps.util.js.map