"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFlatFieldMetadataToFieldMetadataDto", {
    enumerable: true,
    get: function() {
        return fromFlatFieldMetadataToFieldMetadataDto;
    }
});
const fromFlatFieldMetadataToFieldMetadataDto = (flatFieldMetadata)=>{
    const { createdAt, updatedAt, description, icon, overrides, isNullable, isUnique, settings, id, universalIdentifier, label, name, objectMetadataId, type, workspaceId, defaultValue, isActive, isLabelSyncedWithName, isSystem, isUIEditable, options, morphId, applicationId } = flatFieldMetadata;
    return {
        id,
        universalIdentifier,
        label,
        name,
        objectMetadataId,
        type,
        workspaceId,
        defaultValue,
        isActive,
        isLabelSyncedWithName,
        isSystem,
        isUIEditable,
        isUIReadOnly: !isUIEditable,
        options,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        description: description ?? undefined,
        icon: icon ?? undefined,
        overrides: overrides ?? undefined,
        isNullable: isNullable ?? false,
        isUnique: isUnique ?? false,
        settings: settings ?? undefined,
        morphId: morphId ?? undefined,
        applicationId: applicationId ?? undefined
    };
};

//# sourceMappingURL=from-flat-field-metadata-to-field-metadata-dto.util.js.map