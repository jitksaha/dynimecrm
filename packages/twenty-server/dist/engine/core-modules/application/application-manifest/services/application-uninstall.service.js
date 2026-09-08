"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationUninstallService", {
    enumerable: true,
    get: function() {
        return ApplicationUninstallService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _applicationentity = require("../../application.entity");
const _applicationexception = require("../../application.exception");
const _applicationservice = require("../../application.service");
const _buildworkspaceuninstallhookpayloadutil = require("../utils/build-workspace-uninstall-hook-payload.util");
const _isapplicationuninstallhookpendingutil = require("../../utils/is-application-uninstall-hook-pending.util");
const _logicfunctionexecutorservice = require("../../../logic-function/logic-function-executor/logic-function-executor.service");
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
let ApplicationUninstallService = class ApplicationUninstallService {
    async runUninstallHooksForWorkspaceDeletion({ workspaceId, workspaceDeletedAt }) {
        const applications = await this.applicationService.findManyApplications(workspaceId);
        const pendingApplications = applications.filter((application)=>(0, _isapplicationuninstallhookpendingutil.isApplicationUninstallHookPending)(application, workspaceDeletedAt));
        const applicationUninstallHookFailures = [];
        for (const application of pendingApplications){
            try {
                await this.runUninstallHookForWorkspaceDeletion({
                    application,
                    workspaceId,
                    workspaceDeletedAt
                });
                await this.applicationRepository.update(application.id, {
                    uninstallHookCompletedForRequestedAt: workspaceDeletedAt
                });
            } catch (error) {
                const applicationUninstallHookFailure = `${application.universalIdentifier}: ${error instanceof Error ? error.message : String(error)}`;
                applicationUninstallHookFailures.push(applicationUninstallHookFailure);
                this.logger.warn(`workspace-deletion uninstall hook failed: ${applicationUninstallHookFailure}`);
            }
        }
        if ((0, _utils.isNonEmptyArray)(applicationUninstallHookFailures)) {
            throw new _applicationexception.ApplicationException(`Application uninstall hooks failed for workspace ${workspaceId}: ${applicationUninstallHookFailures.join('; ')}`, _applicationexception.ApplicationExceptionCode.UNINSTALL_ERROR);
        }
    }
    async runUninstallHooksForWorkspaceDeletionBestEffort({ workspaceId, workspaceDeletedAt }) {
        try {
            await this.runUninstallHooksForWorkspaceDeletion({
                workspaceId,
                workspaceDeletedAt
            });
        } catch (error) {
            this.logger.warn(`Uninstall hooks failed before hard deleting workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async findWorkspaceIdsWithPendingUninstallHooks(workspaceUninstallRequests) {
        if (!(0, _utils.isNonEmptyArray)(workspaceUninstallRequests)) {
            return new Set();
        }
        const applications = await this.applicationRepository.find({
            select: [
                'workspaceId',
                'uninstallLogicFunctionId',
                'uninstallHookCompletedForRequestedAt'
            ],
            where: {
                workspaceId: (0, _typeorm1.In)(workspaceUninstallRequests.map((request)=>request.workspaceId))
            }
        });
        const uninstallRequestedAtByWorkspaceId = new Map(workspaceUninstallRequests.map((request)=>[
                request.workspaceId,
                request.uninstallRequestedAt
            ]));
        const workspaceIdsWithPendingUninstallHooks = new Set();
        for (const application of applications){
            const uninstallRequestedAt = uninstallRequestedAtByWorkspaceId.get(application.workspaceId);
            if ((0, _utils.isDefined)(uninstallRequestedAt) && (0, _isapplicationuninstallhookpendingutil.isApplicationUninstallHookPending)(application, uninstallRequestedAt)) {
                workspaceIdsWithPendingUninstallHooks.add(application.workspaceId);
            }
        }
        return workspaceIdsWithPendingUninstallHooks;
    }
    async runUninstallHookBestEffort({ application, workspaceId }) {
        try {
            await this.runUninstallHook({
                application,
                workspaceId,
                payload: {
                    version: application.version ?? undefined
                }
            });
        } catch (error) {
            this.logger.warn(`Uninstall hook failed for application ${application.universalIdentifier}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async runUninstallHookForWorkspaceDeletion({ application, workspaceId, workspaceDeletedAt }) {
        await this.runUninstallHook({
            application,
            workspaceId,
            workspaceDeletionRequestTimestamp: workspaceDeletedAt.toISOString(),
            payload: (0, _buildworkspaceuninstallhookpayloadutil.buildWorkspaceUninstallHookPayload)({
                applicationVersion: application.version,
                applicationUniversalIdentifier: application.universalIdentifier,
                workspaceId,
                uninstallRequestedAt: workspaceDeletedAt
            })
        });
    }
    async runUninstallHook({ application, workspaceId, payload, workspaceDeletionRequestTimestamp }) {
        if (!(0, _utils.isDefined)(application.uninstallLogicFunctionId)) {
            return;
        }
        this.logger.log(`Executing uninstall hook for application ${application.universalIdentifier}`);
        const logicFunctionExecutionResult = await this.logicFunctionExecutorService.execute({
            logicFunctionId: application.uninstallLogicFunctionId,
            workspaceId,
            payload,
            ...(0, _utils.isDefined)(workspaceDeletionRequestTimestamp) ? {
                workspaceDeletionRequestTimestamp
            } : {}
        });
        if ((0, _utils.isDefined)(logicFunctionExecutionResult.error)) {
            throw new _applicationexception.ApplicationException(logicFunctionExecutionResult.error.errorMessage, _applicationexception.ApplicationExceptionCode.UNINSTALL_ERROR);
        }
    }
    constructor(applicationRepository, applicationService, logicFunctionExecutorService){
        this.applicationRepository = applicationRepository;
        this.applicationService = applicationService;
        this.logicFunctionExecutorService = logicFunctionExecutorService;
        this.logger = new _common.Logger(ApplicationUninstallService.name);
    }
};
ApplicationUninstallService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _logicfunctionexecutorservice.LogicFunctionExecutorService === "undefined" ? Object : _logicfunctionexecutorservice.LogicFunctionExecutorService
    ])
], ApplicationUninstallService);

//# sourceMappingURL=application-uninstall.service.js.map