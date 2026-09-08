"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceDeletionApplicationUninstallJob", {
    enumerable: true,
    get: function() {
        return WorkspaceDeletionApplicationUninstallJob;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _postgresadvisorylockservice = require("../../../../database/typeorm/postgres-advisory-lock.service");
const _applicationuninstallservice = require("../../application/application-manifest/services/application-uninstall.service");
const _processdecorator = require("../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _getworkspaceapplicationuninstalllocknameutil = require("../utils/get-workspace-application-uninstall-lock-name.util");
const _isworkspacedeletionpendingutil = require("../utils/is-workspace-deletion-pending.util");
const _workspaceentity = require("../workspace.entity");
const _workspaceexception = require("../workspace.exception");
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
let WorkspaceDeletionApplicationUninstallJob = class WorkspaceDeletionApplicationUninstallJob {
    async handle({ workspaceId }) {
        const advisoryLockResult = await this.postgresAdvisoryLockService.tryWithLock((0, _getworkspaceapplicationuninstalllocknameutil.getWorkspaceApplicationUninstallLockName)(workspaceId), async ()=>{
            const workspace = await this.workspaceRepository.findOne({
                where: {
                    id: workspaceId
                },
                withDeleted: true
            });
            if (!(0, _isworkspacedeletionpendingutil.isWorkspaceDeletionPending)(workspace)) {
                return;
            }
            await this.applicationUninstallService.runUninstallHooksForWorkspaceDeletion({
                workspaceId,
                workspaceDeletedAt: workspace.deletedAt
            });
        });
        if (!advisoryLockResult.acquired) {
            throw new _workspaceexception.WorkspaceException(`Workspace ${workspaceId} application uninstall is already running`, _workspaceexception.WorkspaceExceptionCode.APPLICATION_UNINSTALL_IN_PROGRESS);
        }
    }
    constructor(workspaceRepository, applicationUninstallService, postgresAdvisoryLockService){
        this.workspaceRepository = workspaceRepository;
        this.applicationUninstallService = applicationUninstallService;
        this.postgresAdvisoryLockService = postgresAdvisoryLockService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(WorkspaceDeletionApplicationUninstallJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceDeletionApplicationUninstallJobData === "undefined" ? Object : WorkspaceDeletionApplicationUninstallJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkspaceDeletionApplicationUninstallJob.prototype, "handle", null);
WorkspaceDeletionApplicationUninstallJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.logicFunctionQueue),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof _applicationuninstallservice.ApplicationUninstallService === "undefined" ? Object : _applicationuninstallservice.ApplicationUninstallService,
        typeof _postgresadvisorylockservice.PostgresAdvisoryLockService === "undefined" ? Object : _postgresadvisorylockservice.PostgresAdvisoryLockService
    ])
], WorkspaceDeletionApplicationUninstallJob);

//# sourceMappingURL=workspace-deletion-application-uninstall.job.js.map