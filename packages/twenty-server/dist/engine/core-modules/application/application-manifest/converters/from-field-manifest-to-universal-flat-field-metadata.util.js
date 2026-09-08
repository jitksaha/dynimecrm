"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFieldManifestToUniversalFlatFieldMetadata", {
    enumerable: true,
    get: function() {
        return fromFieldManifestToUniversalFlatFieldMetadata;
    }
});
const _types = require("twenty-shared/types");
const _applicationexception = require("../../application.exception");
const _generatedefaultvalue = require("../../../../metadata-modules/field-metadata/utils/generate-default-value");
const _iscompositefieldmetadatatypeutil = require("../../../../metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util");
const _nullifyemptycompositedefaultvalueutil = require("../../../../metadata-modules/flat-field-metadata/utils/nullify-empty-composite-default-value.util");
const _ismorphorrelationfieldmetadatatypeutil = require("../../../../utils/is-morph-or-relation-field-metadata-type.util");
const isRelationFieldManifest = (fieldManifest)=>(0, _ismorphorrelationfieldmetadatatypeutil.isMorphOrRelationFieldMetadataType)(fieldManifest.type);
const getRelationTargetUniversalIdentifiers = (fieldManifest)=>{
    if (!isRelationFieldManifest(fieldManifest)) {
        return {
            relationTargetFieldMetadataUniversalIdentifier: null,
            relationTargetObjectMetadataUniversalIdentifier: null
        };
    }
    if (!fieldManifest.relationTargetFieldMetadataUniversalIdentifier || !fieldManifest.relationTargetObjectMetadataUniversalIdentifier) {
        throw new _applicationexception.ApplicationException(`Field "${fieldManifest.name}" is of type ${fieldManifest.type} but is missing relationTargetFieldMetadataUniversalIdentifier or relationTargetObjectMetadataUniversalIdentifier`, _applicationexception.ApplicationExceptionCode.INVALID_INPUT);
    }
    return {
        relationTargetFieldMetadataUniversalIdentifier: fieldManifest.relationTargetFieldMetadataUniversalIdentifier,
        relationTargetObjectMetadataUniversalIdentifier: fieldManifest.relationTargetObjectMetadataUniversalIdentifier
    };
};
const fromFieldManifestToUniversalFlatFieldMetadata = ({ fieldManifest, applicationUniversalIdentifier, now })=>{
    const { relationTargetFieldMetadataUniversalIdentifier, relationTargetObjectMetadataUniversalIdentifier } = getRelationTargetUniversalIdentifiers(fieldManifest);
    const rawDefaultValue = fieldManifest.defaultValue ?? (0, _generatedefaultvalue.generateDefaultValue)(fieldManifest.type);
    const defaultValue = (0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(fieldManifest.type) ? (0, _nullifyemptycompositedefaultvalueutil.nullifyEmptyCompositeDefaultValue)({
        defaultValue: rawDefaultValue,
        fieldType: fieldManifest.type
    }) : rawDefaultValue;
    return {
        universalIdentifier: fieldManifest.universalIdentifier,
        applicationUniversalIdentifier,
        type: fieldManifest.type,
        name: fieldManifest.name,
        label: fieldManifest.label,
        description: fieldManifest.description ?? null,
        icon: fieldManifest.icon ?? null,
        overrides: null,
        options: fieldManifest.options ?? null,
        defaultValue,
        universalSettings: fieldManifest.universalSettings ?? null,
        isActive: true,
        isSystem: false,
        isSystemSideEffect: false,
        isUIEditable: fieldManifest.isUIEditable ?? true,
        writability: fieldManifest.writability ?? _types.MetadataWritability.OPEN,
        isNullable: fieldManifest.isNullable ?? true,
        isUnique: fieldManifest.isUnique ?? false,
        isLabelSyncedWithName: false,
        morphId: fieldManifest.type === _types.FieldMetadataType.MORPH_RELATION ? fieldManifest.morphId ?? null : null,
        objectMetadataUniversalIdentifier: fieldManifest.objectUniversalIdentifier,
        relationTargetFieldMetadataUniversalIdentifier,
        relationTargetObjectMetadataUniversalIdentifier,
        viewFieldUniversalIdentifiers: [],
        viewFilterUniversalIdentifiers: [],
        fieldPermissionUniversalIdentifiers: [],
        kanbanAggregateOperationViewUniversalIdentifiers: [],
        calendarViewUniversalIdentifiers: [],
        calendarEndViewUniversalIdentifiers: [],
        mainGroupByFieldMetadataViewUniversalIdentifiers: [],
        viewSortUniversalIdentifiers: [],
        searchFieldMetadataUniversalIdentifiers: [],
        createdAt: now,
        updatedAt: now
    };
};

//# sourceMappingURL=from-field-manifest-to-universal-flat-field-metadata.util.js.map