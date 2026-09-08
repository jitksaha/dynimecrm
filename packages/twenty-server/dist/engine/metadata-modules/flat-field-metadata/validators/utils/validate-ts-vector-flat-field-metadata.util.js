"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateTsVectorFlatFieldMetadata", {
    enumerable: true,
    get: function() {
        return validateTsVectorFlatFieldMetadata;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _fieldmetadataexception = require("../../../field-metadata/field-metadata.exception");
const validateTsVectorFlatFieldMetadata = ({ flatEntityToValidate, update })=>{
    const errors = [];
    if (flatEntityToValidate.name !== 'searchVector') {
        errors.push({
            code: _fieldmetadataexception.FieldMetadataExceptionCode.INVALID_FIELD_INPUT,
            message: `Field type TS_VECTOR must be named "searchVector", got "${flatEntityToValidate.name}"`,
            value: flatEntityToValidate.name,
            userFriendlyMessage: /*i18n*/ {
                id: "hoCDqQ",
                message: 'Field type TS_VECTOR must be named "searchVector"'
            }
        });
    }
    if (!flatEntityToValidate.isSystem) {
        errors.push({
            code: _fieldmetadataexception.FieldMetadataExceptionCode.INVALID_FIELD_INPUT,
            message: 'Field type TS_VECTOR must be a system field',
            value: flatEntityToValidate.isSystem,
            userFriendlyMessage: /*i18n*/ {
                id: "7cWO6W",
                message: "Field type TS_VECTOR must be a system field"
            }
        });
    }
    const isUpdateLeavingWritabilityUntouched = (0, _utils.isDefined)(update) && !('writability' in update);
    if (!isUpdateLeavingWritabilityUntouched && flatEntityToValidate.writability !== _types.MetadataWritability.SYSTEM) {
        errors.push({
            code: _fieldmetadataexception.FieldMetadataExceptionCode.INVALID_FIELD_INPUT,
            message: 'Field type TS_VECTOR must have SYSTEM writability',
            value: flatEntityToValidate.writability,
            userFriendlyMessage: /*i18n*/ {
                id: "VkSxbb",
                message: "Field type TS_VECTOR must have SYSTEM writability"
            }
        });
    }
    return errors;
};

//# sourceMappingURL=validate-ts-vector-flat-field-metadata.util.js.map