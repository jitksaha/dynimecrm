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
    get getFlatFieldMetadataMock () {
        return getFlatFieldMetadataMock;
    },
    get getStandardFlatFieldMetadataMock () {
        return getStandardFlatFieldMetadataMock;
    }
});
const _faker = require("@faker-js/faker");
const _types = require("twenty-shared/types");
const getFlatFieldMetadataMock = (overrides)=>{
    const createdAt = '2024-01-01T00:00:00.000Z';
    return {
        calendarViewIds: [],
        calendarEndViewIds: [],
        viewFilterIds: [],
        kanbanAggregateOperationViewIds: [],
        viewFieldIds: [],
        fieldPermissionIds: [],
        createdAt,
        mainGroupByFieldMetadataViewIds: [],
        updatedAt: createdAt,
        defaultValue: null,
        writability: _types.MetadataWritability.OPEN,
        options: null,
        morphId: null,
        settings: null,
        description: 'default flat field metadata description',
        icon: 'icon',
        id: _faker.faker.string.uuid(),
        isActive: true,
        isSystemSideEffect: false,
        name: 'flatFieldMetadataName',
        label: 'flat field metadata label',
        isNullable: true,
        isUnique: false,
        isUIEditable: true,
        isLabelSyncedWithName: false,
        isSystem: false,
        overrides: null,
        workspaceId: _faker.faker.string.uuid(),
        applicationId: _faker.faker.string.uuid(),
        relationTargetFieldMetadataId: null,
        relationTargetObjectMetadataId: null,
        applicationUniversalIdentifier: _faker.faker.string.uuid(),
        objectMetadataUniversalIdentifier: _faker.faker.string.uuid(),
        relationTargetObjectMetadataUniversalIdentifier: null,
        relationTargetFieldMetadataUniversalIdentifier: null,
        viewFilterUniversalIdentifiers: [],
        viewFieldUniversalIdentifiers: [],
        fieldPermissionUniversalIdentifiers: [],
        kanbanAggregateOperationViewUniversalIdentifiers: [],
        calendarViewUniversalIdentifiers: [],
        calendarEndViewUniversalIdentifiers: [],
        mainGroupByFieldMetadataViewUniversalIdentifiers: [],
        viewSortIds: [],
        viewSortUniversalIdentifiers: [],
        searchFieldMetadataIds: [],
        searchFieldMetadataUniversalIdentifiers: [],
        universalSettings: null,
        ...overrides
    };
};
const getStandardFlatFieldMetadataMock = (overrides)=>{
    return getFlatFieldMetadataMock({
        overrides: {},
        isSystem: true,
        ...overrides
    });
};

//# sourceMappingURL=get-flat-field-metadata.mock.js.map