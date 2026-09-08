"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FixStandardRelationFieldLabelsIconsCommand", {
    enumerable: true,
    get: function() {
        return FixStandardRelationFieldLabelsIconsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
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
// The default relation fields every object gets point to one of the default
// relation objects (note/task/attachment/timeline). On standard objects their
// labels/icons are system-owned, so we re-sync any drift against the
// source-of-truth definition (e.g. the Company timelineActivities
// IconIconTimelineEvent typo). Custom objects are left untouched on purpose:
// their relation fields are user-editable.
const DEFAULT_RELATION_TARGET_UNIVERSAL_IDENTIFIERS = new Set(_metadata.DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS.map((objectName)=>_metadata.STANDARD_OBJECTS[objectName].universalIdentifier));
let FixStandardRelationFieldLabelsIconsCommand = class FixStandardRelationFieldLabelsIconsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatFieldMetadataMaps: existingFlatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        const now = new Date().toISOString();
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now,
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const fieldsToUpdate = Object.values(standardAllFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((standardField)=>(0, _utils.isDefined)(standardField.relationTargetObjectMetadataUniversalIdentifier) && DEFAULT_RELATION_TARGET_UNIVERSAL_IDENTIFIERS.has(standardField.relationTargetObjectMetadataUniversalIdentifier)).map((standardField)=>{
            const existingField = existingFlatFieldMetadataMaps.byUniversalIdentifier[standardField.universalIdentifier];
            if (!(0, _utils.isDefined)(existingField) || existingField.label === standardField.label && existingField.icon === standardField.icon) {
                return undefined;
            }
            return {
                ...existingField,
                label: standardField.label,
                icon: standardField.icon,
                updatedAt: now
            };
        }).filter(_utils.isDefined);
        if (fieldsToUpdate.length === 0) {
            this.logger.log(`Standard relation field labels/icons already up to date for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Workspace ${workspaceId}: ${fieldsToUpdate.length} standard relation field(s) to heal`);
        if (isDryRun) {
            return;
        }
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: fieldsToUpdate
                }
            },
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            // These default relation fields are system-owned; mutating their
            // label/icon is only permitted under a system build.
            isSystemBuild: true
        });
        if (result.status === 'fail') {
            const failureDetails = Object.values(result.report).flat().map((failedValidation)=>{
                const errorMessages = failedValidation.errors.map((error)=>`${error.code}: ${error.message}`).join('; ');
                return `[${failedValidation.metadataName}] ${failedValidation.flatEntityMinimalInformation.universalIdentifier ?? failedValidation.flatEntityMinimalInformation.id ?? 'unknown'} -> ${errorMessages}`;
            }).join('\n');
            this.logger.error(`Migration build failed for workspace ${workspaceId} while healing standard relation field labels/icons:\n${failureDetails}`);
            throw new Error(`Migration failed for workspace ${workspaceId} while healing standard relation field labels/icons:\n${failureDetails}`);
        }
        this.logger.log(`Healed ${fieldsToUpdate.length} standard relation field(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceMigrationValidateBuildAndRunService, workspaceCacheService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService, this.workspaceCacheService = workspaceCacheService;
    }
};
FixStandardRelationFieldLabelsIconsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.14.0', 1799000040000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-14:fix-standard-relation-field-labels-icons',
        description: "Re-sync standard objects' default relation field labels/icons (note/task/attachment/timeline) against the source of truth, healing drift such as the Company timelineActivities IconIconTimelineEvent typo."
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], FixStandardRelationFieldLabelsIconsCommand);

//# sourceMappingURL=2-14-workspace-command-1799000040000-fix-standard-relation-field-labels-icons.command.js.map