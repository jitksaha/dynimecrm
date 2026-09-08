"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isCallerOverridingEntity", {
    enumerable: true,
    get: function() {
        return isCallerOverridingEntity;
    }
});
const isCallerOverridingEntity = ({ callerApplicationUniversalIdentifier, entityApplicationUniversalIdentifier, workspaceCustomApplicationUniversalIdentifier, isSystemSideEffect })=>{
    return callerApplicationUniversalIdentifier === workspaceCustomApplicationUniversalIdentifier && (entityApplicationUniversalIdentifier !== workspaceCustomApplicationUniversalIdentifier || isSystemSideEffect);
};

//# sourceMappingURL=is-caller-overriding-entity.util.js.map