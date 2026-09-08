"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get BackfillActorSourceEnumValuesCommand () {
        return BackfillActorSourceEnumValuesCommand;
    },
    get buildActorSourceEnumBackfillTargets () {
        return buildActorSourceEnumBackfillTargets;
    }
});
const _nestcommander = require("nest-commander");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _computecolumnnameutil = require("../../../../engine/metadata-modules/field-metadata/utils/compute-column-name.util");
const _isenumfieldmetadatatypeutil = require("../../../../engine/metadata-modules/field-metadata/utils/is-enum-field-metadata-type.util");
const _workspaceschemamanagerservice = require("../../../../engine/twenty-orm/workspace-schema-manager/workspace-schema-manager.service");
const _computeobjecttargettableutil = require("../../../../engine/utils/compute-object-target-table.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
const _computepostgresenumnameutil = require("../../../../engine/workspace-manager/workspace-migration/utils/compute-postgres-enum-name.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const buildActorSourceEnumBackfillTargets = ({ flatObjectMetadataMaps, flatFieldMetadataMaps })=>{
    const targets = [];
    const actorFlatFieldMetadatas = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatFieldMetadata)=>flatFieldMetadata.type === _types.FieldMetadataType.ACTOR);
    for (const flatFieldMetadata of actorFlatFieldMetadatas){
        const flatObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[flatFieldMetadata.objectMetadataUniversalIdentifier];
        if (!(0, _utils.isDefined)(flatObjectMetadata)) {
            continue;
        }
        const compositeType = _types.compositeTypeDefinitions.get(flatFieldMetadata.type);
        if (!(0, _utils.isDefined)(compositeType)) {
            continue;
        }
        const tableName = (0, _computeobjecttargettableutil.computeObjectTargetTable)(flatObjectMetadata);
        for (const property of compositeType.properties){
            if (!(0, _isenumfieldmetadatatypeutil.isEnumFieldMetadataType)(property.type)) {
                continue;
            }
            const expectedValues = property.options?.map((option)=>option.value) ?? [];
            if (expectedValues.length === 0) {
                continue;
            }
            const columnName = (0, _computecolumnnameutil.computeCompositeColumnName)(flatFieldMetadata.name, property);
            targets.push({
                objectNameSingular: flatObjectMetadata.nameSingular,
                fieldName: flatFieldMetadata.name,
                tableName,
                columnName,
                enumName: (0, _computepostgresenumnameutil.computePostgresEnumName)({
                    tableName,
                    columnName
                }),
                expectedValues
            });
        }
    }
    return targets;
};
let BackfillActorSourceEnumValuesCommand = class BackfillActorSourceEnumValuesCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.log(`No data source for workspace ${workspaceId}, skipping`);
            return;
        }
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]);
        const targets = buildActorSourceEnumBackfillTargets({
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        });
        if (targets.length === 0) {
            this.logger.log(`No ACTOR fields found for workspace ${workspaceId}, skipping`);
            return;
        }
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const queryRunner = dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const companyCreatedBySourceTarget = targets.find((target)=>target.objectNameSingular === 'company' && target.columnName === 'createdBySource');
            if ((0, _utils.isDefined)(companyCreatedBySourceTarget)) {
                const rows = await queryRunner.query(`SELECT e.enumlabel
           FROM pg_catalog.pg_type t
           JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
           JOIN pg_catalog.pg_enum e ON e.enumtypid = t.oid
           WHERE n.nspname = $1
             AND t.typname = $2`, [
                    schemaName,
                    companyCreatedBySourceTarget.enumName
                ]);
                const existingValues = new Set(rows.map((row)=>row.enumlabel));
                if (existingValues.has('AGENT')) {
                    this.logger.log(`AGENT already present on ${schemaName}.${companyCreatedBySourceTarget.enumName}, skipping workspace ${workspaceId}`);
                    await queryRunner.commitTransaction();
                    return;
                }
            }
            const isDryRun = options.dryRun ?? false;
            for (const target of targets){
                await this.backfillEnumTarget({
                    queryRunner,
                    schemaName,
                    target,
                    workspaceId,
                    isDryRun
                });
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        } finally{
            await queryRunner.release();
        }
    }
    async backfillEnumTarget({ queryRunner, schemaName, target, workspaceId, isDryRun }) {
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would ensure [${target.expectedValues.join(', ')}] exist on ${schemaName}.${target.enumName} (workspace ${workspaceId})`);
            return;
        }
        for (const value of target.expectedValues){
            await this.workspaceSchemaManagerService.enumManager.upsertEnumValue({
                queryRunner,
                schemaName,
                enumName: target.enumName,
                value
            });
        }
        this.logger.log(`Ensured actor source values on ${schemaName}.${target.enumName} (workspace ${workspaceId})`);
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceSchemaManagerService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceSchemaManagerService = workspaceSchemaManagerService;
    }
};
BackfillActorSourceEnumValuesCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.20.0', 1783499671542),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-20:backfill-actor-source-enum-values',
        description: 'Backfill missing AGENT FieldActorSource values into the Postgres enums backing ACTOR fields (createdBy/updatedBy) of existing workspaces.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspaceschemamanagerservice.WorkspaceSchemaManagerService === "undefined" ? Object : _workspaceschemamanagerservice.WorkspaceSchemaManagerService
    ])
], BackfillActorSourceEnumValuesCommand);

//# sourceMappingURL=2-20-workspace-command-1783499671542-backfill-actor-source-enum-values.command.js.map