"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateOperationIsPermittedOrThrow", {
    enumerable: true,
    get: function() {
        return validateOperationIsPermittedOrThrow;
    }
});
const _guards = require("@sniptt/guards");
const _lodashisempty = /*#__PURE__*/ _interop_require_default(require("lodash.isempty"));
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../core-modules/graphql/utils/graphql-errors.util");
const _findflatentitybyidinflatentitymapsutil = require("../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _permissionsexception = require("../../metadata-modules/permissions/permissions.exception");
const _validatewritabilityorthrowutil = require("./validate-writability-or-throw.util");
const _getcolumnnametofieldmetadataidutil = require("../utils/get-column-name-to-field-metadata-id.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const WORKSPACE_MEMBER_OBJECT_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.workspaceMember.universalIdentifier;
const validateOperationIsPermittedOrThrow = ({ entityName, operationType, objectsPermissions, flatObjectMetadataMaps, flatFieldMetadataMaps, objectIdByNameSingular, selectedColumns, allFieldsSelected, updatedColumns, authContext })=>{
    const objectMetadataIdForEntity = objectIdByNameSingular[entityName];
    if (!(0, _guards.isNonEmptyString)(objectMetadataIdForEntity)) {
        throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
    }
    const objectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: objectMetadataIdForEntity,
        flatEntityMaps: flatObjectMetadataMaps
    });
    if (!(0, _utils.isDefined)(objectMetadata)) {
        throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
    }
    const columnNameToFieldMetadataIdMap = (0, _getcolumnnametofieldmetadataidutil.getColumnNameToFieldMetadataIdMap)(objectMetadata, flatFieldMetadataMaps);
    (0, _validatewritabilityorthrowutil.validateWritabilityOrThrow)({
        operationType,
        objectMetadata,
        updatedColumns,
        columnNameToFieldMetadataIdMap,
        flatFieldMetadataMaps,
        authContext
    });
    const objectMetadataIsSystem = objectMetadata.isSystem === true;
    const isWorkspaceMemberObject = objectMetadata.universalIdentifier === WORKSPACE_MEMBER_OBJECT_UNIVERSAL_IDENTIFIER;
    // TODO: this should be improved, we may have more complex permission configuration for is system objects
    if (objectMetadataIsSystem && !isWorkspaceMemberObject) {
        return;
    }
    const permissionsForEntity = objectsPermissions[objectMetadataIdForEntity];
    switch(operationType){
        case 'select':
            if (!permissionsForEntity?.canReadObjectRecords) {
                throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
            }
            validateReadFieldPermissionOrThrow({
                restrictedFields: permissionsForEntity.restrictedFields,
                selectedColumns,
                columnNameToFieldMetadataIdMap,
                allFieldsSelected,
                entityName,
                flatFieldMetadataMaps
            });
            break;
        case 'insert':
            if (!permissionsForEntity?.canUpdateObjectRecords) {
                throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
            }
            validateReadFieldPermissionOrThrow({
                restrictedFields: permissionsForEntity.restrictedFields,
                selectedColumns,
                columnNameToFieldMetadataIdMap,
                entityName,
                flatFieldMetadataMaps
            });
            if (updatedColumns.length > 0) {
                const rlsFieldMetadataIds = new Set(permissionsForEntity.rowLevelPermissionPredicates.map((predicate)=>predicate.fieldMetadataId));
                const updatedColumnsWithoutRlsFields = updatedColumns.filter((column)=>!rlsFieldMetadataIds.has(columnNameToFieldMetadataIdMap[column]));
                if (updatedColumnsWithoutRlsFields.length > 0) {
                    validateUpdateFieldPermissionOrThrow({
                        restrictedFields: permissionsForEntity.restrictedFields,
                        updatedColumns: updatedColumnsWithoutRlsFields,
                        columnNameToFieldMetadataIdMap,
                        entityName,
                        flatFieldMetadataMaps
                    });
                }
            }
            break;
        case 'update':
            if (!permissionsForEntity?.canUpdateObjectRecords) {
                throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
            }
            validateReadFieldPermissionOrThrow({
                restrictedFields: permissionsForEntity.restrictedFields,
                selectedColumns,
                columnNameToFieldMetadataIdMap,
                entityName,
                flatFieldMetadataMaps
            });
            if (updatedColumns.length > 0) {
                validateUpdateFieldPermissionOrThrow({
                    restrictedFields: permissionsForEntity.restrictedFields,
                    updatedColumns,
                    columnNameToFieldMetadataIdMap,
                    entityName,
                    flatFieldMetadataMaps
                });
            }
            break;
        case 'delete':
            if (!permissionsForEntity?.canDestroyObjectRecords) {
                throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
            }
            validateReadFieldPermissionOrThrow({
                restrictedFields: permissionsForEntity.restrictedFields,
                selectedColumns,
                columnNameToFieldMetadataIdMap,
                entityName,
                flatFieldMetadataMaps
            });
            break;
        case 'restore':
        case 'soft-delete':
            if (!permissionsForEntity?.canSoftDeleteObjectRecords) {
                throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
            }
            validateReadFieldPermissionOrThrow({
                restrictedFields: permissionsForEntity.restrictedFields,
                selectedColumns,
                columnNameToFieldMetadataIdMap,
                entityName,
                flatFieldMetadataMaps
            });
            break;
        default:
            throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.UNKNOWN_OPERATION_NAME, _permissionsexception.PermissionsExceptionCode.UNKNOWN_OPERATION_NAME);
    }
    if ((0, _lodashisempty.default)(permissionsForEntity.restrictedFields)) {
        return;
    }
};
const buildFieldPermissionDeniedMessage = ({ action, column, fieldMetadataId, entityName, flatFieldMetadataMaps })=>{
    const fieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: fieldMetadataId,
        flatEntityMaps: flatFieldMetadataMaps
    });
    const fieldName = fieldMetadata?.name ?? column;
    return `${_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED}: no permission to ${action} field "${fieldName}" on "${entityName}"`;
};
const validateReadFieldPermissionOrThrow = ({ restrictedFields, selectedColumns, columnNameToFieldMetadataIdMap, allFieldsSelected, entityName, flatFieldMetadataMaps })=>{
    const noReadRestrictions = (0, _lodashisempty.default)(restrictedFields) || Object.values(restrictedFields).every((field)=>field.canRead !== false);
    if (noReadRestrictions) {
        return;
    }
    if (allFieldsSelected || selectedColumns === '*') {
        throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
    }
    for (const column of selectedColumns){
        const fieldMetadataId = columnNameToFieldMetadataIdMap[column];
        if (!fieldMetadataId) {
            throw new _graphqlerrorsutil.InternalServerError(`Field metadata id not found for column name ${column}`);
        }
        if (restrictedFields[fieldMetadataId]?.canRead === false) {
            throw new _permissionsexception.PermissionsException(buildFieldPermissionDeniedMessage({
                action: 'read',
                column,
                fieldMetadataId,
                entityName,
                flatFieldMetadataMaps
            }), _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
        }
    }
};
const validateUpdateFieldPermissionOrThrow = ({ restrictedFields, updatedColumns, columnNameToFieldMetadataIdMap, entityName, flatFieldMetadataMaps })=>{
    if ((0, _lodashisempty.default)(restrictedFields)) {
        return;
    }
    for (const column of updatedColumns){
        const fieldMetadataId = columnNameToFieldMetadataIdMap[column];
        if (!fieldMetadataId) {
            throw new _graphqlerrorsutil.InternalServerError(`Field metadata id not found for column name ${column}`);
        }
        if (restrictedFields[fieldMetadataId]?.canUpdate === false) {
            throw new _permissionsexception.PermissionsException(buildFieldPermissionDeniedMessage({
                action: 'write',
                column,
                fieldMetadataId,
                entityName,
                flatFieldMetadataMaps
            }), _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
        }
    }
};

//# sourceMappingURL=permissions.utils.js.map