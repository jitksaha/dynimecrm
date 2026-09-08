"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isNullRelationValue", {
    enumerable: true,
    get: function() {
        return isNullRelationValue;
    }
});
const _guards = require("@sniptt/guards");
const isNullRelationValue = (value)=>value === null || (0, _guards.isObject)(value) && value.id === null;

//# sourceMappingURL=is-null-relation-value.util.js.map