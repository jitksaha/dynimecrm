"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ContractTimelineActivityCompatibilityCommand", {
    enumerable: true,
    get: function() {
        return ContractTimelineActivityCompatibilityCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _buildtimelineactivitytypebackfillqueryutil = require("../2-33/utils/build-timeline-activity-type-backfill-query.util");
const _hastimelineactivityobjectmetadatautil = require("../2-34/utils/has-timeline-activity-object-metadata.util");
const _buildtimelineactivitytypesnapshotbackfillqueryutil = require("../2-34/utils/build-timeline-activity-type-snapshot-backfill-query.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
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
const LEGACY_NAME_FIELD_UNIVERSAL_IDENTIFIER = '20202020-7207-46e8-9dab-849505ae8497';
const BACKFILL_BATCH_SIZE = 5000;
let ContractTimelineActivityCompatibilityCommand = class ContractTimelineActivityCompatibilityCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps'
        ]);
        if (!(0, _hastimelineactivityobjectmetadatautil.hasTimelineActivityObjectMetadata)(flatObjectMetadataMaps)) {
            this.logger.log(`timelineActivity object does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        if (!(0, _utils.isDefined)(dataSource)) {
            throw new Error(`Cannot contract timeline activity compatibility without a data source for workspace ${workspaceId}`);
        }
        const legacyNameField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatFieldMetadataMaps,
            universalIdentifier: LEGACY_NAME_FIELD_UNIVERSAL_IDENTIFIER
        });
        const initialAudit = await this.auditTimelineActivities({
            workspaceId,
            dataSource
        });
        if (options.dryRun ?? false) {
            this.logger.log(`[DRY RUN] Workspace ${workspaceId} timeline activity audit: ${JSON.stringify(initialAudit)}. Would backfill unresolved rows and remove legacy name metadata.`);
            return;
        }
        if (initialAudit.missingTypeIdCount > 0) {
            if (!(0, _utils.isDefined)(legacyNameField)) {
                throw new Error(`Workspace ${workspaceId} has unresolved timeline activity type references but no legacy name field to repair them from: ${JSON.stringify(initialAudit)}`);
            }
            await this.backfillMissingTimelineActivityTypeIds({
                workspaceId,
                dataSource
            });
        }
        if (initialAudit.missingSnapshotCount > 0) {
            await this.backfillSnapshots({
                workspaceId,
                dataSource
            });
        }
        const finalAudit = await this.auditTimelineActivities({
            workspaceId,
            dataSource
        });
        if (finalAudit.missingTypeIdCount > 0 || finalAudit.missingSnapshotCount > 0) {
            throw new Error(`Refusing to contract timeline activity compatibility for workspace ${workspaceId}; unresolved rows remain after repair: ${JSON.stringify(finalAudit)}`);
        }
        if (!(0, _utils.isDefined)(legacyNameField)) {
            this.logger.log(`Timeline activity compatibility is already contracted for workspace ${workspaceId}`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const migrationResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [
                        legacyNameField
                    ],
                    flatEntityToUpdate: []
                }
            }
        });
        if (migrationResult.status === 'fail') {
            throw new Error(`Failed to contract timeline activity compatibility for workspace ${workspaceId}:\n${JSON.stringify(migrationResult, null, 2)}`);
        }
        this.logger.log(`Contracted timeline activity compatibility for workspace ${workspaceId}`);
    }
    async auditTimelineActivities({ workspaceId, dataSource }) {
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const [audit] = await dataSource.query(`SELECT
  COUNT(*) FILTER (WHERE timeline_activity."timelineActivityTypeId" IS NULL)::text AS "missingTypeIdCount",
  COUNT(*) FILTER (
    WHERE timeline_activity."timelineActivityTypeSnapshot" IS NULL
      AND (
        timeline_activity."timelineActivityTypeId" IS NULL
        OR timeline_activity_type."id" IS NOT NULL
      )
  )::text AS "missingSnapshotCount",
  COUNT(*) FILTER (
    WHERE timeline_activity."timelineActivityTypeId" IS NOT NULL
      AND timeline_activity_type."id" IS NULL
  )::text AS "danglingTypeIdCount"
FROM "${schemaName}"."timelineActivity" timeline_activity
LEFT JOIN "core"."timelineActivityType" timeline_activity_type
  ON timeline_activity_type."id" = timeline_activity."timelineActivityTypeId"
  AND timeline_activity_type."workspaceId" = $1`, [
            workspaceId
        ]);
        return {
            missingTypeIdCount: Number(audit.missingTypeIdCount),
            missingSnapshotCount: Number(audit.missingSnapshotCount),
            danglingTypeIdCount: Number(audit.danglingTypeIdCount)
        };
    }
    async backfillMissingTimelineActivityTypeIds({ workspaceId, dataSource }) {
        const { flatTimelineActivityTypeMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatTimelineActivityTypeMaps'
        ]);
        const backfillQuery = (0, _buildtimelineactivitytypebackfillqueryutil.buildTimelineActivityTypeBackfillQuery)({
            schemaName: (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId),
            flatTimelineActivityTypeMaps,
            batchSize: BACKFILL_BATCH_SIZE
        });
        if (!(0, _utils.isDefined)(backfillQuery)) {
            throw new Error(`Workspace ${workspaceId} is missing the shared linked timeline activity type`);
        }
        let lastBatchRowCount = 0;
        do {
            const result = await dataSource.query(backfillQuery.sql, backfillQuery.parameters);
            lastBatchRowCount = result?.[1] ?? 0;
        }while (lastBatchRowCount === BACKFILL_BATCH_SIZE)
    }
    async backfillSnapshots({ workspaceId, dataSource }) {
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        let lastBatchRowCount = 0;
        let afterTimelineActivityId = null;
        do {
            const backfillQuery = (0, _buildtimelineactivitytypesnapshotbackfillqueryutil.buildTimelineActivityTypeSnapshotBackfillQuery)({
                schemaName,
                batchSize: BACKFILL_BATCH_SIZE,
                afterTimelineActivityId
            });
            const [updatedTimelineActivities, updatedRowCount] = await dataSource.query(backfillQuery.sql, backfillQuery.parameters);
            lastBatchRowCount = updatedRowCount;
            if (lastBatchRowCount === BACKFILL_BATCH_SIZE) {
                if (!(0, _utils.isNonEmptyArray)(updatedTimelineActivities)) {
                    throw new Error(`Snapshot backfill for workspace ${workspaceId} updated rows without returning their identifiers`);
                }
                afterTimelineActivityId = updatedTimelineActivities.reduce((latestId, timelineActivity)=>timelineActivity.id > latestId ? timelineActivity.id : latestId, updatedTimelineActivities[0].id);
            }
        }while (lastBatchRowCount === BACKFILL_BATCH_SIZE)
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
ContractTimelineActivityCompatibilityCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.35.0', 1787648000000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-35:contract-timeline-activity-compatibility',
        description: 'Backfill timeline activity types and remove the legacy name field'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], ContractTimelineActivityCompatibilityCommand);

//# sourceMappingURL=2-35-workspace-command-1787648000000-contract-timeline-activity-compatibility.command.js.map