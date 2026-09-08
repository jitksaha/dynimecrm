"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RestoreStandardDefaultRelationFieldsCommand", {
    enumerable: true,
    get: function() {
        return RestoreStandardDefaultRelationFieldsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const DEFAULT_RELATION_TARGET_MORPH_IDS = new Set(_metadata.DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS.map((standardObjectNameSingular)=>_metadata.STANDARD_OBJECTS[standardObjectNameSingular].morphIds.targetMorphId.morphId));
const computeQualifiedFieldName = ({ flatFieldMetadata, standardFlatObjectMetadataMaps })=>{
    const hostObjectNameSingular = standardFlatObjectMetadataMaps.byUniversalIdentifier[flatFieldMetadata.objectMetadataUniversalIdentifier]?.nameSingular ?? flatFieldMetadata.objectMetadataUniversalIdentifier;
    return `${hostObjectNameSingular}.${flatFieldMetadata.name}`;
};
let RestoreStandardDefaultRelationFieldsCommand = class RestoreStandardDefaultRelationFieldsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatFieldMetadataMaps: existingFlatFieldMetadataMaps, flatIndexMaps: existingFlatIndexMaps, flatObjectMetadataMaps: existingFlatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatIndexMaps',
            'flatObjectMetadataMaps'
        ]);
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const takenFieldNamesByObject = new Map();
        for (const existingFlatFieldMetadata of Object.values(existingFlatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined)){
            const takenFieldNames = takenFieldNamesByObject.get(existingFlatFieldMetadata.objectMetadataUniversalIdentifier) ?? new Set();
            takenFieldNames.add(existingFlatFieldMetadata.name);
            takenFieldNamesByObject.set(existingFlatFieldMetadata.objectMetadataUniversalIdentifier, takenFieldNames);
        }
        const standardDefaultRelationLegs = Object.values(standardAllFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((standardFlatFieldMetadata)=>standardFlatFieldMetadata.type === _types.FieldMetadataType.MORPH_RELATION && (0, _utils.isDefined)(standardFlatFieldMetadata.morphId) && DEFAULT_RELATION_TARGET_MORPH_IDS.has(standardFlatFieldMetadata.morphId));
        const fieldsToCreate = [];
        const skippedPairLabels = [];
        for (const standardDefaultRelationLeg of standardDefaultRelationLegs){
            const standardForwardFlatFieldMetadata = (0, _utils.isDefined)(standardDefaultRelationLeg.relationTargetFieldMetadataUniversalIdentifier) ? standardAllFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[standardDefaultRelationLeg.relationTargetFieldMetadataUniversalIdentifier] : undefined;
            if (!(0, _utils.isDefined)(standardForwardFlatFieldMetadata)) {
                continue;
            }
            const standardPairMembers = [
                standardDefaultRelationLeg,
                standardForwardFlatFieldMetadata
            ];
            const missingPairMembers = standardPairMembers.filter((standardFlatFieldMetadata)=>!(0, _utils.isDefined)(existingFlatFieldMetadataMaps.byUniversalIdentifier[standardFlatFieldMetadata.universalIdentifier]));
            if (missingPairMembers.length === 0) {
                continue;
            }
            const pairHasSurvivingMember = missingPairMembers.length < standardPairMembers.length;
            const pairIsBlocked = missingPairMembers.some((standardFlatFieldMetadata)=>{
                const hostObjectExists = (0, _utils.isDefined)((0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                    flatEntityMaps: existingFlatObjectMetadataMaps,
                    universalIdentifier: standardFlatFieldMetadata.objectMetadataUniversalIdentifier
                }));
                const fieldNameIsTaken = takenFieldNamesByObject.get(standardFlatFieldMetadata.objectMetadataUniversalIdentifier)?.has(standardFlatFieldMetadata.name) === true;
                return !hostObjectExists || fieldNameIsTaken;
            });
            if (pairHasSurvivingMember || pairIsBlocked) {
                skippedPairLabels.push(standardPairMembers.map((standardFlatFieldMetadata)=>computeQualifiedFieldName({
                        flatFieldMetadata: standardFlatFieldMetadata,
                        standardFlatObjectMetadataMaps: standardAllFlatEntityMaps.flatObjectMetadataMaps
                    })).join(' / '));
                continue;
            }
            fieldsToCreate.push(...missingPairMembers);
        }
        const availableFieldUniversalIdentifiers = new Set([
            ...Object.keys(existingFlatFieldMetadataMaps.byUniversalIdentifier),
            ...fieldsToCreate.map(({ universalIdentifier })=>universalIdentifier)
        ]);
        const createdFieldUniversalIdentifiers = new Set(fieldsToCreate.map(({ universalIdentifier })=>universalIdentifier));
        const indexesToCreate = Object.values(standardAllFlatEntityMaps.flatIndexMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((standardFlatIndexMetadata)=>{
            const indexIsMissing = !(0, _utils.isDefined)(existingFlatIndexMaps.byUniversalIdentifier[standardFlatIndexMetadata.universalIdentifier]);
            const indexReferencesARestoredField = standardFlatIndexMetadata.universalFlatIndexFieldMetadatas.some((universalFlatIndexFieldMetadata)=>createdFieldUniversalIdentifiers.has(universalFlatIndexFieldMetadata.fieldMetadataUniversalIdentifier));
            const allIndexFieldsExistOrAreRestored = standardFlatIndexMetadata.universalFlatIndexFieldMetadatas.every((universalFlatIndexFieldMetadata)=>availableFieldUniversalIdentifiers.has(universalFlatIndexFieldMetadata.fieldMetadataUniversalIdentifier));
            return indexIsMissing && indexReferencesARestoredField && allIndexFieldsExistOrAreRestored;
        });
        if (skippedPairLabels.length > 0) {
            this.logger.warn(`Skipped ${skippedPairLabels.length} unrestorable standard default-relation pair(s) for workspace ${workspaceId}: ${skippedPairLabels.join(', ')}`);
        }
        if (fieldsToCreate.length === 0) {
            if (skippedPairLabels.length === 0) {
                this.logger.log(`Standard default-relation fields are complete for workspace ${workspaceId}, skipping`);
            }
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Restoring ${fieldsToCreate.length} standard default-relation field(s) and ${indexesToCreate.length} index(es) for workspace ${workspaceId}`);
        if (isDryRun) {
            return;
        }
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            workspaceId,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: fieldsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                index: {
                    flatEntityToCreate: indexesToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new Error(`Failed to restore standard default-relation fields for workspace ${workspaceId}: ${JSON.stringify(validateAndBuildResult, null, 2)}`);
        }
        this.logger.log(`Restored ${fieldsToCreate.length} standard default-relation field(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
RestoreStandardDefaultRelationFieldsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.35.0', 1787582101000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-35:restore-standard-default-relation-fields',
        description: 'Recreate the standard default-relation pairs (target* morph legs on attachment/noteTarget/taskTarget/timelineActivity and their forward relation fields) that were deleted from some workspaces by pre-2.20 application syncs, along with their join-column indexes. No-op on healthy workspaces.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], RestoreStandardDefaultRelationFieldsCommand);

//# sourceMappingURL=2-35-workspace-command-1787582101000-restore-standard-default-relation-fields.command.js.map