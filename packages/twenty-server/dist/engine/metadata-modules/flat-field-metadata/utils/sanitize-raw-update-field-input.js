"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizeRawUpdateFieldInput", {
    enumerable: true,
    get: function() {
        return sanitizeRawUpdateFieldInput;
    }
});
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _fieldmetadataexception = require("../../field-metadata/field-metadata.exception");
const _iscompositefieldmetadatatypeutil = require("../../field-metadata/utils/is-composite-field-metadata-type.util");
const _alloverridablepropertiesbymetadatanameconstant = require("../../flat-entity/constant/all-overridable-properties-by-metadata-name.constant");
const _flatfieldmetadataeditablepropertiesconstant = require("../constants/flat-field-metadata-editable-properties.constant");
const _nullifyemptycompositedefaultvalueutil = require("./nullify-empty-composite-default-value.util");
const _belongstotwentystandardapputil = require("../../utils/belongs-to-twenty-standard-app.util");
const _computemetadataoverridesblobutil = require("../../utils/compute-metadata-overrides-blob.util");
const _findinvalidtranslationoverridepropertiesutil = require("../../utils/find-invalid-translation-override-properties.util");
const _mergetranslationsintooverridesutil = require("../../utils/merge-translations-into-overrides.util");
const sanitizeRawUpdateFieldInput = ({ existingFlatFieldMetadata, rawUpdateFieldInput, isSystemBuild })=>{
    const isStandardField = (0, _belongstotwentystandardapputil.belongsToTwentyStandardApp)(existingFlatFieldMetadata);
    const updatedEditableFieldProperties = (0, _utils.extractAndSanitizeObjectStringFields)(rawUpdateFieldInput, [
        ...new Set([
            ..._flatfieldmetadataeditablepropertiesconstant.FLAT_FIELD_METADATA_EDITABLE_PROPERTIES.standard,
            ..._flatfieldmetadataeditablepropertiesconstant.FLAT_FIELD_METADATA_EDITABLE_PROPERTIES.custom
        ])
    ]);
    if (existingFlatFieldMetadata.isSystemSideEffect === true && !isSystemBuild) {
        const forbiddenUpdatedProperties = [
            ...Object.keys(updatedEditableFieldProperties),
            ...(0, _utils.isDefined)(rawUpdateFieldInput.morphRelationsUpdatePayload) ? [
                'morphRelationsUpdatePayload'
            ] : []
        ].filter((property)=>!_flatfieldmetadataeditablepropertiesconstant.FLAT_FIELD_METADATA_SYSTEM_SIDE_EFFECT_EDITABLE_PROPERTIES.includes(property));
        if (forbiddenUpdatedProperties.length > 0) {
            throw new _fieldmetadataexception.FieldMetadataException(`Cannot edit system-managed field "${existingFlatFieldMetadata.name}" properties: ${forbiddenUpdatedProperties.join(', ')}`, _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_MUTATION_NOT_ALLOWED);
        }
    }
    updatedEditableFieldProperties.options = !(0, _utils.isDefined)(updatedEditableFieldProperties.options) ? updatedEditableFieldProperties.options : updatedEditableFieldProperties.options.map((option)=>({
            id: (0, _uuid.v4)(),
            ...option
        }));
    if (updatedEditableFieldProperties.defaultValue !== undefined && (0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(existingFlatFieldMetadata.type)) {
        updatedEditableFieldProperties.defaultValue = (0, _nullifyemptycompositedefaultvalueutil.nullifyEmptyCompositeDefaultValue)({
            defaultValue: updatedEditableFieldProperties.defaultValue,
            fieldType: existingFlatFieldMetadata.type
        });
    }
    const translationEntries = rawUpdateFieldInput.translations ?? [];
    const invalidTranslationProperties = (0, _findinvalidtranslationoverridepropertiesutil.findInvalidTranslationOverrideProperties)(translationEntries, 'fieldMetadata');
    if (invalidTranslationProperties.length > 0) {
        throw new _fieldmetadataexception.FieldMetadataException(`Cannot translate field metadata properties: ${invalidTranslationProperties.join(', ')}`, _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_MUTATION_NOT_ALLOWED);
    }
    if (!isStandardField || isSystemBuild) {
        return {
            updatedEditableFieldProperties,
            overrides: (0, _mergetranslationsintooverridesutil.mergeTranslationsIntoOverrides)({
                existingOverrides: existingFlatFieldMetadata.overrides,
                translationEntries
            })
        };
    }
    const invalidUpdatedProperties = Object.keys(updatedEditableFieldProperties).filter((property)=>!_flatfieldmetadataeditablepropertiesconstant.FLAT_FIELD_METADATA_EDITABLE_PROPERTIES.standard.includes(property));
    if (invalidUpdatedProperties.length > 0) {
        throw new _fieldmetadataexception.FieldMetadataException(`Cannot edit standard field metadata properties: ${invalidUpdatedProperties.join(', ')}`, _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_MUTATION_NOT_ALLOWED);
    }
    const { overrides, remainingProperties } = (0, _computemetadataoverridesblobutil.computeMetadataOverridesBlob)({
        overridableProperties: _alloverridablepropertiesbymetadatanameconstant.ALL_OVERRIDABLE_PROPERTIES_BY_METADATA_NAME.fieldMetadata,
        updatedProperties: updatedEditableFieldProperties,
        existingEntity: existingFlatFieldMetadata,
        existingOverrides: existingFlatFieldMetadata.overrides
    });
    return {
        overrides: (0, _mergetranslationsintooverridesutil.mergeTranslationsIntoOverrides)({
            existingOverrides: overrides,
            translationEntries
        }),
        updatedEditableFieldProperties: remainingProperties
    };
};

//# sourceMappingURL=sanitize-raw-update-field-input.js.map