"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RepairTimelineActivityTargetFieldNamesCommand", {
    enumerable: true,
    get: function() {
        return RepairTimelineActivityTargetFieldNamesCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildtimelineactivitytargetfieldrepairsutil = require("./utils/build-timeline-activity-target-field-repairs.util");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _getworkspaceschemacontextformigrationutil = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/get-workspace-schema-context-for-migration.util");
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
let RepairTimelineActivityTargetFieldNamesCommand = class RepairTimelineActivityTargetFieldNamesCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatIndexMaps'
        ]);
        const timelineActivityFlatObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: _metadata.STANDARD_OBJECTS.timelineActivity.universalIdentifier
        });
        if (!(0, _utils.isDefined)(timelineActivityFlatObjectMetadata)) {
            return;
        }
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.error(`Cannot verify timeline activity target columns for workspace ${workspaceId}: no data source. Skipping, rerun once the workspace is reachable.`);
            return;
        }
        const existingColumnNames = await this.readExistingColumnNames({
            dataSource,
            workspaceId,
            timelineActivityFlatObjectMetadata
        });
        const { flatFieldMetadatasToUpdate, flatIndexMetadatasToUpdate, unrepairableTargetFields } = (0, _buildtimelineactivitytargetfieldrepairsutil.buildTimelineActivityTargetFieldRepairs)({
            flatObjectMetadataMaps,
            flatFieldMetadataMaps,
            flatIndexMaps,
            existingColumnNames
        });
        if (unrepairableTargetFields.length > 0) {
            // Left as an error rather than a throw: a thrown workspace step aborts the
            // whole instance upgrade sequence, and this drift predates the command.
            this.logger.error([
                `MANUAL REPAIR REQUIRED: ${unrepairableTargetFields.length} timeline activity target field(s) in workspace ${workspaceId} cannot be repaired automatically.`,
                ...unrepairableTargetFields.map(({ fieldName, expectedName, reason })=>`  - ${fieldName} -> ${expectedName}: ${reason}`)
            ].join('\n'));
        }
        if (flatFieldMetadatasToUpdate.length === 0) {
            return;
        }
        if (options.dryRun ?? false) {
            this.logger.log(`[DRY RUN] Would repair ${flatFieldMetadatasToUpdate.length} timeline activity target field(s) and ${flatIndexMetadatasToUpdate.length} index(es) for workspace ${workspaceId}`);
            return;
        }
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: timelineActivityFlatObjectMetadata.applicationUniversalIdentifier,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: flatFieldMetadatasToUpdate
                },
                index: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: flatIndexMetadatasToUpdate
                }
            }
        });
        if (result.status === 'fail') {
            throw new Error(`Failed to repair timeline activity target fields for workspace ${workspaceId}:\n${JSON.stringify(result, null, 2)}`);
        }
    }
    async readExistingColumnNames({ dataSource, workspaceId, timelineActivityFlatObjectMetadata }) {
        const { schemaName, tableName } = (0, _getworkspaceschemacontextformigrationutil.getWorkspaceSchemaContextForMigration)({
            workspaceId,
            objectMetadata: timelineActivityFlatObjectMetadata
        });
        const rows = await dataSource.query(`SELECT column_name FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2`, [
            schemaName,
            tableName
        ]);
        return new Set(rows.map(({ column_name })=>column_name));
    }
    constructor(workspaceIteratorService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
RepairTimelineActivityTargetFieldNamesCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.35.0', 1787641226000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-35:repair-timeline-activity-target-field-names',
        description: 'Repair timeline activity target morph field names left stale by object renames'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], RepairTimelineActivityTargetFieldNamesCommand);

//# sourceMappingURL=2-35-workspace-command-1787641226000-repair-timeline-activity-target-field-names.command.js.map