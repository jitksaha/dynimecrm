"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConfigureTimelineActivityRoutingCommand", {
    enumerable: true,
    get: function() {
        return ConfigureTimelineActivityRoutingCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _hastimelineactivityobjectmetadatautil = require("./utils/has-timeline-activity-object-metadata.util");
const _validatestandardmetadataupdatecountutil = require("./utils/validate-standard-metadata-update-count.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _standardtimelineactivityrouting234constant = require("../../../../engine/metadata-modules/timeline-activity-type/constants/standard-timeline-activity-routing-2-34.constant");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const JUNCTION_TARGETS = [
    {
        relationFieldUniversalIdentifier: '20202020-7cff-4a74-b63c-73228448cbd9',
        targetFieldUniversalIdentifier: '20202020-249d-4e0f-82cd-1b9df5cd3da2'
    },
    {
        relationFieldUniversalIdentifier: '20202020-e07e-4ccb-88f5-6f3d00458eec',
        targetFieldUniversalIdentifier: '20202020-5761-4842-8186-e1898ef93966'
    }
];
let ConfigureTimelineActivityRoutingCommand = class ConfigureTimelineActivityRoutingCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.log(`No data source for workspace ${workspaceId}, skipping`);
            return;
        }
        if (options.dryRun ?? false) {
            this.logger.log(`[DRY RUN] Would configure generic timeline activity routing for workspace ${workspaceId}`);
            return;
        }
        const { flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps'
        ]);
        if (!(0, _hastimelineactivityobjectmetadatautil.hasTimelineActivityObjectMetadata)(flatObjectMetadataMaps)) {
            this.logger.log(`timelineActivity object does not exist for workspace ${workspaceId}, skipping`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const routingValueClauses = _standardtimelineactivityrouting234constant.STANDARD_TIMELINE_ACTIVITY_ROUTINGS_2_34.map((_, index)=>`($${index * 3 + 3}::uuid, $${index * 3 + 4}::uuid, $${index * 3 + 5}::uuid[])`).join(', ');
        const routingParameters = _standardtimelineactivityrouting234constant.STANDARD_TIMELINE_ACTIVITY_ROUTINGS_2_34.flatMap((definition)=>[
                definition.universalIdentifier,
                definition.targetRelationFieldUniversalIdentifier,
                definition.triggerFieldUniversalIdentifiers ?? null
            ]);
        const queryRunner = dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const routingResult = await dataSource.query(`UPDATE "core"."timelineActivityType" AS timeline_activity_type
       SET "targetRelationFieldUniversalIdentifier" = routing."targetRelationFieldUniversalIdentifier",
           "triggerFieldUniversalIdentifiers" = routing."triggerFieldUniversalIdentifiers"
       FROM (VALUES ${routingValueClauses}) AS routing(
         "universalIdentifier",
         "targetRelationFieldUniversalIdentifier",
         "triggerFieldUniversalIdentifiers"
       )
       WHERE timeline_activity_type."workspaceId" = $1
         AND timeline_activity_type."applicationId" = $2
         AND timeline_activity_type."universalIdentifier" = routing."universalIdentifier"`, [
                workspaceId,
                twentyStandardFlatApplication.id,
                ...routingParameters
            ], queryRunner);
            const junctionConditions = JUNCTION_TARGETS.map((_, index)=>`(source_field."universalIdentifier" = $${index * 2 + 2}::uuid AND target_field."universalIdentifier" = $${index * 2 + 3}::uuid)`).join(' OR ');
            const junctionResult = await dataSource.query(`UPDATE "core"."fieldMetadata" AS source_field
       SET "settings" = COALESCE(source_field."settings", '{}'::jsonb) ||
         jsonb_build_object('junctionTargetFieldId', target_field."id")
       FROM "core"."fieldMetadata" AS target_field
       WHERE source_field."workspaceId" = $1
         AND target_field."workspaceId" = $1
         AND (${junctionConditions})`, [
                workspaceId,
                ...JUNCTION_TARGETS.flatMap(({ relationFieldUniversalIdentifier, targetFieldUniversalIdentifier })=>[
                        relationFieldUniversalIdentifier,
                        targetFieldUniversalIdentifier
                    ])
            ], queryRunner);
            (0, _validatestandardmetadataupdatecountutil.validateStandardMetadataUpdateCount)({
                actualCount: routingResult[1],
                expectedCount: _standardtimelineactivityrouting234constant.STANDARD_TIMELINE_ACTIVITY_ROUTINGS_2_34.length,
                logger: this.logger,
                metadataLabel: 'standard timeline activity routings',
                workspaceId
            });
            (0, _validatestandardmetadataupdatecountutil.validateStandardMetadataUpdateCount)({
                actualCount: junctionResult[1],
                expectedCount: JUNCTION_TARGETS.length,
                logger: this.logger,
                metadataLabel: 'standard junction targets',
                workspaceId
            });
            await queryRunner.commitTransaction();
        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        } finally{
            await queryRunner.release();
        }
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'flatTimelineActivityTypeMaps',
            'flatFieldMetadataMaps'
        ]);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService;
    }
};
ConfigureTimelineActivityRoutingCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.34.0', 1787471608317),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-34:configure-timeline-activity-routing',
        description: 'Move standard linked timeline events to the generic application contract'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], ConfigureTimelineActivityRoutingCommand);

//# sourceMappingURL=2-34-workspace-command-1787471608317-configure-timeline-activity-routing.command.js.map