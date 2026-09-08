"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPositiveTokenLimitOrDefault", {
    enumerable: true,
    get: function() {
        return getPositiveTokenLimitOrDefault;
    }
});
const _utils = require("twenty-shared/utils");
const getPositiveTokenLimitOrDefault = (limit, fallback)=>(0, _utils.isDefined)(limit) && limit > 0 ? limit : fallback;

//# sourceMappingURL=get-positive-token-limit-or-default.util.js.map