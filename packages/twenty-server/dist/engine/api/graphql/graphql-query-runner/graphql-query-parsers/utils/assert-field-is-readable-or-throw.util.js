"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "assertFieldIsReadableOrThrow", {
    enumerable: true,
    get: function() {
        return assertFieldIsReadableOrThrow;
    }
});
const _permissionsexception = require("../../../../../metadata-modules/permissions/permissions.exception");
const assertFieldIsReadableOrThrow = ({ objectsPermissions, objectMetadataId, fieldMetadataId })=>{
    if (objectsPermissions?.[objectMetadataId]?.restrictedFields[fieldMetadataId]?.canRead === false) {
        throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
    }
};

//# sourceMappingURL=assert-field-is-readable-or-throw.util.js.map