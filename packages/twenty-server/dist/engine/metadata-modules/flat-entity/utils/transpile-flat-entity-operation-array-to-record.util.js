"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "transpileFlatEntityOperationArrayToRecord", {
    enumerable: true,
    get: function() {
        return transpileFlatEntityOperationArrayToRecord;
    }
});
const _utils = require("twenty-shared/utils");
const _flatentitymapsexception = require("../exceptions/flat-entity-maps.exception");
const toRecordByUniversalIdentifierOrThrow = ({ flatEntities, metadataName, operation })=>{
    const recordByUniversalIdentifier = {};
    const seenUniversalIdentifiers = new Set();
    for (const flatEntity of flatEntities){
        if (seenUniversalIdentifiers.has(flatEntity.universalIdentifier)) {
            throw new _flatentitymapsexception.FlatEntityMapsException(`Duplicate universalIdentifier "${flatEntity.universalIdentifier}" in ${operation} for metadata "${metadataName}"`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_ALREADY_EXISTS);
        }
        seenUniversalIdentifiers.add(flatEntity.universalIdentifier);
        recordByUniversalIdentifier[flatEntity.universalIdentifier] = flatEntity;
    }
    return recordByUniversalIdentifier;
};
const transpileFlatEntityOperationArrayToRecord = (allFlatEntityOperationByMetadataName)=>{
    const genericMatrix = allFlatEntityOperationByMetadataName;
    const recordMatrix = {};
    for (const metadataName of Object.keys(genericMatrix)){
        const operations = genericMatrix[metadataName];
        if (!(0, _utils.isDefined)(operations)) {
            continue;
        }
        recordMatrix[metadataName] = {
            flatEntityToCreate: toRecordByUniversalIdentifierOrThrow({
                flatEntities: operations.flatEntityToCreate,
                metadataName,
                operation: 'flatEntityToCreate'
            }),
            flatEntityToUpdate: toRecordByUniversalIdentifierOrThrow({
                flatEntities: operations.flatEntityToUpdate,
                metadataName,
                operation: 'flatEntityToUpdate'
            }),
            flatEntityToDelete: toRecordByUniversalIdentifierOrThrow({
                flatEntities: operations.flatEntityToDelete,
                metadataName,
                operation: 'flatEntityToDelete'
            })
        };
    }
    return recordMatrix;
};

//# sourceMappingURL=transpile-flat-entity-operation-array-to-record.util.js.map