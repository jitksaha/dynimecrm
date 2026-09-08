"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromCreateObjectInputToFlatObjectMetadataAndFlatFieldMetadatasToCreate", {
    enumerable: true,
    get: function() {
        return fromCreateObjectInputToFlatObjectMetadataAndFlatFieldMetadatasToCreate;
    }
});
const _application = require("twenty-shared/application");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _buildnameflatfieldmetadataforcustomobjectutil = require("../../object-metadata/utils/build-name-flat-field-metadata-for-custom-object.util");
const fromCreateObjectInputToFlatObjectMetadataAndFlatFieldMetadatasToCreate = ({ createObjectInput: rawCreateObjectInput, flatApplication })=>{
    const createObjectInput = (0, _utils.trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties)(rawCreateObjectInput, [
        'description',
        'icon',
        'labelPlural',
        'labelSingular',
        'namePlural',
        'nameSingular',
        'shortcut'
    ]);
    const objectMetadataId = (0, _uuid.v4)();
    const universalIdentifier = createObjectInput.universalIdentifier ?? (0, _uuid.v4)();
    const createdAt = new Date().toISOString();
    const labelIdentifierFieldMetadataUniversalIdentifier = (0, _application.getFieldUniversalIdentifier)({
        applicationUniversalIdentifier: flatApplication.universalIdentifier,
        objectUniversalIdentifier: universalIdentifier,
        name: createObjectInput.skipNameField ? 'id' : 'name'
    });
    const universalFlatObjectMetadataToCreate = {
        id: objectMetadataId,
        universalIdentifier,
        createdAt,
        updatedAt: createdAt,
        duplicateCriteria: null,
        color: createObjectInput.color ?? null,
        openRecordIn: _types.ObjectOpenRecordIn.USER_CHOICE,
        description: createObjectInput.description ?? null,
        icon: createObjectInput.icon ?? null,
        isActive: true,
        isAuditLogged: true,
        isLabelSyncedWithName: createObjectInput.isLabelSyncedWithName ?? false,
        isRemote: createObjectInput.isRemote ?? false,
        isSearchable: true,
        isUIEditable: true,
        isUICreatable: true,
        writability: _types.MetadataWritability.OPEN,
        isSystem: false,
        labelPlural: (0, _utils.capitalize)(createObjectInput.labelPlural),
        labelSingular: (0, _utils.capitalize)(createObjectInput.labelSingular),
        namePlural: createObjectInput.namePlural,
        nameSingular: createObjectInput.nameSingular,
        shortcut: createObjectInput.shortcut ?? null,
        overrides: null,
        targetTableName: 'DEPRECATED',
        applicationUniversalIdentifier: flatApplication.universalIdentifier,
        fieldUniversalIdentifiers: [],
        objectPermissionUniversalIdentifiers: [],
        fieldPermissionUniversalIdentifiers: [],
        viewUniversalIdentifiers: [],
        indexMetadataUniversalIdentifiers: [],
        searchFieldMetadataUniversalIdentifiers: [],
        pageLayoutUniversalIdentifiers: [],
        commandMenuItemUniversalIdentifiers: [],
        labelIdentifierFieldMetadataUniversalIdentifier,
        imageIdentifierFieldMetadataUniversalIdentifier: null
    };
    const nameFlatFieldMetadata = createObjectInput.skipNameField === true ? null : (0, _buildnameflatfieldmetadataforcustomobjectutil.buildNameFlatFieldMetadataForCustomObject)({
        flatObjectMetadata: {
            applicationUniversalIdentifier: flatApplication.universalIdentifier,
            universalIdentifier
        }
    });
    const flatFieldMetadataToCreateOnObject = (0, _utils.isDefined)(nameFlatFieldMetadata) ? [
        nameFlatFieldMetadata
    ] : [];
    return {
        flatObjectMetadataToCreate: universalFlatObjectMetadataToCreate,
        flatFieldMetadataToCreateOnObject
    };
};

//# sourceMappingURL=from-create-object-input-to-flat-object-metadata-and-flat-field-metadatas-to-create.util.js.map