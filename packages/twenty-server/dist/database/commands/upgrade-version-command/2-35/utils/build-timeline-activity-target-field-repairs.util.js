"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildTimelineActivityTargetFieldRepairs", {
    enumerable: true,
    get: function() {
        return buildTimelineActivityTargetFieldRepairs;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getflatfieldsforflatobjectmetadatautil = require("../../../../../engine/api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _computemorphorrelationfieldjoincolumnnameutil = require("../../../../../engine/metadata-modules/field-metadata/utils/compute-morph-or-relation-field-join-column-name.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _findflatentitybyuniversalidentifierutil = require("../../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _findfieldrelatedindexutil = require("../../../../../engine/metadata-modules/flat-field-metadata/utils/find-field-related-index.util");
const _isflatfieldmetadataoftypeutil = require("../../../../../engine/metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
const _generateflatindexutil = require("../../../../../engine/metadata-modules/index-metadata/utils/generate-flat-index.util");
const EMPTY_REPAIRS = {
    flatFieldMetadatasToUpdate: [],
    flatIndexMetadatasToUpdate: [],
    unrepairableTargetFields: []
};
const collectRepairCandidates = ({ timelineActivityFlatFieldMetadatas, flatObjectMetadataMaps })=>timelineActivityFlatFieldMetadatas.flatMap((flatFieldMetadata)=>{
        if (!(0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(flatFieldMetadata, _types.FieldMetadataType.MORPH_RELATION) || flatFieldMetadata.morphId !== _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId || flatFieldMetadata.universalSettings.relationType !== _types.RelationType.MANY_TO_ONE || !(0, _utils.isDefined)(flatFieldMetadata.relationTargetObjectMetadataId)) {
            return [];
        }
        const targetFlatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityMaps: flatObjectMetadataMaps,
            flatEntityId: flatFieldMetadata.relationTargetObjectMetadataId
        });
        if (!(0, _utils.isDefined)(targetFlatObjectMetadata)) {
            return [];
        }
        const expectedName = `target${(0, _utils.capitalize)(targetFlatObjectMetadata.nameSingular)}`;
        if (flatFieldMetadata.name === expectedName) {
            return [];
        }
        return [
            {
                flatFieldMetadata,
                targetObjectNameSingular: targetFlatObjectMetadata.nameSingular,
                expectedName,
                expectedJoinColumnName: (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
                    name: expectedName
                })
            }
        ];
    });
const classifyPhysicalColumn = ({ repairCandidate, existingColumnNames })=>{
    const currentColumnName = (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
        name: repairCandidate.flatFieldMetadata.name
    });
    const hasCurrentColumn = existingColumnNames.has(currentColumnName);
    const hasExpectedColumn = existingColumnNames.has(repairCandidate.expectedJoinColumnName);
    if (hasCurrentColumn && !hasExpectedColumn) {
        return undefined;
    }
    if (!hasCurrentColumn && hasExpectedColumn) {
        return `column ${repairCandidate.expectedJoinColumnName} already exists while metadata still names it ${currentColumnName}; the rename path cannot apply a metadata-only fix`;
    }
    if (hasCurrentColumn && hasExpectedColumn) {
        return `columns ${currentColumnName} and ${repairCandidate.expectedJoinColumnName} both exist; renaming would collide`;
    }
    return `neither column ${currentColumnName} nor ${repairCandidate.expectedJoinColumnName} exists on the table`;
};
// One index can cover several repaired fields, so it is recomputed once against
// every accepted rename rather than once per field, which would emit the same
// index twice under two partially-renamed names.
const recomputeAffectedIndexes = ({ acceptedRepairCandidates, timelineActivityFlatObjectMetadata, timelineActivityFlatFieldMetadatas, flatIndexMaps })=>{
    const expectedNameByFieldId = new Map(acceptedRepairCandidates.map((repairCandidate)=>[
            repairCandidate.flatFieldMetadata.id,
            repairCandidate.expectedName
        ]));
    const optimisticFlatFieldMetadatas = timelineActivityFlatFieldMetadatas.map((flatFieldMetadata)=>{
        const expectedName = expectedNameByFieldId.get(flatFieldMetadata.id);
        return (0, _utils.isDefined)(expectedName) ? {
            ...flatFieldMetadata,
            name: expectedName
        } : flatFieldMetadata;
    });
    const affectedFlatIndexById = new Map();
    for (const repairCandidate of acceptedRepairCandidates){
        for (const flatIndexMetadata of (0, _findfieldrelatedindexutil.findFieldRelatedIndexes)({
            flatFieldMetadata: repairCandidate.flatFieldMetadata,
            flatObjectMetadata: timelineActivityFlatObjectMetadata,
            flatIndexMaps
        })){
            affectedFlatIndexById.set(flatIndexMetadata.id, flatIndexMetadata);
        }
    }
    return [
        ...affectedFlatIndexById.values()
    ].map((flatIndex)=>(0, _generateflatindexutil.generateFlatIndexMetadataWithNameOrThrow)({
            flatIndex,
            flatObjectMetadata: timelineActivityFlatObjectMetadata,
            objectFlatFieldMetadatas: optimisticFlatFieldMetadatas
        }));
};
const findMissingIndexMetadataIds = ({ timelineActivityFlatObjectMetadata, flatIndexMaps })=>timelineActivityFlatObjectMetadata.indexMetadataIds.filter((indexMetadataId)=>!(0, _utils.isDefined)((0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityMaps: flatIndexMaps,
            flatEntityId: indexMetadataId
        })));
const buildTimelineActivityTargetFieldRepairs = ({ flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps, existingColumnNames })=>{
    const timelineActivityFlatObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        flatEntityMaps: flatObjectMetadataMaps,
        universalIdentifier: _metadata.STANDARD_OBJECTS.timelineActivity.universalIdentifier
    });
    if (!(0, _utils.isDefined)(timelineActivityFlatObjectMetadata)) {
        return EMPTY_REPAIRS;
    }
    const timelineActivityFlatFieldMetadatas = (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(timelineActivityFlatObjectMetadata, flatFieldMetadataMaps);
    // A rename is judged only against the workspace as it stands, never against
    // the outcome of another rename in the same batch. Chains therefore stay
    // blocked rather than resolving differently depending on field order, which
    // is what the physical columns force anyway: the name a chain wants to move
    // into is still occupied by a column at the moment the batch is planned.
    const heldFieldNames = new Set(timelineActivityFlatFieldMetadatas.map(({ name })=>name));
    const { accepted, unrepairableTargetFields } = collectRepairCandidates({
        timelineActivityFlatFieldMetadatas,
        flatObjectMetadataMaps
    }).reduce((accumulator, repairCandidate)=>{
        const reason = heldFieldNames.has(repairCandidate.expectedName) ? `${repairCandidate.expectedName} is held by another field on timelineActivity that this command does not rename` : classifyPhysicalColumn({
            repairCandidate,
            existingColumnNames
        });
        if ((0, _utils.isDefined)(reason)) {
            accumulator.unrepairableTargetFields.push({
                fieldName: repairCandidate.flatFieldMetadata.name,
                expectedName: repairCandidate.expectedName,
                reason
            });
            return accumulator;
        }
        accumulator.accepted.push(repairCandidate);
        return accumulator;
    }, {
        accepted: [],
        unrepairableTargetFields: []
    });
    const missingIndexMetadataIds = findMissingIndexMetadataIds({
        timelineActivityFlatObjectMetadata,
        flatIndexMaps
    });
    if (accepted.length > 0 && missingIndexMetadataIds.length > 0) {
        return {
            flatFieldMetadatasToUpdate: [],
            flatIndexMetadatasToUpdate: [],
            unrepairableTargetFields: [
                ...unrepairableTargetFields,
                ...accepted.map(({ flatFieldMetadata, expectedName })=>({
                        fieldName: flatFieldMetadata.name,
                        expectedName,
                        reason: `timelineActivity references missing index metadata ${missingIndexMetadataIds.join(', ')}; index dependencies cannot be recomputed safely`
                    }))
            ]
        };
    }
    return {
        flatFieldMetadatasToUpdate: accepted.map(({ flatFieldMetadata, expectedName, expectedJoinColumnName, targetObjectNameSingular })=>({
                ...flatFieldMetadata,
                name: expectedName,
                label: flatFieldMetadata.isSystemSideEffect ? (0, _utils.capitalize)(targetObjectNameSingular) : flatFieldMetadata.label,
                universalSettings: {
                    ...flatFieldMetadata.universalSettings,
                    joinColumnName: expectedJoinColumnName
                }
            })),
        flatIndexMetadatasToUpdate: recomputeAffectedIndexes({
            acceptedRepairCandidates: accepted,
            timelineActivityFlatObjectMetadata,
            timelineActivityFlatFieldMetadatas,
            flatIndexMaps
        }),
        unrepairableTargetFields
    };
};

//# sourceMappingURL=build-timeline-activity-target-field-repairs.util.js.map