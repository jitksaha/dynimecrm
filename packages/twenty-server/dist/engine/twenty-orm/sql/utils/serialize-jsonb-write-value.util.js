"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "serializeJsonbWriteValue", {
    enumerable: true,
    get: function() {
        return serializeJsonbWriteValue;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const isJsonbFieldMetadataType = (fieldMetadataType)=>fieldMetadataType === _types.FieldMetadataType.RAW_JSON || fieldMetadataType === _types.FieldMetadataType.FILES;
const serializeJsonbWriteValue = (columnShape, value)=>{
    if (!(0, _utils.isDefined)(columnShape) || !(0, _utils.isDefined)(value)) {
        return value;
    }
    return isJsonbFieldMetadataType(columnShape.fieldMetadataType) ? JSON.stringify(value) : value;
};

//# sourceMappingURL=serialize-jsonb-write-value.util.js.map