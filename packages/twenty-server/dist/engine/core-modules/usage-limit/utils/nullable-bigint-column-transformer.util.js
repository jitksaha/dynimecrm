"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "nullableBigintColumnTransformer", {
    enumerable: true,
    get: function() {
        return nullableBigintColumnTransformer;
    }
});
const _guards = require("@sniptt/guards");
const nullableBigintColumnTransformer = {
    to: (value)=>value,
    from: (value)=>(0, _guards.isString)(value) ? Number(value) : value
};

//# sourceMappingURL=nullable-bigint-column-transformer.util.js.map