"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getMockFieldMetadataEntity", {
    enumerable: true,
    get: function() {
        return getMockFieldMetadataEntity;
    }
});
const _faker = require("@faker-js/faker");
const _types = require("twenty-shared/types");
const getMockFieldMetadataEntity = (overrides)=>{
    return {
        isSystemSideEffect: false,
        workspace: {},
        calendarViews: [],
        calendarEndViews: [],
        mainGroupByFieldMetadataViews: [],
        viewFilters: [],
        viewFields: [],
        kanbanAggregateOperationViews: [],
        viewSorts: [],
        searchFieldMetadatas: [],
        morphId: null,
        fieldPermissions: [],
        icon: null,
        indexFieldMetadatas: [],
        isLabelSyncedWithName: false,
        isNullable: null,
        isUIEditable: true,
        writability: _types.MetadataWritability.OPEN,
        isSystem: false,
        isUnique: null,
        object: {},
        relationTargetFieldMetadata: null,
        relationTargetFieldMetadataId: null,
        relationTargetObjectMetadata: null,
        relationTargetObjectMetadataId: null,
        overrides: null,
        standardOverrides: null,
        id: _faker.faker.string.uuid(),
        name: 'defaultFieldMetadataName',
        label: 'Default field metadata entity label',
        description: 'Default field metadata entity description',
        defaultValue: null,
        options: null,
        settings: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isCustom: false,
        isUIReadOnly: false,
        application: {},
        applicationId: _faker.faker.string.uuid(),
        universalIdentifier: _faker.faker.string.uuid(),
        ...overrides
    };
};

//# sourceMappingURL=get-field-metadata-entity.mock.js.map