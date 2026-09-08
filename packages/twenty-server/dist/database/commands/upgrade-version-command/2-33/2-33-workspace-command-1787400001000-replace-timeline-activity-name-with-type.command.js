"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReplaceTimelineActivityNameWithTypeCommand", {
    enumerable: true,
    get: function() {
        return ReplaceTimelineActivityNameWithTypeCommand;
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
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
const _buildtimelineactivitytypebackfillqueryutil = require("./utils/build-timeline-activity-type-backfill-query.util");
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
const LINKED_RECORD_CACHED_NAME_FIELD_UNIVERSAL_IDENTIFIER = TIMELINE_ACTIVITY.fields.linkedRecordCachedName.universalIdentifier;
let ReplaceTimelineActivityNameWithTypeCommand = class ReplaceTimelineActivityNameWithTypeCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        const isDryRun = options.dryRun ?? false;
        const { flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps'
        ]);
        const timelineActivityObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: TIMELINE_ACTIVITY.universalIdentifier
        });
        if (!(0, _utils.isDefined)(timelineActivityObjectMetadata)) {
            this.logger.log(`timelineActivity object does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.log(`No data source for workspace ${workspaceId}, skipping`);
            return;
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would add and backfill timelineActivity.timelineActivityTypeId for workspace ${workspaceId}`);
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
        await this.createTypesAndField({
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier,
            standardAllFlatEntityMaps
        });
        await this.backfillTimelineActivityTypeIds({
            workspaceId,
            dataSource
        });
        await this.repointLabelIdentifierToLinkedRecordCachedName({
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        this.logger.log(`Added and backfilled timelineActivity.timelineActivityTypeId for workspace ${workspaceId}`);
    }
    async createTypesAndField({ workspaceId, applicationUniversalIdentifier, standardAllFlatEntityMaps }) {
        const { flatFieldMetadataMaps, flatTimelineActivityTypeMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatTimelineActivityTypeMaps'
        ]);
        const flatTimelineActivityTypesToCreate = Object.values(standardAllFlatEntityMaps.flatTimelineActivityTypeMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatTimelineActivityType)=>!(0, _utils.isDefined)(flatTimelineActivityTypeMaps.byUniversalIdentifier[flatTimelineActivityType.universalIdentifier]));
        const standardTypeField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
            universalIdentifier: TIMELINE_ACTIVITY.fields.timelineActivityTypeId.universalIdentifier
        });
        if (!(0, _utils.isDefined)(standardTypeField)) {
            throw new Error('Standard application is missing timelineActivity.timelineActivityTypeId');
        }
        const flatFieldMetadatasToCreate = (0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[standardTypeField.universalIdentifier]) ? [] : [
            {
                ...standardTypeField,
                viewFieldIds: [],
                viewFieldUniversalIdentifiers: []
            }
        ];
        if (flatTimelineActivityTypesToCreate.length === 0 && flatFieldMetadatasToCreate.length === 0) {
            return;
        }
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier,
            allFlatEntityOperationByMetadataName: {
                timelineActivityType: {
                    flatEntityToCreate: flatTimelineActivityTypesToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                fieldMetadata: {
                    flatEntityToCreate: flatFieldMetadatasToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            }
        });
        if (result.status === 'fail') {
            throw new Error(`Failed to create timeline activity types for workspace ${workspaceId}:\n${JSON.stringify(result, null, 2)}`);
        }
    }
    async backfillTimelineActivityTypeIds({ workspaceId, dataSource }) {
        const { flatTimelineActivityTypeMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatTimelineActivityTypeMaps'
        ]);
        const backfillQuery = (0, _buildtimelineactivitytypebackfillqueryutil.buildTimelineActivityTypeBackfillQuery)({
            schemaName: (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId),
            flatTimelineActivityTypeMaps,
            batchSize: BACKFILL_BATCH_SIZE
        });
        if (!(0, _utils.isDefined)(backfillQuery)) {
            throw new Error(`Workspace ${workspaceId} is missing standard timeline activity types after seeding`);
        }
        let backfilledRowCount = 0;
        let lastBatchRowCount = 0;
        // Each batch commits on its own, so an interrupted run resumes where it
        // stopped: the query only ever picks rows that still have no type.
        do {
            const result = await dataSource.query(backfillQuery.sql, backfillQuery.parameters);
            lastBatchRowCount = result?.[1] ?? 0;
            backfilledRowCount += lastBatchRowCount;
        }while (lastBatchRowCount === BACKFILL_BATCH_SIZE)
        this.logger.log(`Backfilled ${backfilledRowCount} timelineActivity rows for workspace ${workspaceId}`);
    }
    // Repointing now makes the later removal of `name` independent of this
    // migration while giving the object a useful label during compatibility.
    async repointLabelIdentifierToLinkedRecordCachedName({ workspaceId, applicationUniversalIdentifier }) {
        const { flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps'
        ]);
        const timelineActivityObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: TIMELINE_ACTIVITY.universalIdentifier
        });
        if (!(0, _utils.isDefined)(timelineActivityObjectMetadata) || timelineActivityObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier === LINKED_RECORD_CACHED_NAME_FIELD_UNIVERSAL_IDENTIFIER) {
            return;
        }
        const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunLegacyWorkspaceMigration({
            isSystemBuild: true,
            workspaceId,
            applicationUniversalIdentifier,
            allFlatEntityOperationByMetadataName: {
                objectMetadata: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: [
                        {
                            ...timelineActivityObjectMetadata,
                            labelIdentifierFieldMetadataUniversalIdentifier: LINKED_RECORD_CACHED_NAME_FIELD_UNIVERSAL_IDENTIFIER
                        }
                    ]
                }
            }
        });
        if (result.status === 'fail') {
            throw new Error(`Failed to repoint the timelineActivity label identifier for workspace ${workspaceId}:\n${JSON.stringify(result, null, 2)}`);
        }
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
ReplaceTimelineActivityNameWithTypeCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.33.0', 1787400001000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-33:replace-timeline-activity-name-with-type',
        description: 'Seed the standard timelineActivityType rows, add timelineActivity.timelineActivityTypeId and backfill it from the deprecated name column'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], ReplaceTimelineActivityNameWithTypeCommand);

//# sourceMappingURL=2-33-workspace-command-1787400001000-replace-timeline-activity-name-with-type.command.js.map