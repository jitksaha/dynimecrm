"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveOffsetInput", {
    enumerable: true,
    get: function() {
        return resolveOffsetInput;
    }
});
const _utils = require("twenty-shared/utils");
const _parsefinitenumberinpututil = require("./parse-finite-number-input.util");
const resolveOffsetInput = (value)=>{
    const parsedValue = (0, _parsefinitenumberinpututil.parseFiniteNumberInput)(value);
    if (!(0, _utils.isDefined)(parsedValue)) {
        return undefined;
    }
    return Math.max(0, Math.floor(parsedValue));
};

//# sourceMappingURL=resolve-offset-input.util.js.map