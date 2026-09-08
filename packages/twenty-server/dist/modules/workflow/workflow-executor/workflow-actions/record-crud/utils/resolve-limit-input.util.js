"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveLimitInput", {
    enumerable: true,
    get: function() {
        return resolveLimitInput;
    }
});
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _parsefinitenumberinpututil = require("./parse-finite-number-input.util");
const resolveLimitInput = (value)=>{
    const parsedValue = (0, _parsefinitenumberinpututil.parseFiniteNumberInput)(value);
    if (!(0, _utils.isDefined)(parsedValue)) {
        return undefined;
    }
    return Math.min(Math.max(Math.floor(parsedValue), 1), _constants.QUERY_MAX_RECORDS);
};

//# sourceMappingURL=resolve-limit-input.util.js.map