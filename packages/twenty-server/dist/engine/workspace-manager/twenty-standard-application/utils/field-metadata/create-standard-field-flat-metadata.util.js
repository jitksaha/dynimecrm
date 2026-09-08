"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createStandardFieldFlatMetadata", {
    enumerable: true,
    get: function() {
        return createStandardFieldFlatMetadata;
    }
});
const _types = require("twenty-shared/types");
const _metadata = require("twenty-shared/metadata");
const _application = require("twenty-shared/application");
const _partialsystemflatfieldmetadatasconstant = require("../../../../metadata-modules/object-metadata/constants/partial-system-flat-field-metadatas.constant");
const createStandardFieldFlatMetadata = ({ objectName, workspaceId, context: { fieldName, type, label, description, icon, isSystem = false, isNullable = true, isUnique = false, isUIEditable = true, defaultValue, settings, options: fieldOptions = null }, standardObjectMetadataRelatedEntityIds, twentyStandardApplicationId, now })=>{
    const objectFields = _metadata.STANDARD_OBJECTS[objectName].fields;
    const fieldDefinition = objectFields[fieldName];
    const fieldIds = standardObjectMetadataRelatedEntityIds[objectName].fields;
    const name = fieldName.toString();
    return {
        id: fieldIds[fieldName].id,
        universalIdentifier: fieldDefinition.universalIdentifier,
        applicationId: twentyStandardApplicationId,
        workspaceId,
        objectMetadataId: standardObjectMetadataRelatedEntityIds[objectName].id,
        type,
        name,
        label,
        description,
        icon,
        isActive: true,
        isSystem,
        isSystemSideEffect: name in _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS,
        isNullable,
        isUnique,
        isUIEditable,
        writability: name in _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS ? _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS[name].writability : _types.MetadataWritability.OPEN,
        isLabelSyncedWithName: false,
        overrides: null,
        defaultValue: defaultValue ?? null,
        settings: settings ?? null,
        options: fieldOptions ?? null,
        relationTargetFieldMetadataId: null,
        relationTargetObjectMetadataId: null,
        morphId: null,
        viewFieldIds: [],
        viewFilterIds: [],
        fieldPermissionIds: [],
        kanbanAggregateOperationViewIds: [],
        calendarViewIds: [],
        calendarEndViewIds: [],
        mainGroupByFieldMetadataViewIds: [],
        createdAt: now,
        updatedAt: now,
        applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectMetadataUniversalIdentifier: _metadata.STANDARD_OBJECTS[objectName].universalIdentifier,
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
        universalSettings: settings ?? null
    };
};

//# sourceMappingURL=create-standard-field-flat-metadata.util.js.map