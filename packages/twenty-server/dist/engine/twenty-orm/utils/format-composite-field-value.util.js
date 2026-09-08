"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatCompositeFieldValue", {
    enumerable: true,
    get: function() {
        return formatCompositeFieldValue;
    }
});
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const formatCompositeFieldValue = (value, compositePropertyName, fieldMetadata)=>{
    switch(fieldMetadata.type){
        case _types.FieldMetadataType.CURRENCY:
            {
                if (compositePropertyName === 'amountMicros') {
                    if ((0, _guards.isNonEmptyString)(value)) {
                        return parseInt(value);
                    }
                    return value;
                }
                break;
            }
        case _types.FieldMetadataType.ADDRESS:
            {
                if (compositePropertyName === 'addressLat' || compositePropertyName === 'addressLng') {
                    if ((0, _guards.isNonEmptyString)(value)) {
                        return parseFloat(value);
                    }
                    return value;
                }
                break;
            }
    }
    return value;
};

//# sourceMappingURL=format-composite-field-value.util.js.map