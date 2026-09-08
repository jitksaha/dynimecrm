// Recursively removes undefined values from an object
// This is needed because workflows/tools may pass partial composite fields
// with undefined sub-properties, but the validation layer expects either
// a value or null (not undefined)
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removeUndefinedFromRecord", {
    enumerable: true,
    get: function() {
        return removeUndefinedFromRecord;
    }
});
const removeUndefinedFromRecord = (record)=>{
    const result = {};
    for (const [key, value] of Object.entries(record)){
        if (value === undefined) {
            continue;
        }
        // Recursively clean nested objects (composite fields like LINKS, ADDRESS, etc.)
        // but preserve arrays as-is (they should be handled separately if needed)
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            const cleaned = removeUndefinedFromRecord(value);
            if (Object.keys(cleaned).length > 0) {
                result[key] = cleaned;
            }
        } else {
            result[key] = value;
        }
    }
    return result;
};

//# sourceMappingURL=remove-undefined-from-record.util.js.map