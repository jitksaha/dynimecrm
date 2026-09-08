"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMissingObjectSystemRelationCandidates", {
    enumerable: true,
    get: function() {
        return buildMissingObjectSystemRelationCandidates;
    }
});
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getflatfieldsforflatobjectmetadatautil = require("../../../../../engine/api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _computemorphorrelationfieldjoincolumnnameutil = require("../../../../../engine/metadata-modules/field-metadata/utils/compute-morph-or-relation-field-join-column-name.util");
const buildMissingObjectSystemRelationCandidates = ({ flatObjectMetadataMaps, flatFieldMetadataMaps, holderFlatObjectMetadataByNameSingular, existingColumnNamesByHolderNameSingular, twentyStandardApplicationUniversalIdentifier })=>{
    const holderContexts = _metadata.DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS.map((holderNameSingular)=>{
        const holderFlatObjectMetadata = holderFlatObjectMetadataByNameSingular[holderNameSingular];
        const holderFlatFieldMetadatas = (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(holderFlatObjectMetadata, flatFieldMetadataMaps);
        return {
            holderNameSingular,
            holderFlatObjectMetadata,
            holderFieldNames: new Set(holderFlatFieldMetadatas.map(({ name })=>name)),
            morphTargetObjectMetadataIds: new Set(holderFlatFieldMetadatas.filter((flatFieldMetadata)=>flatFieldMetadata.type === _types.FieldMetadataType.MORPH_RELATION && flatFieldMetadata.morphId === _metadata.STANDARD_OBJECTS[holderNameSingular].morphIds.targetMorphId.morphId).map((flatFieldMetadata)=>flatFieldMetadata.relationTargetObjectMetadataId).filter(_utils.isDefined)),
            existingColumnNames: existingColumnNamesByHolderNameSingular[holderNameSingular]
        };
    });
    const candidates = [];
    const unprovisionableSystemRelations = [];
    for (const sourceFlatObjectMetadata of Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined)){
        if (sourceFlatObjectMetadata.applicationUniversalIdentifier === twentyStandardApplicationUniversalIdentifier) {
            continue;
        }
        const sourceFlatFieldMetadatas = (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(sourceFlatObjectMetadata, flatFieldMetadataMaps);
        const sourceFieldNames = new Set(sourceFlatFieldMetadatas.map(({ name })=>name));
        const missingHolderNameSingulars = [];
        for (const holderContext of holderContexts){
            const { holderNameSingular, holderFlatObjectMetadata } = holderContext;
            const pushUnprovisionable = (reason)=>unprovisionableSystemRelations.push({
                    sourceObjectNameSingular: sourceFlatObjectMetadata.nameSingular,
                    holderNameSingular,
                    reason
                });
            const reverseFieldUniversalIdentifier = (0, _application.getSystemRelationFieldUniversalIdentifier)({
                applicationUniversalIdentifier: sourceFlatObjectMetadata.applicationUniversalIdentifier,
                objectUniversalIdentifier: holderFlatObjectMetadata.universalIdentifier,
                relationTargetObjectUniversalIdentifier: sourceFlatObjectMetadata.universalIdentifier
            });
            const forwardFieldUniversalIdentifier = (0, _application.getSystemRelationFieldUniversalIdentifier)({
                applicationUniversalIdentifier: sourceFlatObjectMetadata.applicationUniversalIdentifier,
                objectUniversalIdentifier: sourceFlatObjectMetadata.universalIdentifier,
                relationTargetObjectUniversalIdentifier: holderFlatObjectMetadata.universalIdentifier
            });
            const reverseFieldExists = (0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[reverseFieldUniversalIdentifier]) || holderContext.morphTargetObjectMetadataIds.has(sourceFlatObjectMetadata.id);
            const forwardFieldExists = (0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[forwardFieldUniversalIdentifier]) || sourceFlatFieldMetadatas.some((flatFieldMetadata)=>flatFieldMetadata.type === _types.FieldMetadataType.RELATION && flatFieldMetadata.name === holderFlatObjectMetadata.namePlural && flatFieldMetadata.relationTargetObjectMetadataId === holderFlatObjectMetadata.id);
            if (reverseFieldExists && forwardFieldExists) {
                continue;
            }
            if (reverseFieldExists || forwardFieldExists) {
                pushUnprovisionable(`only the ${reverseFieldExists ? 'reverse morph' : 'forward relation'} leg of the pair exists; a partial pair cannot be completed automatically`);
                continue;
            }
            const reverseFieldName = `target${(0, _utils.capitalize)(sourceFlatObjectMetadata.nameSingular)}`;
            if (holderContext.holderFieldNames.has(reverseFieldName)) {
                pushUnprovisionable(`field "${reverseFieldName}" already exists on ${holderNameSingular}`);
                continue;
            }
            const forwardFieldName = holderFlatObjectMetadata.namePlural;
            if (sourceFieldNames.has(forwardFieldName)) {
                pushUnprovisionable(`field "${forwardFieldName}" already exists on ${sourceFlatObjectMetadata.nameSingular}`);
                continue;
            }
            const joinColumnName = (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
                name: reverseFieldName
            });
            if (holderContext.existingColumnNames.has(joinColumnName)) {
                pushUnprovisionable(`column "${joinColumnName}" already exists on the ${holderNameSingular} table`);
                continue;
            }
            missingHolderNameSingulars.push(holderNameSingular);
        }
        if (missingHolderNameSingulars.length > 0) {
            candidates.push({
                sourceFlatObjectMetadata,
                missingHolderNameSingulars
            });
        }
    }
    return {
        candidates,
        unprovisionableSystemRelations
    };
};

//# sourceMappingURL=build-missing-object-system-relation-candidates.util.js.map