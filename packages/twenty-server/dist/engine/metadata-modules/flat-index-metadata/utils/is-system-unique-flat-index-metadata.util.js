"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isSystemUniqueFlatIndexMetadata", {
    enumerable: true,
    get: function() {
        return isSystemUniqueFlatIndexMetadata;
    }
});
const isSystemUniqueFlatIndexMetadata = (flatIndexMetadata)=>flatIndexMetadata.isSystemSideEffect === true && flatIndexMetadata.isUnique === true;

//# sourceMappingURL=is-system-unique-flat-index-metadata.util.js.map