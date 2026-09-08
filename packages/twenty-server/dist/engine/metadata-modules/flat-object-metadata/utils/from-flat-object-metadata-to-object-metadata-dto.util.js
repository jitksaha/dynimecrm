"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFlatObjectMetadataToObjectMetadataDto", {
    enumerable: true,
    get: function() {
        return fromFlatObjectMetadataToObjectMetadataDto;
    }
});
const fromFlatObjectMetadataToObjectMetadataDto = (flatObjectMetadata)=>{
    const { createdAt, updatedAt, color, description, icon, overrides, shortcut, duplicateCriteria, id, universalIdentifier, isActive, isLabelSyncedWithName, isRemote, isSearchable, openRecordIn, isSystem, isUIEditable, isUICreatable, labelPlural, labelSingular, namePlural, nameSingular, workspaceId, imageIdentifierFieldMetadataId, labelIdentifierFieldMetadataId, applicationId } = flatObjectMetadata;
    return {
        id,
        universalIdentifier,
        isActive,
        isLabelSyncedWithName,
        isRemote,
        isSearchable,
        openRecordIn,
        isSystem,
        isUIEditable,
        isUICreatable,
        isUIReadOnly: !isUIEditable,
        labelPlural,
        labelSingular,
        namePlural,
        nameSingular,
        workspaceId,
        imageIdentifierFieldMetadataId,
        labelIdentifierFieldMetadataId,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        color: color ?? undefined,
        description: description ?? undefined,
        icon: icon ?? undefined,
        overrides: overrides ?? undefined,
        shortcut: shortcut ?? undefined,
        duplicateCriteria: duplicateCriteria ?? undefined,
        applicationId
    };
};

//# sourceMappingURL=from-flat-object-metadata-to-object-metadata-dto.util.js.map