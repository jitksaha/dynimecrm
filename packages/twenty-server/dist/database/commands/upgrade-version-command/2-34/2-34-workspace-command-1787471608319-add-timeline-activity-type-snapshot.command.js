"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddTimelineActivityTypeSnapshotCommand", {
    enumerable: true,
    get: function() {
        return AddTimelineActivityTypeSnapshotCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _buildtimelineactivitytypebackfillqueryutil = require("../2-33/utils/build-timeline-activity-type-backfill-query.util");
const _hastimelineactivityobjectmetadatautil = require("./utils/has-timeline-activity-object-metadata.util");
const _buildtimelineactivitytypesnapshotbackfillqueryutil = require("./utils/build-timeline-activity-type-snapshot-backfill-query.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
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
const TIMELINE_ACTIVITY = _metadata.STANDARD_OBJECTS.timelineActivity;
const BACKFILL_BATCH_SIZE = 5000;
let AddTimelineActivityTypeSnapshotCommand = class AddTimelineActivityTypeSnapshotCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        const { flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps'
        ]);
        if (!(0, _hastimelineactivityobjectmetadatautil.hasTimelineActivityObjectMetadata)(flatObjectMetadataMaps)) {
            this.logger.log(`timelineActivity object does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.log(`No data source for workspace ${workspaceId}, skipping`);
            return;
        }
        if (options.dryRun ?? false) {
            this.logger.log(`[DRY RUN] Would add and backfill timelineActivity.timelineActivityTypeSnapshot for workspace ${workspaceId}`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        await this.createSnapshotField({
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        await this.backfillMissingTimelineActivityTypeIds({
            workspaceId,
            dataSource
        });
        await this.backfillSnapshots({
            workspaceId,
            dataSource
        });
    }
    async createSnapshotField({ workspaceId, applicationUniversalIdentifier, twentyStandardApplicationId }) {
        const { flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        const snapshotFieldUniversalIdentifier = TIMELINE_ACTIVITY.fields.timelineActivityTypeSnapshot.universalIdentifier;
        if ((0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[snapshotFieldUniversalIdentifier])) {
            return;
        }
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId
        });
        const standardSnapshotField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
            universalIdentifier: snapshotFieldUniversalIdentifier
        });
        if (!(0, _utils.isDefined)(standardSnapshotField)) {
            throw new Error('Standard application is missing timelineActivity.timelineActivityTypeSnapshot');
        }
        const snapshotFieldToCreate = {
            ...standardSnapshotField,
            // Existing rows are populated before the field becomes required.
            isNullable: true,
            viewFieldIds: [],
            viewFieldUniversalIdentifiers: []
        };
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier,
            allFlatEntityOperationByMetadataName: {
                fieldMetadata: {
                    flatEntityToCreate: [
                        snapshotFieldToCreate
                    ],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (result.status === 'fail') {
            throw new Error(`Failed to create the timeline activity type snapshot field for workspace ${workspaceId}:\n${JSON.stringify(result, null, 2)}`);
        }
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
        let backfilledRowCount = 0;
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
            backfilledRowCount += lastBatchRowCount;
            if (lastBatchRowCount === BACKFILL_BATCH_SIZE) {
                if (!(0, _utils.isNonEmptyArray)(updatedTimelineActivities)) {
                    throw new Error(`Snapshot backfill for workspace ${workspaceId} updated rows without returning their identifiers`);
                }
                afterTimelineActivityId = updatedTimelineActivities.reduce((latestId, timelineActivity)=>timelineActivity.id > latestId ? timelineActivity.id : latestId, updatedTimelineActivities[0].id);
            }
        }while (lastBatchRowCount === BACKFILL_BATCH_SIZE)
        this.logger.log(`Backfilled ${backfilledRowCount} timeline activity type snapshots for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
AddTimelineActivityTypeSnapshotCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.34.0', 1787471608319),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-34:add-timeline-activity-type-snapshot',
        description: 'Repair rolling-upgrade rows and snapshot timeline activity type values'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], AddTimelineActivityTypeSnapshotCommand);

//# sourceMappingURL=2-34-workspace-command-1787471608319-add-timeline-activity-type-snapshot.command.js.map