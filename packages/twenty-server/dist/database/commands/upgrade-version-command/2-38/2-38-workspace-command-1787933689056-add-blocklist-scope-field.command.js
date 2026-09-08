"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddBlocklistScopeFieldCommand", {
    enumerable: true,
    get: function() {
        return AddBlocklistScopeFieldCommand;
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
const _workspaceschemamanagerservice = require("../../../../engine/twenty-orm/workspace-schema-manager/workspace-schema-manager.service");
const _computetablenameutil = require("../../../../engine/utils/compute-table-name.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
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
const BLOCKLIST = _metadata.STANDARD_OBJECTS.blocklist;
const SCOPE_FIELD_UNIVERSAL_IDENTIFIER = BLOCKLIST.fields.scope.universalIdentifier;
const WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER = BLOCKLIST.fields.workspaceMember.universalIdentifier;
const BLOCKLIST_OBJECT_NAME_SINGULAR = 'blocklist';
const WORKSPACE_MEMBER_TABLE_NAME = 'workspaceMember';
const WORKSPACE_MEMBER_COLUMN_NAME = 'workspaceMemberId';
let AddBlocklistScopeFieldCommand = class AddBlocklistScopeFieldCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options, dataSource }) {
        const isDryRun = options.dryRun ?? false;
        const { flatFieldMetadataMaps, flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps'
        ]);
        const blocklistObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: BLOCKLIST.universalIdentifier
        });
        if (!(0, _utils.isDefined)(blocklistObjectMetadata)) {
            this.logger.log(`Blocklist object does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const workspaceMemberField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatFieldMetadataMaps,
            universalIdentifier: WORKSPACE_MEMBER_FIELD_UNIVERSAL_IDENTIFIER
        });
        if (!(0, _utils.isDefined)(workspaceMemberField)) {
            throw new Error(`Blocklist workspaceMember field is missing for workspace ${workspaceId}`);
        }
        const workspaceMemberRelationSettings = workspaceMemberField.settings;
        if (!(0, _utils.isDefined)(workspaceMemberRelationSettings) || !('relationType' in workspaceMemberRelationSettings)) {
            throw new Error(`Blocklist workspaceMember metadata is not a relation for workspace ${workspaceId}`);
        }
        const isScopeFieldMissing = !(0, _utils.isDefined)((0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatFieldMetadataMaps,
            universalIdentifier: SCOPE_FIELD_UNIVERSAL_IDENTIFIER
        }));
        const isWorkspaceMemberRelationOutdated = !workspaceMemberField.isNullable || workspaceMemberRelationSettings.onDelete !== _types.RelationOnDeleteAction.CASCADE;
        if (!isScopeFieldMissing && !isWorkspaceMemberRelationOutdated) {
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const standardScopeField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
            universalIdentifier: SCOPE_FIELD_UNIVERSAL_IDENTIFIER
        });
        if (!(0, _utils.isDefined)(standardScopeField)) {
            throw new Error('Standard application is missing blocklist field scope');
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would apply the blocklist workspace-scope migration for workspace ${workspaceId}: scope field ${isScopeFieldMissing ? 'missing' : 'present'}, workspaceMember relation ${isWorkspaceMemberRelationOutdated ? 'outdated' : 'up to date'}`);
            return;
        }
        const flatFieldMetadataToCreate = [];
        if (isScopeFieldMissing) {
            flatFieldMetadataToCreate.push({
                ...standardScopeField,
                viewFieldIds: [],
                viewFieldUniversalIdentifiers: []
            });
        }
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: flatFieldMetadataToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (result.status === 'fail') {
            throw new Error(`Failed to add the blocklist scope field for workspace ${workspaceId}: ${JSON.stringify(result, null, 2)}`);
        }
        if (isWorkspaceMemberRelationOutdated) {
            if (!(0, _utils.isDefined)(dataSource)) {
                throw new Error(`No data source available to make the blocklist workspaceMember relation optional for workspace ${workspaceId}`);
            }
            await this.makeWorkspaceMemberRelationOptional({
                dataSource,
                workspaceId,
                fieldMetadataId: workspaceMemberField.id
            });
        }
        this.logger.log(`Applied the blocklist workspace-scope migration for workspace ${workspaceId}`);
    }
    async makeWorkspaceMemberRelationOptional({ dataSource, workspaceId, fieldMetadataId }) {
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const tableName = (0, _computetablenameutil.computeTableName)(BLOCKLIST_OBJECT_NAME_SINGULAR, false);
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            await this.workspaceSchemaManagerService.columnManager.alterColumnNullable({
                queryRunner,
                schemaName,
                tableName,
                columnName: WORKSPACE_MEMBER_COLUMN_NAME,
                isNullable: true
            });
            const foreignKeyName = await this.workspaceSchemaManagerService.foreignKeyManager.getForeignKeyName({
                queryRunner,
                schemaName,
                tableName,
                columnName: WORKSPACE_MEMBER_COLUMN_NAME
            });
            if ((0, _utils.isDefined)(foreignKeyName)) {
                await this.workspaceSchemaManagerService.foreignKeyManager.dropForeignKey({
                    queryRunner,
                    schemaName,
                    tableName,
                    foreignKeyName
                });
            }
            await this.workspaceSchemaManagerService.foreignKeyManager.createForeignKey({
                queryRunner,
                schemaName,
                foreignKey: {
                    tableName,
                    columnName: WORKSPACE_MEMBER_COLUMN_NAME,
                    referencedTableName: WORKSPACE_MEMBER_TABLE_NAME,
                    referencedColumnName: 'id',
                    onDelete: _types.RelationOnDeleteAction.CASCADE
                }
            });
            await queryRunner.query(`UPDATE "core"."fieldMetadata"
            SET "isNullable" = true,
                "settings" = jsonb_set(
                  COALESCE("settings", '{}'::jsonb),
                  '{onDelete}',
                  to_jsonb($1::text)
                ),
                "updatedAt" = now()
          WHERE "id" = $2
            AND "workspaceId" = $3`, [
                _types.RelationOnDeleteAction.CASCADE,
                fieldMetadataId,
                workspaceId
            ]);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally{
            await queryRunner.release();
        }
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatObjectMetadataMaps'
        ]);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceSchemaManagerService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceSchemaManagerService = workspaceSchemaManagerService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddBlocklistScopeFieldCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1787933689056),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:add-blocklist-scope-field',
        description: 'Add the blocklist.scope field, make blocklist.workspaceMember nullable so a handle can be blocked workspace-wide, and switch that relation from SET_NULL to CASCADE so a destroyed workspace member takes their entries with them'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspaceschemamanagerservice.WorkspaceSchemaManagerService === "undefined" ? Object : _workspaceschemamanagerservice.WorkspaceSchemaManagerService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddBlocklistScopeFieldCommand);

//# sourceMappingURL=2-38-workspace-command-1787933689056-add-blocklist-scope-field.command.js.map