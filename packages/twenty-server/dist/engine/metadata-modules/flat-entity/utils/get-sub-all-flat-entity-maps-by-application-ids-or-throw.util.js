"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getSubAllFlatEntityMapsByApplicationIdsOrThrow", {
    enumerable: true,
    get: function() {
        return getSubAllFlatEntityMapsByApplicationIdsOrThrow;
    }
});
const _utils = require("twenty-shared/utils");
const _flatentitymapsexception = require("../exceptions/flat-entity-maps.exception");
const _getmetadataflatentitymapskeyutil = require("./get-metadata-flat-entity-maps-key.util");
const _getsubflatentitymapsbyapplicationidsorthrowutil = require("./get-sub-flat-entity-maps-by-application-ids-or-throw.util");
const _prunedanglingforeignkeyaggregatorsinallflatentitymapsthroughmutationutil = require("./prune-dangling-foreign-key-aggregators-in-all-flat-entity-maps-through-mutation.util");
const getSubAllFlatEntityMapsByApplicationIdsOrThrow = ({ applicationIds, metadataNames, fromAllFlatEntityMaps })=>{
    const subAllFlatEntityMaps = {};
    for (const metadataName of metadataNames){
        const flatEntityMapsKey = (0, _getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey)(metadataName);
        const fromFlatEntityMaps = fromAllFlatEntityMaps[flatEntityMapsKey];
        if (!(0, _utils.isDefined)(fromFlatEntityMaps)) {
            throw new _flatentitymapsexception.FlatEntityMapsException(`Missing flat entity maps for metadata "${metadataName}" while building application-scoped slice`, _flatentitymapsexception.FlatEntityMapsExceptionCode.INTERNAL_SERVER_ERROR);
        }
        // @ts-expect-error Metadata flat entity maps cache key and metadataName colliding
        subAllFlatEntityMaps[flatEntityMapsKey] = (0, _getsubflatentitymapsbyapplicationidsorthrowutil.getSubFlatEntityMapsByApplicationIdsOrThrow)({
            applicationIds,
            flatEntityMaps: fromFlatEntityMaps
        });
    }
    (0, _prunedanglingforeignkeyaggregatorsinallflatentitymapsthroughmutationutil.pruneDanglingForeignKeyAggregatorsInAllFlatEntityMapsThroughMutation)({
        allFlatEntityMapsToMutate: subAllFlatEntityMaps
    });
    return subAllFlatEntityMaps;
};

//# sourceMappingURL=get-sub-all-flat-entity-maps-by-application-ids-or-throw.util.js.map