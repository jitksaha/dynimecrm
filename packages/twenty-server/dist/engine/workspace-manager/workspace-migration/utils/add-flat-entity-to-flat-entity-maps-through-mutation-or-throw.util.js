"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addFlatEntityToFlatEntityMapsThroughMutationOrThrow", {
    enumerable: true,
    get: function() {
        return addFlatEntityToFlatEntityMapsThroughMutationOrThrow;
    }
});
const _utils = require("twenty-shared/utils");
const _flatentitymapsexception = require("../../../metadata-modules/flat-entity/exceptions/flat-entity-maps.exception");
const addFlatEntityToFlatEntityMapsThroughMutationOrThrow = ({ flatEntity, flatEntityMapsToMutate })=>{
    if ((0, _utils.isDefined)(flatEntityMapsToMutate.byUniversalIdentifier[flatEntity.universalIdentifier])) {
        throw new _flatentitymapsexception.FlatEntityMapsException(`addFlatEntityToFlatEntityMapsThroughMutationOrThrow: flat entity to add already exists (universalIdentifier: ${flatEntity.universalIdentifier})`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_ALREADY_EXISTS, {
            context: {
                universalIdentifier: flatEntity.universalIdentifier,
                id: flatEntity.id,
                applicationId: flatEntity.applicationId,
                operation: 'add'
            }
        });
    }
    flatEntityMapsToMutate.byUniversalIdentifier[flatEntity.universalIdentifier] = flatEntity;
    flatEntityMapsToMutate.universalIdentifierById[flatEntity.id] = flatEntity.universalIdentifier;
    if ((0, _utils.isDefined)(flatEntity.applicationId)) {
        const existingUniversalIdentifiers = flatEntityMapsToMutate.universalIdentifiersByApplicationId[flatEntity.applicationId];
        if ((0, _utils.isDefined)(existingUniversalIdentifiers)) {
            existingUniversalIdentifiers.push(flatEntity.universalIdentifier);
        } else {
            flatEntityMapsToMutate.universalIdentifiersByApplicationId[flatEntity.applicationId] = [
                flatEntity.universalIdentifier
            ];
        }
    }
};

//# sourceMappingURL=add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util.js.map