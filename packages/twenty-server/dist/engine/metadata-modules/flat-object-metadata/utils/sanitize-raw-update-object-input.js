"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizeRawUpdateObjectInput", {
    enumerable: true,
    get: function() {
        return sanitizeRawUpdateObjectInput;
    }
});
const _utils = require("twenty-shared/utils");
const _alloverridablepropertiesbymetadatanameconstant = require("../../flat-entity/constant/all-overridable-properties-by-metadata-name.constant");
const _flatobjectmetadataeditablepropertiesconstant = require("../constants/flat-object-metadata-editable-properties.constant");
const _objectmetadataexception = require("../../object-metadata/object-metadata.exception");
const _belongstotwentystandardapputil = require("../../utils/belongs-to-twenty-standard-app.util");
const _computemetadataoverridesblobutil = require("../../utils/compute-metadata-overrides-blob.util");
const _findinvalidtranslationoverridepropertiesutil = require("../../utils/find-invalid-translation-override-properties.util");
const _mergetranslationsintooverridesutil = require("../../utils/merge-translations-into-overrides.util");
const sanitizeRawUpdateObjectInput = ({ existingFlatObjectMetadata, rawUpdateObjectInput })=>{
    const isStandardObject = (0, _belongstotwentystandardapputil.belongsToTwentyStandardApp)(existingFlatObjectMetadata);
    const updatedEditableObjectProperties = (0, _utils.extractAndSanitizeObjectStringFields)(rawUpdateObjectInput.update, [
        ...new Set([
            ..._flatobjectmetadataeditablepropertiesconstant.FLAT_OBJECT_METADATA_EDITABLE_PROPERTIES.standard,
            ..._flatobjectmetadataeditablepropertiesconstant.FLAT_OBJECT_METADATA_EDITABLE_PROPERTIES.custom
        ])
    ]);
    const translationEntries = rawUpdateObjectInput.update.translations ?? [];
    const invalidTranslationProperties = (0, _findinvalidtranslationoverridepropertiesutil.findInvalidTranslationOverrideProperties)(translationEntries, 'objectMetadata');
    if (invalidTranslationProperties.length > 0) {
        throw new _objectmetadataexception.ObjectMetadataException(`Cannot translate object metadata properties: ${invalidTranslationProperties.join(', ')}`, _objectmetadataexception.ObjectMetadataExceptionCode.INVALID_OBJECT_INPUT);
    }
    if (!isStandardObject) {
        return {
            updatedEditableObjectProperties,
            overrides: (0, _mergetranslationsintooverridesutil.mergeTranslationsIntoOverrides)({
                existingOverrides: existingFlatObjectMetadata.overrides,
                translationEntries
            })
        };
    }
    const invalidUpdatedProperties = Object.keys(updatedEditableObjectProperties).filter((property)=>!_flatobjectmetadataeditablepropertiesconstant.FLAT_OBJECT_METADATA_EDITABLE_PROPERTIES.standard.includes(property));
    if (invalidUpdatedProperties.length > 0) {
        throw new _objectmetadataexception.ObjectMetadataException(`Cannot edit standard object metadata properties: ${invalidUpdatedProperties.join(', ')}`, _objectmetadataexception.ObjectMetadataExceptionCode.INVALID_OBJECT_INPUT);
    }
    const { overrides, remainingProperties } = (0, _computemetadataoverridesblobutil.computeMetadataOverridesBlob)({
        overridableProperties: _alloverridablepropertiesbymetadatanameconstant.ALL_OVERRIDABLE_PROPERTIES_BY_METADATA_NAME.objectMetadata,
        updatedProperties: updatedEditableObjectProperties,
        existingEntity: existingFlatObjectMetadata,
        existingOverrides: existingFlatObjectMetadata.overrides
    });
    return {
        overrides: (0, _mergetranslationsintooverridesutil.mergeTranslationsIntoOverrides)({
            existingOverrides: overrides,
            translationEntries
        }),
        updatedEditableObjectProperties: remainingProperties
    };
};

//# sourceMappingURL=sanitize-raw-update-object-input.js.map