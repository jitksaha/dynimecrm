"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFlatEntityCircularDependency", {
    enumerable: true,
    get: function() {
        return validateFlatEntityCircularDependency;
    }
});
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const validateFlatEntityCircularDependency = ({ flatEntityUniversalIdentifier, flatEntityParentUniversalIdentifier, maxDepth, parentUniversalIdentifierKey, flatEntityMaps })=>{
    if (flatEntityUniversalIdentifier === flatEntityParentUniversalIdentifier) {
        return {
            status: 'fail',
            reason: 'self_reference'
        };
    }
    const visited = new Set();
    let currentParentUniversalIdentifier = flatEntityParentUniversalIdentifier;
    let depth = 1;
    while((0, _utils.isDefined)(currentParentUniversalIdentifier)){
        if ((0, _utils.isDefined)(maxDepth) && depth > maxDepth) {
            return {
                status: 'fail',
                reason: 'max_depth_exceeded',
                depth
            };
        }
        if (currentParentUniversalIdentifier === flatEntityUniversalIdentifier) {
            return {
                status: 'fail',
                reason: 'circular_dependency',
                depth
            };
        }
        if (visited.has(currentParentUniversalIdentifier)) {
            return {
                status: 'fail',
                reason: 'circular_dependency',
                depth
            };
        }
        visited.add(currentParentUniversalIdentifier);
        const parentEntity = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: currentParentUniversalIdentifier,
            flatEntityMaps
        });
        if (!(0, _utils.isDefined)(parentEntity)) {
            break;
        }
        const nextParentUniversalIdentifier = parentEntity[parentUniversalIdentifierKey];
        currentParentUniversalIdentifier = (0, _utils.isDefined)(nextParentUniversalIdentifier) && typeof nextParentUniversalIdentifier === 'string' ? nextParentUniversalIdentifier : undefined;
        depth++;
    }
    if ((0, _utils.isDefined)(maxDepth) && depth > maxDepth) {
        return {
            status: 'fail',
            reason: 'max_depth_exceeded',
            depth
        };
    }
    return {
        status: 'success',
        depth
    };
};

//# sourceMappingURL=validate-flat-entity-circular-dependency.util.js.map