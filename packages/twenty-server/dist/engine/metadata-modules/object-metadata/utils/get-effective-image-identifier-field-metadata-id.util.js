"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getEffectiveImageIdentifierFieldMetadataId", {
    enumerable: true,
    get: function() {
        return getEffectiveImageIdentifierFieldMetadataId;
    }
});
const _utils = require("twenty-shared/utils");
const getEffectiveImageIdentifierFieldMetadataId = (objectMetadata)=>{
    const { overrides } = objectMetadata;
    if ((0, _utils.isDefined)(overrides) && 'imageIdentifierFieldMetadataId' in overrides) {
        return overrides.imageIdentifierFieldMetadataId ?? null;
    }
    return objectMetadata.imageIdentifierFieldMetadataId ?? null;
};

//# sourceMappingURL=get-effective-image-identifier-field-metadata-id.util.js.map