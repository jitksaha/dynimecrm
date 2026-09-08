"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PERSON_FLAT_OBJECT_MOCK", {
    enumerable: true,
    get: function() {
        return PERSON_FLAT_OBJECT_MOCK;
    }
});
const _application = require("twenty-shared/application");
const _getflatobjectmetadatamock = require("./get-flat-object-metadata.mock");
const PERSON_FLAT_OBJECT_MOCK = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
    id: '843e0b67-9619-4628-91c4-2fa62256a611',
    nameSingular: 'person',
    applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
    namePlural: 'people',
    labelSingular: 'Person',
    labelPlural: 'People',
    description: 'A person',
    icon: 'IconUser',
    overrides: null,
    targetTableName: 'DEPRECATED',
    isRemote: false,
    isActive: true,
    isSystem: false,
    isAuditLogged: true,
    isSearchable: true,
    shortcut: 'P',
    labelIdentifierFieldMetadataId: 'f410c1cd-2523-4802-be8e-1acc852b4b1a',
    imageIdentifierFieldMetadataId: '05e46775-93e9-46c4-8b6f-94829045b1ad',
    isLabelSyncedWithName: false,
    workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
    universalIdentifier: '20202020-e674-48e5-a542-72570eee7213'
});

//# sourceMappingURL=person-flat-object.mock.js.map