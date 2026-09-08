"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EnableStandardActivityTargetFieldsCommand", {
    enumerable: true,
    get: function() {
        return EnableStandardActivityTargetFieldsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
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
const ACTIVITY_TARGET_FIELD_UNIVERSAL_IDENTIFIERS = [
    _metadata.STANDARD_OBJECTS.company.fields.taskTargets.universalIdentifier,
    _metadata.STANDARD_OBJECTS.company.fields.noteTargets.universalIdentifier,
    _metadata.STANDARD_OBJECTS.person.fields.taskTargets.universalIdentifier,
    _metadata.STANDARD_OBJECTS.person.fields.noteTargets.universalIdentifier,
    _metadata.STANDARD_OBJECTS.opportunity.fields.taskTargets.universalIdentifier,
    _metadata.STANDARD_OBJECTS.opportunity.fields.noteTargets.universalIdentifier
];
let EnableStandardActivityTargetFieldsCommand = class EnableStandardActivityTargetFieldsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, dataSource, options }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.warn(`No data source for workspace ${workspaceId}, skipping`);
            return;
        }
        if (options.dryRun) {
            this.logger.log(`[DRY RUN] Would make standard activity target fields editable for workspace ${workspaceId}`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const updateResult = await dataSource.query(`UPDATE "core"."fieldMetadata"
       SET "isUIEditable" = true, "updatedAt" = now()
       WHERE "workspaceId" = $1
         AND "applicationId" = $2
         AND "universalIdentifier" = ANY($3::uuid[])
         AND "isUIEditable" = false`, [
            workspaceId,
            twentyStandardFlatApplication.id,
            ACTIVITY_TARGET_FIELD_UNIVERSAL_IDENTIFIERS
        ]);
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        this.logger.log(`Made ${updateResult[1]} standard activity target field(s) editable for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService;
    }
};
EnableStandardActivityTargetFieldsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1788197000000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:enable-standard-activity-target-fields',
        description: 'Make the standard company, person, and opportunity task/note target fields editable in the generic record UI'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], EnableStandardActivityTargetFieldsCommand);

//# sourceMappingURL=2-38-workspace-command-1788197000000-enable-standard-activity-target-fields.command.js.map