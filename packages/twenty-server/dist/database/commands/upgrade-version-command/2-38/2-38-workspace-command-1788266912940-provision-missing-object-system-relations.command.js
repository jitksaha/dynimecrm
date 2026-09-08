"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProvisionMissingObjectSystemRelationsCommand", {
    enumerable: true,
    get: function() {
        return ProvisionMissingObjectSystemRelationsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildmissingobjectsystemrelationcandidatesutil = require("./utils/build-missing-object-system-relation-candidates.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _buildsystemrelationflatfieldmetadatasforobjectutil = require("../../../../engine/metadata-modules/object-metadata/utils/build-system-relation-flat-field-metadatas-for-object.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
const _getworkspaceschemacontextformigrationutil = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/get-workspace-schema-context-for-migration.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ProvisionMissingObjectSystemRelationsCommand = class ProvisionMissingObjectSystemRelationsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatIndexMaps'
        ]);
        const holderFlatObjectMetadataByNameSingular = {};
        for (const holderNameSingular of _metadata.DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS){
            const holderFlatObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: flatObjectMetadataMaps,
                universalIdentifier: _metadata.STANDARD_OBJECTS[holderNameSingular].universalIdentifier
            });
            if (!(0, _utils.isDefined)(holderFlatObjectMetadata)) {
                this.logger.log(`Standard object ${holderNameSingular} does not exist for workspace ${workspaceId}, skipping`);
                return;
            }
            holderFlatObjectMetadataByNameSingular[holderNameSingular] = holderFlatObjectMetadata;
        }
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.error(`Cannot verify system relation columns for workspace ${workspaceId}: no data source. Skipping, rerun once the workspace is reachable.`);
            return;
        }
        const existingColumnNamesByHolderNameSingular = await this.readExistingColumnNamesByHolder({
            dataSource,
            workspaceId,
            holderFlatObjectMetadataByNameSingular
        });
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { candidates, unprovisionableSystemRelations } = (0, _buildmissingobjectsystemrelationcandidatesutil.buildMissingObjectSystemRelationCandidates)({
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            holderFlatObjectMetadataByNameSingular,
            existingColumnNamesByHolderNameSingular,
            twentyStandardApplicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        if (unprovisionableSystemRelations.length > 0) {
            this.logger.error([
                `MANUAL REPAIR REQUIRED: ${unprovisionableSystemRelations.length} system relation(s) in workspace ${workspaceId} cannot be provisioned automatically:`,
                ...unprovisionableSystemRelations.map(({ sourceObjectNameSingular, holderNameSingular, reason })=>`  - ${sourceObjectNameSingular} <-> ${holderNameSingular}: ${reason}`)
            ].join('\n'));
        }
        if (candidates.length === 0) {
            if (unprovisionableSystemRelations.length === 0) {
                this.logger.log(`Object system relations are complete for workspace ${workspaceId}, skipping`);
            }
            return;
        }
        const totalPairCount = candidates.reduce((count, candidate)=>count + candidate.missingHolderNameSingulars.length, 0);
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Provisioning ${totalPairCount} missing system relation pair(s) across ${candidates.length} object(s) for workspace ${workspaceId}: ${candidates.map(({ sourceFlatObjectMetadata, missingHolderNameSingulars })=>`${sourceFlatObjectMetadata.nameSingular} (${missingHolderNameSingulars.join(', ')})`).join('; ')}`);
        if (isDryRun) {
            return;
        }
        const candidatesByApplicationUniversalIdentifier = new Map();
        for (const candidate of candidates){
            const { applicationUniversalIdentifier } = candidate.sourceFlatObjectMetadata;
            const existing = candidatesByApplicationUniversalIdentifier.get(applicationUniversalIdentifier) ?? [];
            existing.push(candidate);
            candidatesByApplicationUniversalIdentifier.set(applicationUniversalIdentifier, existing);
        }
        for (const [applicationUniversalIdentifier, applicationCandidates] of candidatesByApplicationUniversalIdentifier){
            const bundlesToCreate = applicationCandidates.flatMap((candidate)=>this.buildBundlesForCandidate({
                    candidate,
                    holderFlatObjectMetadataByNameSingular
                }));
            const indexesToCreate = bundlesToCreate.map(({ flatIndexMetadata })=>flatIndexMetadata).filter((flatIndexMetadata)=>!(0, _utils.isDefined)(flatIndexMaps.byUniversalIdentifier[flatIndexMetadata.universalIdentifier]));
            const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
                isSystemBuild: true,
                workspaceId,
                applicationUniversalIdentifier,
                allFlatEntityOperationByMetadataName: {
                    fieldMetadata: {
                        flatEntityToCreate: bundlesToCreate.flatMap(({ forwardFlatFieldMetadata, reverseFlatFieldMetadata })=>[
                                forwardFlatFieldMetadata,
                                reverseFlatFieldMetadata
                            ]),
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
            if (result.status === 'fail') {
                throw new Error(`Failed to provision system relations for application ${applicationUniversalIdentifier} in workspace ${workspaceId}:\n${JSON.stringify(result, null, 2)}`);
            }
        }
        this.logger.log(`Provisioned ${totalPairCount} system relation pair(s) for workspace ${workspaceId}`);
    }
    buildBundlesForCandidate({ candidate, holderFlatObjectMetadataByNameSingular }) {
        const allBundles = (0, _buildsystemrelationflatfieldmetadatasforobjectutil.buildSystemRelationFlatFieldMetadatasForObject)({
            sourceFlatObjectMetadata: candidate.sourceFlatObjectMetadata,
            standardTargetFlatObjectMetadataByNameSingular: holderFlatObjectMetadataByNameSingular,
            applicationUniversalIdentifier: candidate.sourceFlatObjectMetadata.applicationUniversalIdentifier
        });
        const missingHolderUniversalIdentifiers = new Set(candidate.missingHolderNameSingulars.map((holderNameSingular)=>holderFlatObjectMetadataByNameSingular[holderNameSingular].universalIdentifier));
        return allBundles.filter(({ reverseFlatFieldMetadata })=>missingHolderUniversalIdentifiers.has(reverseFlatFieldMetadata.objectMetadataUniversalIdentifier));
    }
    async readExistingColumnNamesByHolder({ dataSource, workspaceId, holderFlatObjectMetadataByNameSingular }) {
        const existingColumnNamesByHolderNameSingular = {};
        for (const holderNameSingular of _metadata.DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS){
            const { schemaName, tableName } = (0, _getworkspaceschemacontextformigrationutil.getWorkspaceSchemaContextForMigration)({
                workspaceId,
                objectMetadata: holderFlatObjectMetadataByNameSingular[holderNameSingular]
            });
            const rows = await dataSource.query(`SELECT column_name FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2`, [
                schemaName,
                tableName
            ]);
            existingColumnNamesByHolderNameSingular[holderNameSingular] = new Set(rows.map(({ column_name })=>column_name));
        }
        return existingColumnNamesByHolderNameSingular;
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
ProvisionMissingObjectSystemRelationsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1788266912940),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:provision-missing-object-system-relations',
        description: 'Provision the default system-relation pairs (forward relation field on the object, target* morph leg on timelineActivity/attachment/noteTarget/taskTarget, join-column index) for non-standard objects that lost them, typically to pre-2.20 application syncs. The 2-35 restore command only recreated the pairs twenty-standard authors for its own objects; pairs of custom or app-installed objects were never restored, so runtime writes deriving the join column from the object name throw UNKNOWN_COLUMN on every event (Sentry TWENTY-SERVER-JRV). Mints exactly what the objectSystemRelationsOnCreate handler mints at object creation, only for pairs where both legs are absent, and reports pairs it cannot complete safely (partial pair, taken field name, surviving physical column) instead of guessing.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], ProvisionMissingObjectSystemRelationsCommand);

//# sourceMappingURL=2-38-workspace-command-1788266912940-provision-missing-object-system-relations.command.js.map