"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createStandardObjectFlatMetadata", {
    enumerable: true,
    get: function() {
        return createStandardObjectFlatMetadata;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _application = require("twenty-shared/application");
const createStandardObjectFlatMetadata = ({ context: { universalIdentifier, nameSingular, namePlural, labelSingular, labelPlural, description, icon, isSystem = false, isSearchable = false, isAuditLogged = true, isUIEditable = true, isUICreatable = true, openRecordIn = _types.ObjectOpenRecordIn.USER_CHOICE, shortcut = null, duplicateCriteria = null, labelIdentifierFieldMetadataName, imageIdentifierFieldMetadataName }, workspaceId, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, now })=>{
    const labelIdentifierFieldMetadataUniversalIdentifier = // @ts-expect-error ignore
    _metadata.STANDARD_OBJECTS[nameSingular].fields[labelIdentifierFieldMetadataName].universalIdentifier;
    const imageIdentifierFieldMetadataUniversalIdentifier = imageIdentifierFieldMetadataName ? _metadata.STANDARD_OBJECTS[nameSingular].fields[imageIdentifierFieldMetadataName].universalIdentifier : null;
    return {
        universalIdentifier,
        applicationId: twentyStandardApplicationId,
        workspaceId,
        nameSingular,
        namePlural,
        labelSingular,
        labelPlural,
        color: null,
        description,
        icon,
        isRemote: false,
        isActive: true,
        isSystem,
        isSearchable,
        isAuditLogged,
        isUIEditable,
        isUICreatable,
        writability: _types.MetadataWritability.OPEN,
        openRecordIn,
        isLabelSyncedWithName: false,
        overrides: null,
        duplicateCriteria,
        shortcut,
        labelIdentifierFieldMetadataId: standardObjectMetadataRelatedEntityIds[nameSingular].fields[labelIdentifierFieldMetadataName].id,
        imageIdentifierFieldMetadataId: imageIdentifierFieldMetadataName ? standardObjectMetadataRelatedEntityIds[nameSingular].fields[imageIdentifierFieldMetadataName].id : null,
        targetTableName: 'DEPRECATED',
        fieldIds: [],
        indexMetadataIds: [],
        searchFieldMetadataIds: [],
        commandMenuItemIds: [],
        objectPermissionIds: [],
        fieldPermissionIds: [],
        viewIds: [],
        pageLayoutIds: [],
        createdAt: now,
        updatedAt: now,
        id: standardObjectMetadataRelatedEntityIds[nameSingular].id,
        applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        fieldUniversalIdentifiers: [],
        objectPermissionUniversalIdentifiers: [],
        fieldPermissionUniversalIdentifiers: [],
        viewUniversalIdentifiers: [],
        indexMetadataUniversalIdentifiers: [],
        searchFieldMetadataUniversalIdentifiers: [],
        pageLayoutUniversalIdentifiers: [],
        commandMenuItemUniversalIdentifiers: [],
        labelIdentifierFieldMetadataUniversalIdentifier,
        imageIdentifierFieldMetadataUniversalIdentifier
    };
};

//# sourceMappingURL=create-standard-object-flat-metadata.util.js.map