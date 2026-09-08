"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseBoundedPositiveInteger", {
    enumerable: true,
    get: function() {
        return parseBoundedPositiveInteger;
    }
});
const parseBoundedPositiveInteger = (value, optionName, maximum)=>{
    const parsedValue = Number(value);
    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        throw new Error(`Invalid ${optionName} "${value}". Expected a positive integer`);
    }
    if (parsedValue > maximum) {
        throw new Error(`Invalid ${optionName} "${value}". Maximum is ${maximum}`);
    }
    return parsedValue;
};

//# sourceMappingURL=parse-bounded-positive-integer.util.js.map