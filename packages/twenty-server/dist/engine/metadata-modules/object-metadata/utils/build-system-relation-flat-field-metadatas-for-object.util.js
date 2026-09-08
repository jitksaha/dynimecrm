"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSystemRelationFlatFieldMetadatasForObject", {
    enumerable: true,
    get: function() {
        return buildSystemRelationFlatFieldMetadatasForObject;
    }
});
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _relationtypeinterface = require("../../field-metadata/interfaces/relation-type.interface");
const _computemorphorrelationfieldjoincolumnnameutil = require("../../field-metadata/utils/compute-morph-or-relation-field-join-column-name.util");
const _generatemorphorrelationflatfieldmetadatapairutil = require("../../flat-field-metadata/utils/generate-morph-or-relation-flat-field-metadata-pair.util");
const _standardrelationfieldpropertiesconstant = require("../constants/standard-relation-field-properties.constant");
const _i18nlabelutil = require("../../../workspace-manager/twenty-standard-application/utils/i18n-label.util");
const _standardobjecticons = require("../../../workspace-manager/workspace-migration/constant/standard-object-icons");
const MORPH_ID_BY_STANDARD_OBJECT_NAME_SINGULAR = {
    timelineActivity: _metadata.STANDARD_OBJECTS.timelineActivity.morphIds.targetMorphId.morphId,
    attachment: _metadata.STANDARD_OBJECTS.attachment.morphIds.targetMorphId.morphId,
    noteTarget: _metadata.STANDARD_OBJECTS.noteTarget.morphIds.targetMorphId.morphId,
    taskTarget: _metadata.STANDARD_OBJECTS.taskTarget.morphIds.targetMorphId.morphId
};
const buildSystemRelationFlatFieldMetadatasForObject = ({ sourceFlatObjectMetadata, standardTargetFlatObjectMetadataByNameSingular, applicationUniversalIdentifier })=>_metadata.DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS.map((standardObjectNameSingular)=>{
        const targetFlatObjectMetadata = standardTargetFlatObjectMetadataByNameSingular[standardObjectNameSingular];
        const reverseFieldName = `target${(0, _utils.capitalize)(sourceFlatObjectMetadata.nameSingular)}`;
        const joinColumnName = (0, _computemorphorrelationfieldjoincolumnnameutil.computeMorphOrRelationFieldJoinColumnName)({
            name: reverseFieldName
        });
        const morphId = MORPH_ID_BY_STANDARD_OBJECT_NAME_SINGULAR[standardObjectNameSingular];
        const standardFieldProperties = _standardrelationfieldpropertiesconstant.STANDARD_RELATION_FIELD_PROPERTIES_BY_RELATION_OBJECT[standardObjectNameSingular];
        const reverseFieldIcon = _standardobjecticons.STANDARD_OBJECT_ICONS[targetFlatObjectMetadata.nameSingular] ?? 'IconBuildingSkyscraper';
        const forwardFieldUniversalIdentifier = (0, _application.getSystemRelationFieldUniversalIdentifier)({
            applicationUniversalIdentifier,
            objectUniversalIdentifier: sourceFlatObjectMetadata.universalIdentifier,
            relationTargetObjectUniversalIdentifier: targetFlatObjectMetadata.universalIdentifier
        });
        const reverseFieldUniversalIdentifier = (0, _application.getSystemRelationFieldUniversalIdentifier)({
            applicationUniversalIdentifier,
            objectUniversalIdentifier: targetFlatObjectMetadata.universalIdentifier,
            relationTargetObjectUniversalIdentifier: sourceFlatObjectMetadata.universalIdentifier
        });
        const { flatFieldMetadatas, indexMetadatas } = (0, _generatemorphorrelationflatfieldmetadatapairutil.generateMorphOrRelationFlatFieldMetadataPair)({
            sourceFlatObjectMetadata,
            targetFlatObjectMetadata,
            targetFlatFieldMetadataType: _types.FieldMetadataType.MORPH_RELATION,
            applicationUniversalIdentifier,
            sourceFlatObjectMetadataJoinColumnName: joinColumnName,
            morphId,
            targetFieldName: reverseFieldName,
            sourceFieldUniversalIdentifier: forwardFieldUniversalIdentifier,
            targetFieldUniversalIdentifier: reverseFieldUniversalIdentifier,
            isSystemSideEffect: true,
            createFieldInput: {
                icon: standardFieldProperties.icon,
                type: _types.FieldMetadataType.RELATION,
                name: targetFlatObjectMetadata.namePlural,
                label: (0, _i18nlabelutil.i18nLabel)(standardFieldProperties.label),
                relationCreationPayload: {
                    targetObjectMetadataId: targetFlatObjectMetadata.universalIdentifier,
                    type: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    targetFieldLabel: (0, _utils.capitalize)(sourceFlatObjectMetadata.nameSingular),
                    targetFieldIcon: reverseFieldIcon
                }
            }
        });
        const [forwardFlatFieldMetadata, reverseFlatFieldMetadata] = flatFieldMetadatas;
        return {
            forwardFlatFieldMetadata,
            reverseFlatFieldMetadata,
            flatIndexMetadata: indexMetadatas[0]
        };
    });

//# sourceMappingURL=build-system-relation-flat-field-metadatas-for-object.util.js.map