// Recursively strips null, undefined, empty strings, empty objects,
// and empty arrays from a value. Returns undefined if the entire
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "stripEmptyValues", {
    enumerable: true,
    get: function() {
        return stripEmptyValues;
    }
});
const _guards = require("@sniptt/guards");
const stripEmptyValues = (value)=>{
    if (value === null || value === undefined || value === '') {
        return undefined;
    }
    if ((0, _guards.isDate)(value)) {
        return value;
    }
    if (Array.isArray(value)) {
        const cleaned = value.map(stripEmptyValues).filter((item)=>item !== undefined);
        return cleaned.length > 0 ? cleaned : undefined;
    }
    if (typeof value === 'object') {
        const result = {};
        for (const [key, val] of Object.entries(value)){
            const stripped = stripEmptyValues(val);
            if (stripped !== undefined) {
                result[key] = stripped;
            }
        }
        return Object.keys(result).length > 0 ? result : undefined;
    }
    return value;
};

//# sourceMappingURL=strip-empty-values.util.js.map