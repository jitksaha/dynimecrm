"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isRelationNestedFieldSupportedInGroupBy", {
    enumerable: true,
    get: function() {
        return isRelationNestedFieldSupportedInGroupBy;
    }
});
const _utils = require("twenty-shared/utils");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const isRelationNestedFieldSupportedInGroupBy = ({ nestedFieldName, nestedFieldMetadata })=>{
    if (nestedFieldName === 'id') {
        return true;
    }
    const relationType = (0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(nestedFieldMetadata) ? nestedFieldMetadata.settings.relationType : null;
    return (0, _utils.isFieldMetadataSupportedInGroupBy)({
        type: nestedFieldMetadata.type,
        name: nestedFieldMetadata.name,
        isSystem: nestedFieldMetadata.isSystem,
        relationType
    });
};

//# sourceMappingURL=is-relation-nested-field-supported-in-group-by.util.js.map