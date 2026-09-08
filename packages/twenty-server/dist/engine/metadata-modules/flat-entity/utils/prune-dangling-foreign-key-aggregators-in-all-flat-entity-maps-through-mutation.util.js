"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "pruneDanglingForeignKeyAggregatorsInAllFlatEntityMapsThroughMutation", {
    enumerable: true,
    get: function() {
        return pruneDanglingForeignKeyAggregatorsInAllFlatEntityMapsThroughMutation;
    }
});
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _allonetomanymetadatarelationsconstant = require("../constant/all-one-to-many-metadata-relations.constant");
const _getmetadataflatentitymapskeyutil = require("./get-metadata-flat-entity-maps-key.util");
const pruneFlatEntityForeignKeyAggregators = ({ flatEntity, aggregatorsWithChildIdentifiers })=>aggregatorsWithChildIdentifiers.reduce((prunedFlatEntity, { aggregatorProperty, childUniversalIdentifiers })=>{
        const aggregatedUniversalIdentifiers = prunedFlatEntity[aggregatorProperty];
        if (!(0, _utils.isDefined)(aggregatedUniversalIdentifiers) || !Array.isArray(aggregatedUniversalIdentifiers)) {
            return prunedFlatEntity;
        }
        const prunedUniversalIdentifiers = aggregatedUniversalIdentifiers.filter((childUniversalIdentifier)=>childUniversalIdentifiers.has(childUniversalIdentifier));
        if (prunedUniversalIdentifiers.length === aggregatedUniversalIdentifiers.length) {
            return prunedFlatEntity;
        }
        return {
            ...prunedFlatEntity,
            [aggregatorProperty]: prunedUniversalIdentifiers
        };
    }, flatEntity);
const pruneDanglingForeignKeyAggregatorsInAllFlatEntityMapsThroughMutation = ({ allFlatEntityMapsToMutate })=>{
    const looseAllFlatEntityMaps = allFlatEntityMapsToMutate;
    for (const metadataName of Object.values(_metadata.ALL_METADATA_NAME)){
        const parentFlatEntityMaps = looseAllFlatEntityMaps[(0, _getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey)(metadataName)];
        if (!(0, _utils.isDefined)(parentFlatEntityMaps)) {
            continue;
        }
        const oneToManyRelations = Object.values(_allonetomanymetadatarelationsconstant.ALL_ONE_TO_MANY_METADATA_RELATIONS[metadataName]);
        const aggregatorsWithChildIdentifiers = oneToManyRelations.filter(_utils.isDefined).flatMap((relation)=>{
            const childFlatEntityMaps = looseAllFlatEntityMaps[(0, _getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey)(relation.metadataName)];
            const childUniversalIdentifiers = (0, _utils.isDefined)(childFlatEntityMaps) ? new Set(Object.keys(childFlatEntityMaps.byUniversalIdentifier)) : new Set();
            return [
                {
                    aggregatorProperty: relation.universalFlatEntityForeignKeyAggregator,
                    childUniversalIdentifiers
                }
            ];
        });
        if (aggregatorsWithChildIdentifiers.length === 0) {
            continue;
        }
        const flatEntityByUniversalIdentifier = parentFlatEntityMaps.byUniversalIdentifier;
        for (const [universalIdentifier, parentFlatEntity] of Object.entries(flatEntityByUniversalIdentifier)){
            if (!(0, _utils.isDefined)(parentFlatEntity)) {
                continue;
            }
            flatEntityByUniversalIdentifier[universalIdentifier] = pruneFlatEntityForeignKeyAggregators({
                flatEntity: parentFlatEntity,
                aggregatorsWithChildIdentifiers
            });
        }
    }
};

//# sourceMappingURL=prune-dangling-foreign-key-aggregators-in-all-flat-entity-maps-through-mutation.util.js.map