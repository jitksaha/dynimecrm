"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateWritabilityOrThrow", {
    enumerable: true,
    get: function() {
        return validateWritabilityOrThrow;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _permissionsexception = require("../../metadata-modules/permissions/permissions.exception");
const isWritePermittedByWritability = ({ writability, owningApplicationId, authContext })=>{
    if (!(0, _utils.isDefined)(writability) || writability === _types.MetadataWritability.OPEN) {
        return true;
    }
    if (writability === _types.MetadataWritability.APPLICATION) {
        // Only APPLICATION_ACCESS tokens ever carry an application, so reading it
        // off a user-bound context cannot let an ordinary session through.
        return (0, _utils.isDefined)(authContext) && (0, _utils.isDefined)(owningApplicationId) && (authContext.type === 'application' || authContext.type === 'user') && authContext.application?.id === owningApplicationId;
    }
    return false;
};
const validateWritabilityOrThrow = ({ operationType, objectMetadata, updatedColumns, columnNameToFieldMetadataIdMap, flatFieldMetadataMaps, authContext })=>{
    if (operationType === 'select') {
        return;
    }
    if (!isWritePermittedByWritability({
        writability: objectMetadata.writability,
        owningApplicationId: objectMetadata.applicationId,
        authContext
    })) {
        throw new _permissionsexception.PermissionsException(`${_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED}: records of "${objectMetadata.nameSingular}" are not writable through the API`, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
    }
    for (const column of updatedColumns){
        const fieldMetadataId = columnNameToFieldMetadataIdMap[column];
        if (!(0, _utils.isDefined)(fieldMetadataId)) {
            continue;
        }
        const fieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: fieldMetadataId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(fieldMetadata)) {
            continue;
        }
        if (!isWritePermittedByWritability({
            writability: fieldMetadata.writability,
            owningApplicationId: fieldMetadata.applicationId,
            authContext
        })) {
            throw new _permissionsexception.PermissionsException(`${_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED}: field "${fieldMetadata.name}" on "${objectMetadata.nameSingular}" is not writable through the API`, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
        }
    }
};

//# sourceMappingURL=validate-writability-or-throw.util.js.map