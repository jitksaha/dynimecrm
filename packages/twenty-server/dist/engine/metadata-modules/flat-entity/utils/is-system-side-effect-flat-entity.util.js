"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isSystemSideEffectFlatEntity", {
    enumerable: true,
    get: function() {
        return isSystemSideEffectFlatEntity;
    }
});
const isSystemSideEffectFlatEntity = (flatEntity)=>'isSystemSideEffect' in flatEntity && flatEntity.isSystemSideEffect === true;

//# sourceMappingURL=is-system-side-effect-flat-entity.util.js.map