"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillWorkspaceCustomApplicationRegistrationCommand", {
    enumerable: true,
    get: function() {
        return BackfillWorkspaceCustomApplicationRegistrationCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationentity = require("../../../../engine/core-modules/application/application.entity");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let BackfillWorkspaceCustomApplicationRegistrationCommand = class BackfillWorkspaceCustomApplicationRegistrationCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        // Suspended workspaces are soft-deleted, so the row needs withDeleted.
        const workspace = await this.workspaceRepository.findOne({
            select: [
                'id',
                'workspaceCustomApplicationId'
            ],
            where: {
                id: workspaceId
            },
            withDeleted: true
        });
        if (!(0, _utils.isDefined)(workspace)) {
            this.logger.log(`Workspace ${workspaceId} not found, skipping`);
            return;
        }
        const customApplication = await this.applicationRepository.findOne({
            select: [
                'id',
                'universalIdentifier',
                'applicationRegistrationId'
            ],
            where: {
                id: workspace.workspaceCustomApplicationId,
                workspaceId
            }
        });
        if (!(0, _utils.isDefined)(customApplication)) {
            this.logger.log(`No custom application for workspace ${workspaceId}, skipping`);
            return;
        }
        if ((0, _utils.isDefined)(customApplication.applicationRegistrationId)) {
            this.logger.log(`Custom application for workspace ${workspaceId} already has a registration, skipping`);
            return;
        }
        if (options.dryRun) {
            this.logger.log(`[DRY RUN] Would create an application registration for workspace ${workspaceId} custom application`);
            return;
        }
        const registration = await this.applicationService.createWorkspaceCustomApplicationRegistration({
            workspaceId,
            universalIdentifier: customApplication.universalIdentifier
        });
        await this.applicationService.update(customApplication.id, {
            applicationRegistrationId: registration.id,
            workspaceId
        });
        this.logger.log(`Created application registration ${registration.id} for workspace ${workspaceId} custom application`);
    }
    constructor(workspaceIteratorService, workspaceRepository, applicationRepository, applicationService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceRepository = workspaceRepository, this.applicationRepository = applicationRepository, this.applicationService = applicationService;
    }
};
BackfillWorkspaceCustomApplicationRegistrationCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.19.0', 1782853718000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-19:backfill-workspace-custom-application-registration',
        description: 'Create a workspace-scoped application registration for each existing workspace Custom application so custom object/field labels become translatable.'
    }),
    _ts_param(1, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService
    ])
], BackfillWorkspaceCustomApplicationRegistrationCommand);

//# sourceMappingURL=2-19-workspace-command-1782853718000-backfill-workspace-custom-application-registration.command.js.map