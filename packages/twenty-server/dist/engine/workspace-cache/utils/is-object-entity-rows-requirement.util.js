"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isObjectEntityRowsRequirement", {
    enumerable: true,
    get: function() {
        return isObjectEntityRowsRequirement;
    }
});
const isObjectEntityRowsRequirement = (entityRowsRequirement)=>entityRowsRequirement !== true && !Array.isArray(entityRowsRequirement);

//# sourceMappingURL=is-object-entity-rows-requirement.util.js.map