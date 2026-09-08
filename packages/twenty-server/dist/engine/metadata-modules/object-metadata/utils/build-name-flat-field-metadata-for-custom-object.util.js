"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildNameFlatFieldMetadataForCustomObject", {
    enumerable: true,
    get: function() {
        return buildNameFlatFieldMetadataForCustomObject;
    }
});
const _application = require("twenty-shared/application");
const _types = require("twenty-shared/types");
const buildNameFlatFieldMetadataForCustomObject = ({ flatObjectMetadata: { applicationUniversalIdentifier, universalIdentifier: objectMetadataUniversalIdentifier } })=>{
    const now = new Date().toISOString();
    return {
        type: _types.FieldMetadataType.TEXT,
        isLabelSyncedWithName: false,
        isUnique: false,
        universalIdentifier: (0, _application.getFieldUniversalIdentifier)({
            applicationUniversalIdentifier,
            objectUniversalIdentifier: objectMetadataUniversalIdentifier,
            name: 'name'
        }),
        name: 'name',
        label: 'Name',
        icon: 'IconAbc',
        description: 'Name',
        isNullable: true,
        isActive: true,
        isSystem: false,
        isSystemSideEffect: false,
        isUIEditable: true,
        writability: _types.MetadataWritability.OPEN,
        defaultValue: null,
        createdAt: now,
        updatedAt: now,
        options: null,
        overrides: null,
        morphId: null,
        applicationUniversalIdentifier,
        objectMetadataUniversalIdentifier,
        relationTargetObjectMetadataUniversalIdentifier: null,
        relationTargetFieldMetadataUniversalIdentifier: null,
        viewFilterUniversalIdentifiers: [],
        viewFieldUniversalIdentifiers: [],
        kanbanAggregateOperationViewUniversalIdentifiers: [],
        calendarViewUniversalIdentifiers: [],
        calendarEndViewUniversalIdentifiers: [],
        mainGroupByFieldMetadataViewUniversalIdentifiers: [],
        fieldPermissionUniversalIdentifiers: [],
        universalSettings: null,
        viewSortUniversalIdentifiers: [],
        searchFieldMetadataUniversalIdentifiers: []
    };
};

//# sourceMappingURL=build-name-flat-field-metadata-for-custom-object.util.js.map