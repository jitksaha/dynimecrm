"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillCompanyPersonImageIdentifierFieldMetadataIdCommand", {
    enumerable: true,
    get: function() {
        return BackfillCompanyPersonImageIdentifierFieldMetadataIdCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
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
const IMAGE_IDENTIFIER_BACKFILL_TARGETS = [
    {
        objectNameForLog: 'company',
        objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.company.universalIdentifier,
        fieldNameForLog: 'domainName',
        fieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.company.fields.domainName.universalIdentifier,
        deprecatedFieldUniversalIdentifier: undefined
    },
    {
        objectNameForLog: 'person',
        objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.person.universalIdentifier,
        fieldNameForLog: 'avatarFile',
        fieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.person.fields.avatarFile.universalIdentifier,
        deprecatedFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.person.fields.avatarUrl.universalIdentifier
    }
];
let BackfillCompanyPersonImageIdentifierFieldMetadataIdCommand = class BackfillCompanyPersonImageIdentifierFieldMetadataIdCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]);
        const flatObjectMetadataToUpdate = [];
        for (const target of IMAGE_IDENTIFIER_BACKFILL_TARGETS){
            const existingObject = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: flatObjectMetadataMaps,
                universalIdentifier: target.objectUniversalIdentifier
            });
            if (!(0, _utils.isDefined)(existingObject)) {
                this.logger.log(`${target.objectNameForLog} object not found for workspace ${workspaceId}, skipping`);
                continue;
            }
            const currentIdentifier = existingObject.imageIdentifierFieldMetadataUniversalIdentifier;
            // Backfill when unset, or when it still points to the deprecated field
            // (e.g. person.avatarUrl). Never clobber a real user customization.
            const isBackfillable = !(0, _utils.isDefined)(currentIdentifier) || currentIdentifier === target.deprecatedFieldUniversalIdentifier;
            if (!isBackfillable) {
                this.logger.log(`imageIdentifierFieldMetadataId already set on ${target.objectNameForLog} for workspace ${workspaceId}, skipping`);
                continue;
            }
            const existingField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: flatFieldMetadataMaps,
                universalIdentifier: target.fieldUniversalIdentifier
            });
            if (!(0, _utils.isDefined)(existingField)) {
                this.logger.log(`${target.fieldNameForLog} field not found on ${target.objectNameForLog} for workspace ${workspaceId}, skipping`);
                continue;
            }
            flatObjectMetadataToUpdate.push({
                ...existingObject,
                imageIdentifierFieldMetadataUniversalIdentifier: target.fieldUniversalIdentifier
            });
        }
        if (flatObjectMetadataToUpdate.length === 0) {
            this.logger.log(`Nothing to backfill for workspace ${workspaceId}, skipping`);
            return;
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would backfill imageIdentifierFieldMetadataId on ${flatObjectMetadataToUpdate.map((flatObjectMetadata)=>flatObjectMetadata.nameSingular).join(', ')} for workspace ${workspaceId}`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                objectMetadata: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: flatObjectMetadataToUpdate
                }
            },
            workspaceId,
            isSystemBuild: true,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to backfill imageIdentifierFieldMetadataId for workspace ${workspaceId}:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to backfill imageIdentifierFieldMetadataId for workspace ${workspaceId}`);
        }
        this.logger.log(`Backfilled imageIdentifierFieldMetadataId on ${flatObjectMetadataToUpdate.map((flatObjectMetadata)=>flatObjectMetadata.nameSingular).join(', ')} for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
BackfillCompanyPersonImageIdentifierFieldMetadataIdCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.22.0', 1783959648000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-22:backfill-company-person-image-identifier-field-metadata-id',
        description: 'Backfill imageIdentifierFieldMetadataId on company (domainName) and person (avatarFile) for existing workspaces.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], BackfillCompanyPersonImageIdentifierFieldMetadataIdCommand);

//# sourceMappingURL=2-22-workspace-command-1783959648000-backfill-company-person-image-identifier-field-metadata-id.command.js.map