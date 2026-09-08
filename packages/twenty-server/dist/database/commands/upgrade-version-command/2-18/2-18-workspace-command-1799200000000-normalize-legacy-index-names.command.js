"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NormalizeLegacyIndexNamesCommand", {
    enumerable: true,
    get: function() {
        return NormalizeLegacyIndexNamesCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _areindexdefinitionsequivalentutil = require("./utils/are-index-definitions-equivalent.util");
const _doesphysicalindexexistutil = require("./utils/does-physical-index-exist.util");
const _getphysicalindexdefinitionutil = require("./utils/get-physical-index-definition.util");
const _planindexnamenormalizationutil = require("./utils/plan-index-name-normalization.util");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-universal-identifier-in-universal-flat-entity-maps-or-throw.util");
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _generateflatindexutil = require("../../../../engine/metadata-modules/index-metadata/utils/generate-flat-index.util");
const _workspaceschemamanagerservice = require("../../../../engine/twenty-orm/workspace-schema-manager/workspace-schema-manager.service");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
const _indexactionhandlerutils = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/action-handlers/index/utils/index-action-handler.utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let NormalizeLegacyIndexNamesCommand = class NormalizeLegacyIndexNamesCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.log(`No data source for workspace ${workspaceId}, skipping`);
            return;
        }
        const operations = await this.computeIndexNameNormalizationOperations(workspaceId);
        if (operations.length === 0) {
            this.logger.log(`No legacy index names to normalize for workspace ${workspaceId}, skipping`);
            return;
        }
        if (options.dryRun) {
            for (const operation of operations){
                if (operation.type === 'rename') {
                    this.logger.log(`[DRY RUN] Would rename index ${operation.fromName} -> ${operation.toName} (workspace ${workspaceId})`);
                } else {
                    this.logger.log(`[DRY RUN] Would drop redundant duplicate index ${operation.redundantName} (kept ${operation.keptName}) (workspace ${workspaceId})`);
                }
            }
            return;
        }
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const queryRunner = dataSource.createQueryRunner();
        let isQueryRunnerConnected = false;
        let isTransactionStarted = false;
        try {
            await queryRunner.connect();
            isQueryRunnerConnected = true;
            await queryRunner.startTransaction();
            isTransactionStarted = true;
            for (const [operationIndex, operation] of operations.entries()){
                const savepointName = `index_name_normalization_${operationIndex}`;
                await queryRunner.query(`SAVEPOINT "${savepointName}"`);
                try {
                    await this.applyIndexNameNormalizationOperation({
                        queryRunner,
                        schemaName,
                        operation,
                        workspaceId
                    });
                    await queryRunner.query(`RELEASE SAVEPOINT "${savepointName}"`);
                } catch (error) {
                    await queryRunner.query(`ROLLBACK TO SAVEPOINT "${savepointName}"`);
                    this.logger.warn(`Skipping index name normalization for ${operation.type === 'rename' ? operation.fromName : operation.redundantName} in workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            if (isTransactionStarted) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        } finally{
            if (isQueryRunnerConnected) {
                await queryRunner.release();
            }
        }
        const indexRelatedFlatMapsKeys = [
            ...new Set([
                'index',
                ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('index')
            ].map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey))
        ];
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, indexRelatedFlatMapsKeys);
    }
    async computeIndexNameNormalizationOperations(workspaceId) {
        const { flatIndexMaps, flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatIndexMaps',
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]);
        const indexStatuses = [];
        for (const flatObjectMetadata of Object.values(flatObjectMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatObjectMetadata)) {
                continue;
            }
            const objectIndexes = (0, _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil.findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMapsOrThrow)({
                flatEntityMaps: flatIndexMaps,
                universalIdentifiers: flatObjectMetadata.indexMetadataUniversalIdentifiers
            });
            if (objectIndexes.length === 0) {
                continue;
            }
            const objectFlatFieldMetadatas = (0, _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil.findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMapsOrThrow)({
                flatEntityMaps: flatFieldMetadataMaps,
                universalIdentifiers: flatObjectMetadata.fieldUniversalIdentifiers
            });
            for (const flatIndex of objectIndexes){
                try {
                    const expectedName = (0, _generateflatindexutil.generateFlatIndexMetadataWithNameOrThrow)({
                        flatObjectMetadata,
                        objectFlatFieldMetadatas,
                        flatIndex
                    }).name;
                    indexStatuses.push({
                        indexMetadataId: flatIndex.id,
                        objectMetadataId: flatIndex.objectMetadataId,
                        currentName: flatIndex.name,
                        expectedName
                    });
                } catch (error) {
                    this.logger.warn(`Could not recompute expected name for index ${flatIndex.name} (${flatIndex.id}) in workspace ${workspaceId}, skipping: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
        return (0, _planindexnamenormalizationutil.planIndexNameNormalization)(indexStatuses);
    }
    async applyIndexNameNormalizationOperation({ queryRunner, schemaName, operation, workspaceId }) {
        if (operation.type === 'rename') {
            const targetIndexExists = await (0, _doesphysicalindexexistutil.doesPhysicalIndexExist)({
                queryRunner,
                schemaName,
                indexName: operation.toName
            });
            if (targetIndexExists) {
                await this.reconcileRenameWithExistingTargetIndex({
                    queryRunner,
                    schemaName,
                    operation,
                    workspaceId
                });
            } else {
                await this.renameIndexToExpectedName({
                    queryRunner,
                    schemaName,
                    operation,
                    workspaceId
                });
            }
            await queryRunner.query(`UPDATE "core"."indexMetadata"
            SET "name" = $1
          WHERE "id" = $2
            AND "workspaceId" = $3`, [
                operation.toName,
                operation.indexMetadataId,
                workspaceId
            ]);
        } else {
            await (0, _indexactionhandlerutils.dropIndexFromWorkspaceSchema)({
                indexName: operation.redundantName,
                workspaceSchemaManagerService: this.workspaceSchemaManagerService,
                queryRunner,
                schemaName
            });
            await (0, _indexactionhandlerutils.deleteIndexMetadata)({
                entityId: operation.indexMetadataId,
                queryRunner,
                workspaceId
            });
            this.logger.log(`Dropped redundant duplicate index ${operation.redundantName} (kept ${operation.keptName}) (workspace ${workspaceId})`);
        }
    }
    // Target index already exists physically: the legacy index cannot be
    // renamed onto it. Metadata stops referencing the legacy index, so nothing
    // would ever clean it up: drop it when it is a true duplicate of the
    // target, keep it only when the definitions differ.
    async reconcileRenameWithExistingTargetIndex({ queryRunner, schemaName, operation, workspaceId }) {
        const sourceIndexExists = await (0, _doesphysicalindexexistutil.doesPhysicalIndexExist)({
            queryRunner,
            schemaName,
            indexName: operation.fromName
        });
        if (!sourceIndexExists) {
            this.logger.log(`Index already physically named ${operation.toName}, reconciling metadata only (was ${operation.fromName}) (workspace ${workspaceId})`);
            return;
        }
        const sourceIndexDefinition = await (0, _getphysicalindexdefinitionutil.getPhysicalIndexDefinition)({
            queryRunner,
            schemaName,
            indexName: operation.fromName
        });
        const targetIndexDefinition = await (0, _getphysicalindexdefinitionutil.getPhysicalIndexDefinition)({
            queryRunner,
            schemaName,
            indexName: operation.toName
        });
        if ((0, _utils.isDefined)(sourceIndexDefinition) && (0, _utils.isDefined)(targetIndexDefinition) && (0, _areindexdefinitionsequivalentutil.areIndexDefinitionsEquivalent)({
            indexDefinitionA: sourceIndexDefinition,
            indexDefinitionB: targetIndexDefinition
        })) {
            await this.workspaceSchemaManagerService.indexManager.dropIndex({
                queryRunner,
                schemaName,
                indexName: operation.fromName
            });
            this.logger.log(`Dropped duplicate legacy index ${operation.fromName} (identical definition already exists as ${operation.toName}) (workspace ${workspaceId})`);
        } else {
            this.logger.warn(`Index ${operation.toName} already exists physically alongside ${operation.fromName} with a different definition; leaving ${operation.fromName} in place and pointing metadata at ${operation.toName} (workspace ${workspaceId})`);
        }
    }
    // Target index does not exist physically: rename the legacy index in place
    // when present, otherwise only the metadata name will be updated so a
    // future rebuild uses the expected name.
    async renameIndexToExpectedName({ queryRunner, schemaName, operation, workspaceId }) {
        const sourceIndexExists = await (0, _doesphysicalindexexistutil.doesPhysicalIndexExist)({
            queryRunner,
            schemaName,
            indexName: operation.fromName
        });
        if (!sourceIndexExists) {
            this.logger.warn(`Neither ${operation.fromName} nor ${operation.toName} exists physically; updating metadata name so a future rebuild uses the expected name (workspace ${workspaceId})`);
            return;
        }
        await this.workspaceSchemaManagerService.indexManager.renameIndexWithoutRebuild({
            queryRunner,
            schemaName,
            fromIndexName: operation.fromName,
            toIndexName: operation.toName
        });
        this.logger.log(`Renamed index ${operation.fromName} -> ${operation.toName} (workspace ${workspaceId})`);
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceSchemaManagerService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceSchemaManagerService = workspaceSchemaManagerService;
    }
};
NormalizeLegacyIndexNamesCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.18.0', 1799200000000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-18:normalize-legacy-index-names',
        description: 'Rename indexes whose stored name predates the v2 deterministic naming convention to their recomputed name, and drop redundant duplicates.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspaceschemamanagerservice.WorkspaceSchemaManagerService === "undefined" ? Object : _workspaceschemamanagerservice.WorkspaceSchemaManagerService
    ])
], NormalizeLegacyIndexNamesCommand);

//# sourceMappingURL=2-18-workspace-command-1799200000000-normalize-legacy-index-names.command.js.map