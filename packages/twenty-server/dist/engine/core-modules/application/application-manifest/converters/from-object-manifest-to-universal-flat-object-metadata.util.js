"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromObjectManifestToUniversalFlatObjectMetadata", {
    enumerable: true,
    get: function() {
        return fromObjectManifestToUniversalFlatObjectMetadata;
    }
});
const _types = require("twenty-shared/types");
const fromObjectManifestToUniversalFlatObjectMetadata = ({ objectManifest, applicationUniversalIdentifier, now })=>{
    return {
        universalIdentifier: objectManifest.universalIdentifier,
        applicationUniversalIdentifier,
        nameSingular: objectManifest.nameSingular,
        namePlural: objectManifest.namePlural,
        labelSingular: objectManifest.labelSingular,
        labelPlural: objectManifest.labelPlural,
        color: null,
        openRecordIn: objectManifest.openRecordIn ?? _types.ObjectOpenRecordIn.USER_CHOICE,
        description: objectManifest.description ?? null,
        icon: objectManifest.icon ?? null,
        overrides: null,
        targetTableName: 'DEPRECATED',
        isRemote: false,
        isActive: true,
        isSystem: false,
        isUIEditable: objectManifest.isUIEditable ?? true,
        isUICreatable: objectManifest.isUICreatable ?? true,
        writability: objectManifest.writability ?? _types.MetadataWritability.OPEN,
        isAuditLogged: true,
        isSearchable: objectManifest.isSearchable ?? true,
        duplicateCriteria: null,
        shortcut: null,
        isLabelSyncedWithName: false,
        fieldUniversalIdentifiers: [],
        indexMetadataUniversalIdentifiers: [],
        searchFieldMetadataUniversalIdentifiers: [],
        commandMenuItemUniversalIdentifiers: [],
        objectPermissionUniversalIdentifiers: [],
        fieldPermissionUniversalIdentifiers: [],
        viewUniversalIdentifiers: [],
        pageLayoutUniversalIdentifiers: [],
        labelIdentifierFieldMetadataUniversalIdentifier: objectManifest.labelIdentifierFieldMetadataUniversalIdentifier,
        imageIdentifierFieldMetadataUniversalIdentifier: null,
        createdAt: now,
        updatedAt: now
    };
};

//# sourceMappingURL=from-object-manifest-to-universal-flat-object-metadata.util.js.map