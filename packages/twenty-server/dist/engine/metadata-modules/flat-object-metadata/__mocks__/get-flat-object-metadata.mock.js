"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getFlatObjectMetadataMock () {
        return getFlatObjectMetadataMock;
    },
    get getStandardFlatObjectMetadataMock () {
        return getStandardFlatObjectMetadataMock;
    }
});
const _types = require("twenty-shared/types");
const _faker = require("@faker-js/faker");
const _application = require("twenty-shared/application");
const getFlatObjectMetadataMock = (overrides)=>{
    const createdAt = '2024-01-01T00:00:00.000Z';
    const applicationId = overrides.applicationId ?? _faker.faker.string.uuid();
    const labelIdentifierFieldMetadataId = overrides.labelIdentifierFieldMetadataId ?? _faker.faker.string.uuid();
    const imageIdentifierFieldMetadataId = overrides.imageIdentifierFieldMetadataId ?? _faker.faker.string.uuid();
    return {
        viewIds: [],
        indexMetadataIds: [],
        searchFieldMetadataIds: [],
        objectPermissionIds: [],
        fieldPermissionIds: [],
        fieldIds: [],
        pageLayoutIds: [],
        commandMenuItemIds: [],
        description: 'default flat object metadata description',
        icon: 'icon',
        writability: _types.MetadataWritability.OPEN,
        color: null,
        id: _faker.faker.string.uuid(),
        imageIdentifierFieldMetadataId,
        isActive: true,
        isAuditLogged: true,
        isLabelSyncedWithName: false,
        isRemote: false,
        isSearchable: true,
        isSystem: false,
        isUIEditable: true,
        isUICreatable: true,
        openRecordIn: _types.ObjectOpenRecordIn.USER_CHOICE,
        labelIdentifierFieldMetadataId,
        labelPlural: 'default flat object metadata label plural',
        labelSingular: 'default flat object metadata label singular',
        namePlural: 'defaultflatObjectMetadataNamePlural',
        nameSingular: 'defaultflatObjectMetadataNameSingular',
        shortcut: 'shortcut',
        applicationId,
        overrides: null,
        targetTableName: '',
        workspaceId: _faker.faker.string.uuid(),
        createdAt,
        updatedAt: createdAt,
        duplicateCriteria: null,
        applicationUniversalIdentifier: applicationId,
        fieldUniversalIdentifiers: [],
        objectPermissionUniversalIdentifiers: [],
        fieldPermissionUniversalIdentifiers: [],
        viewUniversalIdentifiers: [],
        indexMetadataUniversalIdentifiers: [],
        searchFieldMetadataUniversalIdentifiers: [],
        pageLayoutUniversalIdentifiers: [],
        commandMenuItemUniversalIdentifiers: [],
        labelIdentifierFieldMetadataUniversalIdentifier: labelIdentifierFieldMetadataId,
        imageIdentifierFieldMetadataUniversalIdentifier: imageIdentifierFieldMetadataId,
        ...overrides
    };
};
const getStandardFlatObjectMetadataMock = (overrides)=>{
    return getFlatObjectMetadataMock({
        overrides: {},
        isSystem: true,
        applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        ...overrides
    });
};

//# sourceMappingURL=get-flat-object-metadata.mock.js.map