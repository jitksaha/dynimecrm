"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ORM_FLAT_FIELD_METADATA_KEYS", {
    enumerable: true,
    get: function() {
        return ORM_FLAT_FIELD_METADATA_KEYS;
    }
});
const ORM_FLAT_FIELD_METADATA_KEYS = [
    'id',
    'universalIdentifier',
    'applicationId',
    'workspaceId',
    'objectMetadataId',
    'type',
    'name',
    'label',
    'defaultValue',
    'options',
    'settings',
    'isNullable',
    'isUnique',
    'writability',
    'relationTargetFieldMetadataId',
    'relationTargetObjectMetadataId',
    'morphId',
    // Read by the shared query runners (merge, create, group-by support gates)
    // and REST/direct-execution paths that also consume this projection.
    'isActive',
    'isSystem'
];

//# sourceMappingURL=orm-flat-field-metadata.type.js.map