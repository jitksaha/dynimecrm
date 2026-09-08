"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveEffectiveEntity", {
    enumerable: true,
    get: function() {
        return resolveEffectiveEntity;
    }
});
const _utils = require("twenty-shared/utils");
const resolveEffectiveEntity = (flatEntity)=>{
    if (!(0, _utils.isDefined)(flatEntity.overrides)) {
        return flatEntity;
    }
    return {
        ...flatEntity,
        ...flatEntity.overrides
    };
};

//# sourceMappingURL=resolve-effective-entity.util.js.map