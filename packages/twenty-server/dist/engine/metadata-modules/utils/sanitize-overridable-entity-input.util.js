"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizeOverridableEntityInput", {
    enumerable: true,
    get: function() {
        return sanitizeOverridableEntityInput;
    }
});
const _alloverridablepropertiesbymetadatanameconstant = require("../flat-entity/constant/all-overridable-properties-by-metadata-name.constant");
const _computemetadataoverridesblobutil = require("./compute-metadata-overrides-blob.util");
const sanitizeOverridableEntityInput = ({ metadataName, existingFlatEntity, updatedEditableProperties, shouldOverride })=>{
    if (!shouldOverride) {
        return {
            overrides: existingFlatEntity.overrides,
            updatedEditableProperties
        };
    }
    const { overrides, remainingProperties } = (0, _computemetadataoverridesblobutil.computeMetadataOverridesBlob)({
        overridableProperties: _alloverridablepropertiesbymetadatanameconstant.ALL_OVERRIDABLE_PROPERTIES_BY_METADATA_NAME[metadataName],
        updatedProperties: updatedEditableProperties,
        existingEntity: existingFlatEntity,
        existingOverrides: existingFlatEntity.overrides
    });
    return {
        overrides,
        updatedEditableProperties: remainingProperties
    };
};

//# sourceMappingURL=sanitize-overridable-entity-input.util.js.map