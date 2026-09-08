"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isFlatFieldMetadataDisplayableInDefaultView", {
    enumerable: true,
    get: function() {
        return isFlatFieldMetadataDisplayableInDefaultView;
    }
});
const _types = require("twenty-shared/types");
const isFlatFieldMetadataDisplayableInDefaultView = ({ flatFieldMetadata, labelIdentifierFieldMetadataUniversalIdentifier })=>flatFieldMetadata.name !== 'deletedAt' && flatFieldMetadata.type !== _types.FieldMetadataType.TS_VECTOR && flatFieldMetadata.type !== _types.FieldMetadataType.POSITION && flatFieldMetadata.type !== _types.FieldMetadataType.MORPH_RELATION && flatFieldMetadata.type !== _types.FieldMetadataType.RELATION && (flatFieldMetadata.name !== 'id' || flatFieldMetadata.universalIdentifier === labelIdentifierFieldMetadataUniversalIdentifier);

//# sourceMappingURL=is-flat-field-metadata-displayable-in-default-view.util.js.map