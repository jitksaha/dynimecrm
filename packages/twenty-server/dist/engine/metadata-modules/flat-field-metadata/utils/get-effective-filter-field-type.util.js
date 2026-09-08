"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getEffectiveFilterFieldType", {
    enumerable: true,
    get: function() {
        return getEffectiveFilterFieldType;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const getEffectiveFilterFieldType = ({ fieldType, relationTargetFieldType })=>{
    const isRelationFieldType = fieldType === _types.FieldMetadataType.RELATION || fieldType === _types.FieldMetadataType.MORPH_RELATION;
    return isRelationFieldType && (0, _utils.isDefined)(relationTargetFieldType) ? relationTargetFieldType : fieldType;
};

//# sourceMappingURL=get-effective-filter-field-type.util.js.map