"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConfigureTimelineActivityHappensAtCommand", {
    enumerable: true,
    get: function() {
        return ConfigureTimelineActivityHappensAtCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _validatestandardmetadataupdatecountutil = require("../2-34/utils/validate-standard-metadata-update-count.util");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _standardtimelineactivityhappensat238constant = require("../../../../engine/metadata-modules/timeline-activity-type/constants/standard-timeline-activity-happens-at-2-38.constant");
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
let ConfigureTimelineActivityHappensAtCommand = class ConfigureTimelineActivityHappensAtCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.log(`No data source for workspace ${workspaceId}, skipping`);
            return;
        }
        if (options.dryRun) {
            this.logger.log(`[DRY RUN] Would configure timeline activity happensAt fields for workspace ${workspaceId}`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const happensAtValueClauses = _standardtimelineactivityhappensat238constant.STANDARD_TIMELINE_ACTIVITY_HAPPENS_AT_2_38.map((_, index)=>`($${index * 2 + 3}::uuid, $${index * 2 + 4}::uuid)`).join(', ');
        const happensAtParameters = _standardtimelineactivityhappensat238constant.STANDARD_TIMELINE_ACTIVITY_HAPPENS_AT_2_38.flatMap((definition)=>[
                definition.universalIdentifier,
                definition.happensAtFieldUniversalIdentifier
            ]);
        const happensAtResult = await dataSource.query(`UPDATE "core"."timelineActivityType" AS timeline_activity_type
       SET "happensAtFieldUniversalIdentifier" = happens_at."happensAtFieldUniversalIdentifier"
       FROM (VALUES ${happensAtValueClauses}) AS happens_at(
         "universalIdentifier",
         "happensAtFieldUniversalIdentifier"
       )
       WHERE timeline_activity_type."workspaceId" = $1
         AND timeline_activity_type."applicationId" = $2
         AND timeline_activity_type."universalIdentifier" = happens_at."universalIdentifier"`, [
            workspaceId,
            twentyStandardFlatApplication.id,
            ...happensAtParameters
        ]);
        (0, _validatestandardmetadataupdatecountutil.validateStandardMetadataUpdateCount)({
            actualCount: happensAtResult[1],
            expectedCount: _standardtimelineactivityhappensat238constant.STANDARD_TIMELINE_ACTIVITY_HAPPENS_AT_2_38.length,
            logger: this.logger,
            metadataLabel: 'standard timeline activity happensAt fields',
            workspaceId
        });
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'flatTimelineActivityTypeMaps'
        ]);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService;
    }
};
ConfigureTimelineActivityHappensAtCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1787918663365),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:configure-timeline-activity-happens-at',
        description: 'Point the standard messageLinked and calendarEventLinked timeline activity types at their source semantic timestamp field'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], ConfigureTimelineActivityHappensAtCommand);

//# sourceMappingURL=2-38-workspace-command-1787918663365-configure-timeline-activity-happens-at.command.js.map