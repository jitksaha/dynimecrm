"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findRelationPathsToPerson", {
    enumerable: true,
    get: function() {
        return findRelationPathsToPerson;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _relationtypeinterface = require("../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _computemorphorrelationfieldjoincolumnnameutil = require("../../../metadata-modules/field-metadata/utils/compute-morph-or-relation-field-join-column-name.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _isflatfieldmetadataoftypeutil = require("../../../metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
const _resolverelationfromflatfieldmetadatautil = require("../../../metadata-modules/flat-field-metadata/utils/resolve-relation-from-flat-field-metadata.util");
const _getflatfieldsforflatobjectmetadatautil = require("../../../api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _buildobjectidbynamemapsutil = require("../../../metadata-modules/flat-object-metadata/utils/build-object-id-by-name-maps.util");
const PERSON_OBJECT_NAME_SINGULAR = 'person';
const DEFAULT_MAX_RELATION_DEPTH_TO_PERSON = 3;
const isSystemObjectMetadata = (objectMetadata)=>objectMetadata.isSystem === true;
const findRelationPathsToPerson = ({ rootObjectNameSingular, flatObjectMetadataMaps, flatFieldMetadataMaps, maxDepth = DEFAULT_MAX_RELATION_DEPTH_TO_PERSON })=>{
    if (rootObjectNameSingular === PERSON_OBJECT_NAME_SINGULAR) {
        return [
            []
        ];
    }
    const { idByNameSingular } = (0, _buildobjectidbynamemapsutil.buildObjectIdByNameMaps)(flatObjectMetadataMaps);
    const rootObjectId = idByNameSingular[rootObjectNameSingular];
    if (!(0, _utils.isDefined)(rootObjectId)) {
        return [];
    }
    let frontier = [
        {
            objectId: rootObjectId,
            path: []
        }
    ];
    const visitedObjectIds = new Set([
        rootObjectId
    ]);
    const pathsToPerson = [];
    for(let depth = 0; depth < maxDepth; depth++){
        const nextFrontier = [];
        const objectIdsReachedThisDepth = new Set();
        for (const { objectId, path } of frontier){
            const sourceObject = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: objectId,
                flatEntityMaps: flatObjectMetadataMaps
            });
            if (!(0, _utils.isDefined)(sourceObject)) {
                continue;
            }
            for (const field of (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(sourceObject, flatFieldMetadataMaps)){
                if (!(0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(field, _types.FieldMetadataType.RELATION)) {
                    continue;
                }
                const relation = (0, _resolverelationfromflatfieldmetadatautil.resolveRelationFromFlatFieldMetadata)({
                    sourceFlatFieldMetadata: field,
                    flatFieldMetadataMaps,
                    flatObjectMetadataMaps
                });
                if (!(0, _utils.isDefined)(relation)) {
                    continue;
                }
                const joinColumnOwnerFlatFieldMetadata = relation.type === _relationtypeinterface.RelationType.MANY_TO_ONE ? field : (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
                    flatEntityId: field.relationTargetFieldMetadataId,
                    flatEntityMaps: flatFieldMetadataMaps
                });
                const joinColumnOwnerObjectMetadata = relation.type === _relationtypeinterface.RelationType.MANY_TO_ONE ? relation.sourceObjectMetadata : relation.targetObjectMetadata;
                const nextPath = [
                    ...path,
                    {
                        direction: relation.type,
                        queryObjectNameSingular: joinColumnOwnerObjectMetadata.nameSingular,
                        joinColumnName: (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
                            name: joinColumnOwnerFlatFieldMetadata.name
                        })
                    }
                ];
                if (relation.targetObjectMetadata.nameSingular === PERSON_OBJECT_NAME_SINGULAR) {
                    pathsToPerson.push(nextPath);
                    continue;
                }
                if (isSystemObjectMetadata(relation.targetObjectMetadata)) {
                    continue;
                }
                const targetObjectId = relation.targetObjectMetadata.id;
                if (!visitedObjectIds.has(targetObjectId)) {
                    objectIdsReachedThisDepth.add(targetObjectId);
                    nextFrontier.push({
                        objectId: targetObjectId,
                        path: nextPath
                    });
                }
            }
        }
        objectIdsReachedThisDepth.forEach((id)=>visitedObjectIds.add(id));
        frontier = nextFrontier;
    }
    return pathsToPerson;
};

//# sourceMappingURL=find-relation-paths-to-person.util.js.map