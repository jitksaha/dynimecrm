"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveApplicationReferenceIdOrThrow", {
    enumerable: true,
    get: function() {
        return resolveApplicationReferenceIdOrThrow;
    }
});
const _utils = require("twenty-shared/utils");
const _applicationexception = require("../../application.exception");
const _findflatentitybyuniversalidentifierutil = require("../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const resolveApplicationReferenceIdOrThrow = ({ flatEntityMaps, universalIdentifier, referenceLabel, exceptionCode, ownerApplicationId })=>{
    const flatEntity = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        flatEntityMaps,
        universalIdentifier
    });
    if (!(0, _utils.isDefined)(flatEntity) || (0, _utils.isDefined)(ownerApplicationId) && flatEntity.applicationId !== ownerApplicationId) {
        throw new _applicationexception.ApplicationException(`Failed to resolve ${referenceLabel} for universalIdentifier ${universalIdentifier}`, exceptionCode);
    }
    return flatEntity.id;
};

//# sourceMappingURL=resolve-application-reference-id-or-throw.util.js.map