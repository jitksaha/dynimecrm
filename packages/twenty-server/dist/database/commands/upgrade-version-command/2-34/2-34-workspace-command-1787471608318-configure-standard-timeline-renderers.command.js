"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConfigureStandardTimelineRenderersCommand", {
    enumerable: true,
    get: function() {
        return ConfigureStandardTimelineRenderersCommand;
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
// Replaying 2.34 must not pick up renderers introduced by a later release.
const STANDARD_TYPES_WITH_RENDERERS = [
    {
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c0f',
        frontComponentUniversalIdentifier: '8b4da8ed-4a87-480d-bcad-a791262cb890'
    },
    {
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c10',
        frontComponentUniversalIdentifier: '3c70dd28-42f3-41da-8f41-22013d65ff50'
    }
];
let ConfigureStandardTimelineRenderersCommand = class ConfigureStandardTimelineRenderersCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.log(`No data source for workspace ${workspaceId}, skipping`);
            return;
        }
        if (options.dryRun ?? false) {
            this.logger.log(`[DRY RUN] Would configure standard timeline renderers for workspace ${workspaceId}`);
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
        const values = STANDARD_TYPES_WITH_RENDERERS.map((_, index)=>`($${index * 2 + 3}::uuid, $${index * 2 + 4}::uuid)`).join(', ');
        const parameters = STANDARD_TYPES_WITH_RENDERERS.flatMap((definition)=>[
                definition.universalIdentifier,
                definition.frontComponentUniversalIdentifier
            ]);
        const [, updatedRowCount] = await dataSource.query(`UPDATE "core"."timelineActivityType" AS timeline_activity_type
       SET "frontComponentUniversalIdentifier" = renderer."frontComponentUniversalIdentifier"
       FROM (VALUES ${values}) AS renderer(
         "universalIdentifier",
         "frontComponentUniversalIdentifier"
       )
       WHERE timeline_activity_type."workspaceId" = $1
         AND timeline_activity_type."applicationId" = $2
         AND timeline_activity_type."universalIdentifier" = renderer."universalIdentifier"`, [
            workspaceId,
            twentyStandardFlatApplication.id,
            ...parameters
        ]);
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'flatTimelineActivityTypeMaps'
        ]);
        (0, _validatestandardmetadataupdatecountutil.validateStandardMetadataUpdateCount)({
            actualCount: updatedRowCount,
            expectedCount: STANDARD_TYPES_WITH_RENDERERS.length,
            logger: this.logger,
            metadataLabel: 'standard timeline renderers',
            workspaceId
        });
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService;
    }
};
ConfigureStandardTimelineRenderersCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.34.0', 1787471608318),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-34:configure-standard-timeline-renderers',
        description: 'Attach standard timeline previews through renderer identifiers'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], ConfigureStandardTimelineRenderersCommand);

//# sourceMappingURL=2-34-workspace-command-1787471608318-configure-standard-timeline-renderers.command.js.map