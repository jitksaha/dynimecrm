"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveManyToOneRelationIdsToUniversalIdentifiers", {
    enumerable: true,
    get: function() {
        return resolveManyToOneRelationIdsToUniversalIdentifiers;
    }
});
const _utils = require("twenty-shared/utils");
const _allmanytoonemetadatarelationsconstant = require("../../../../metadata-modules/flat-entity/constant/all-many-to-one-metadata-relations.constant");
const _flatentitymapsexception = require("../../../../metadata-modules/flat-entity/exceptions/flat-entity-maps.exception");
const resolveManyToOneRelationIdsToUniversalIdentifiers = ({ metadataName, entity, ...idToUniversalIdentifierMaps })=>{
    const readEntityForeignKey = (propertyName)=>entity[propertyName];
    const entityId = readEntityForeignKey('id');
    const resolvedUniversalIdentifierByForeignKey = {};
    const applicationId = readEntityForeignKey('applicationId');
    const applicationUniversalIdentifier = (0, _utils.isDefined)(applicationId) ? idToUniversalIdentifierMaps.applicationIdToUniversalIdentifierMap.get(applicationId) : undefined;
    if (!(0, _utils.isDefined)(applicationUniversalIdentifier)) {
        throw new _flatentitymapsexception.FlatEntityMapsException(`Application with id ${applicationId} not found for ${metadataName} ${entityId}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
    }
    resolvedUniversalIdentifierByForeignKey.applicationUniversalIdentifier = applicationUniversalIdentifier;
    const relationEntries = _allmanytoonemetadatarelationsconstant.ALL_MANY_TO_ONE_METADATA_RELATIONS[metadataName];
    for (const relationPropertyName of Object.keys(relationEntries)){
        const relationEntry = relationEntries[relationPropertyName];
        if (!(0, _utils.isDefined)(relationEntry)) {
            continue;
        }
        const { foreignKey, metadataName: targetMetadataName, universalForeignKey, isNullable } = relationEntry;
        const foreignKeyId = readEntityForeignKey(foreignKey);
        if (!(0, _utils.isDefined)(foreignKeyId)) {
            if (isNullable) {
                resolvedUniversalIdentifierByForeignKey[universalForeignKey] = null;
                continue;
            }
            throw new _flatentitymapsexception.FlatEntityMapsException(`Missing non-nullable foreign key ${foreignKey} on ${metadataName} ${entityId} (relation to ${targetMetadataName})`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_MALFORMED);
        }
        const mapKey = `${targetMetadataName}IdToUniversalIdentifierMap`;
        const targetIdToUniversalIdentifierMap = idToUniversalIdentifierMaps[mapKey];
        if (!(0, _utils.isDefined)(targetIdToUniversalIdentifierMap)) {
            throw new _flatentitymapsexception.FlatEntityMapsException(`Missing ${mapKey} when resolving ${metadataName} ${entityId}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
        }
        const universalIdentifier = targetIdToUniversalIdentifierMap.get(foreignKeyId);
        if (!(0, _utils.isDefined)(universalIdentifier)) {
            throw new _flatentitymapsexception.FlatEntityMapsException(`${(0, _utils.capitalize)(targetMetadataName)} with id ${foreignKeyId} not found for ${metadataName} ${entityId}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
        }
        resolvedUniversalIdentifierByForeignKey[universalForeignKey] = universalIdentifier;
    }
    return resolvedUniversalIdentifierByForeignKey;
};

//# sourceMappingURL=resolve-many-to-one-relation-ids-to-universal-identifiers.util.js.map