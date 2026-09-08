"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CleanSuspendedWorkspacesJob", {
    enumerable: true,
    get: function() {
        return CleanSuspendedWorkspacesJob;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _postgresadvisorylockservice = require("../../../../database/typeorm/postgres-advisory-lock.service");
const _applicationuninstallservice = require("../../../core-modules/application/application-manifest/services/application-uninstall.service");
const _sentrycronmonitordecorator = require("../../../core-modules/cron/sentry-cron-monitor.decorator");
const _processdecorator = require("../../../core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../core-modules/message-queue/message-queue.constants");
const _workspaceservice = require("../../../core-modules/workspace/services/workspace.service");
const _workspaceentity = require("../../../core-modules/workspace/workspace.entity");
const _cleansuspendedworkspacescronpattern = require("./clean-suspended-workspaces.cron.pattern");
const _cleanerworkspaceservice = require("../services/cleaner.workspace-service");
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
const CLEAN_SUSPENDED_WORKSPACES_LOCK_NAME = 'clean-suspended-workspaces-job';
let CleanSuspendedWorkspacesJob = class CleanSuspendedWorkspacesJob {
    async handle() {
        const advisoryLockResult = await this.postgresAdvisoryLockService.tryWithLock(CLEAN_SUSPENDED_WORKSPACES_LOCK_NAME, async ()=>{
            const suspendedWorkspaces = await this.workspaceRepository.find({
                select: [
                    'id'
                ],
                where: {
                    activationStatus: _workspace.WorkspaceActivationStatus.SUSPENDED
                },
                withDeleted: true
            });
            const softDeletedWorkspaces = await this.workspaceRepository.find({
                select: [
                    'id',
                    'deletedAt'
                ],
                where: {
                    deletedAt: (0, _typeorm1.Not)((0, _typeorm1.IsNull)())
                },
                withDeleted: true
            });
            const workspaceDeletionUninstallRequests = softDeletedWorkspaces.flatMap((workspace)=>(0, _utils.isDefined)(workspace.deletedAt) ? [
                    {
                        workspaceId: workspace.id,
                        uninstallRequestedAt: workspace.deletedAt
                    }
                ] : []);
            const workspaceIdsWithPendingUninstallHooks = await this.applicationUninstallService.findWorkspaceIdsWithPendingUninstallHooks(workspaceDeletionUninstallRequests);
            for (const request of workspaceDeletionUninstallRequests){
                if (workspaceIdsWithPendingUninstallHooks.has(request.workspaceId)) {
                    await this.workspaceService.enqueueWorkspaceDeletionApplicationUninstall(request.workspaceId);
                }
            }
            await this.cleanerWorkspaceService.batchWarnOrCleanSuspendedWorkspaces({
                workspaceIds: suspendedWorkspaces.map((workspace)=>workspace.id)
            });
        });
        if (!advisoryLockResult.acquired) {
            this.logger.log('Skipping suspended workspace cleanup because another execution is running');
        }
    }
    constructor(cleanerWorkspaceService, workspaceRepository, workspaceService, applicationUninstallService, postgresAdvisoryLockService){
        this.cleanerWorkspaceService = cleanerWorkspaceService;
        this.workspaceRepository = workspaceRepository;
        this.workspaceService = workspaceService;
        this.applicationUninstallService = applicationUninstallService;
        this.postgresAdvisoryLockService = postgresAdvisoryLockService;
        this.logger = new _common.Logger(CleanSuspendedWorkspacesJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(CleanSuspendedWorkspacesJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(CleanSuspendedWorkspacesJob.name, _cleansuspendedworkspacescronpattern.cleanSuspendedWorkspaceCronPattern),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CleanSuspendedWorkspacesJob.prototype, "handle", null);
CleanSuspendedWorkspacesJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_param(1, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cleanerworkspaceservice.CleanerWorkspaceService === "undefined" ? Object : _cleanerworkspaceservice.CleanerWorkspaceService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspaceservice.WorkspaceService === "undefined" ? Object : _workspaceservice.WorkspaceService,
        typeof _applicationuninstallservice.ApplicationUninstallService === "undefined" ? Object : _applicationuninstallservice.ApplicationUninstallService,
        typeof _postgresadvisorylockservice.PostgresAdvisoryLockService === "undefined" ? Object : _postgresadvisorylockservice.PostgresAdvisoryLockService
    ])
], CleanSuspendedWorkspacesJob);

//# sourceMappingURL=clean-suspended-workspaces.job.js.map