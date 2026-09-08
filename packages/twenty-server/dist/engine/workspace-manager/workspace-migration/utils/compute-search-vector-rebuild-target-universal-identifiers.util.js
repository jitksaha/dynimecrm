"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeSearchVectorRebuildTargetUniversalIdentifiers", {
    enumerable: true,
    get: function() {
        return computeSearchVectorRebuildTargetUniversalIdentifiers;
    }
});
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const computeSearchVectorRebuildTargetUniversalIdentifiers = ({ orchestratorActionsReport, fromFlatSearchFieldMetadataMaps, toFlatSearchFieldMetadataMaps, toFlatFieldMetadataMaps })=>{
    const searchFieldMetadataActions = orchestratorActionsReport.searchFieldMetadata;
    const emptyFlatSearchFieldMetadataMaps = {
        byUniversalIdentifier: {}
    };
    const renamedFieldSearchFieldMetadataUniversalIdentifiers = orchestratorActionsReport.fieldMetadata.update.filter((updateAction)=>(0, _utils.isDefined)(updateAction.update.name)).flatMap((updateAction)=>(0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: toFlatFieldMetadataMaps,
            universalIdentifier: updateAction.universalIdentifier
        })?.searchFieldMetadataUniversalIdentifiers ?? []);
    const candidateFieldMetadataVectorUniversalIdentifiers = new Set([
        ...searchFieldMetadataActions.create.map((createAction)=>createAction.flatEntity.tsVectorFieldMetadataUniversalIdentifier),
        ...searchFieldMetadataActions.update.map((updateAction)=>(0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: toFlatSearchFieldMetadataMaps,
                universalIdentifier: updateAction.universalIdentifier
            })?.tsVectorFieldMetadataUniversalIdentifier),
        ...searchFieldMetadataActions.delete.map((deleteAction)=>(0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: fromFlatSearchFieldMetadataMaps ?? emptyFlatSearchFieldMetadataMaps,
                universalIdentifier: deleteAction.universalIdentifier
            })?.tsVectorFieldMetadataUniversalIdentifier),
        ...renamedFieldSearchFieldMetadataUniversalIdentifiers.map((searchFieldMetadataUniversalIdentifier)=>(0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: toFlatSearchFieldMetadataMaps,
                universalIdentifier: searchFieldMetadataUniversalIdentifier
            })?.tsVectorFieldMetadataUniversalIdentifier)
    ].filter(_utils.isDefined));
    const fieldUniversalIdentifiersBeingCreatedOrDeleted = new Set([
        ...orchestratorActionsReport.fieldMetadata.create.map((createFieldAction)=>createFieldAction.flatEntity.universalIdentifier),
        ...orchestratorActionsReport.objectMetadata.create.flatMap((createObjectAction)=>createObjectAction.universalFlatFieldMetadatas.map((universalFlatFieldMetadata)=>universalFlatFieldMetadata.universalIdentifier)),
        ...orchestratorActionsReport.fieldMetadata.delete.map((deleteFieldAction)=>deleteFieldAction.universalIdentifier)
    ]);
    return new Set([
        ...candidateFieldMetadataVectorUniversalIdentifiers
    ].filter((vectorUniversalIdentifier)=>!fieldUniversalIdentifiersBeingCreatedOrDeleted.has(vectorUniversalIdentifier)));
};

//# sourceMappingURL=compute-search-vector-rebuild-target-universal-identifiers.util.js.map