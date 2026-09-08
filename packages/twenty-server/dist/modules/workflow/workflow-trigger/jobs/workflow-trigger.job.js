"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowTriggerJob", {
    enumerable: true,
    get: function() {
        return WorkflowTriggerJob;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _exceptionhandlerservice = require("../../../../engine/core-modules/exception-handler/exception-handler.service");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _workflowversionentity = require("../../../../engine/core-modules/workflow/entities/workflow-version.entity");
const _workflowversioncoresyncservice = require("../../../../engine/core-modules/workflow/services/workflow-version-core-sync.service");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workflowversionworkspaceentity = require("../../common/standard-objects/workflow-version.workspace-entity");
const _workflowcommonworkspaceservice = require("../../common/workspace-services/workflow-common.workspace-service");
const _workflowrunnerworkspaceservice = require("../../workflow-runner/workspace-services/workflow-runner.workspace-service");
const _workflowtriggerexception = require("../exceptions/workflow-trigger.exception");
const _buildworkflowrunsourceutil = require("../utils/build-workflow-run-source.util");
const _resolveworkflowtriggerdispatchmodeutil = require("../utils/resolve-workflow-trigger-dispatch-mode.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkflowTriggerJob = class WorkflowTriggerJob {
    async handle(data) {
        const dispatchMode = (0, _resolveworkflowtriggerdispatchmodeutil.resolveWorkflowTriggerDispatchMode)(data);
        if (dispatchMode.mode === 'INCOMPLETE') {
            this.logger.error(`Dispatch ids are half resolved for workflow ${data.workflowId} in workspace ${data.workspaceId}`);
            this.exceptionHandlerService.captureExceptions([
                new Error(`Dropped workflow trigger with half resolved dispatch ids for workflow ${data.workflowId} in workspace ${data.workspaceId}`)
            ]);
            return;
        }
        if (dispatchMode.mode === 'CORE') {
            return this.handleFromCore({
                workspaceId: data.workspaceId,
                coreWorkflowVersionId: dispatchMode.coreWorkflowVersionId,
                workspaceWorkflowVersionId: dispatchMode.workspaceWorkflowVersionId,
                payload: data.payload
            });
        }
        return this.handleFromWorkspace(data);
    }
    async handleFromCore({ workspaceId, coreWorkflowVersionId, workspaceWorkflowVersionId, payload }) {
        const coreWorkflowVersion = await this.workflowVersionCoreSyncService.findCoreVersionById(workspaceId, coreWorkflowVersionId);
        if (!(0, _utils.isDefined)(coreWorkflowVersion)) {
            this.logger.error(`Core workflow version ${coreWorkflowVersionId} not found in workspace ${workspaceId}`);
            this.exceptionHandlerService.captureExceptions([
                new Error(`Dispatched core workflow version ${coreWorkflowVersionId} not found in workspace ${workspaceId}`)
            ]);
            return;
        }
        if (coreWorkflowVersion.status !== _workflowversionentity.WorkflowVersionStatus.ACTIVE) {
            this.logger.error(`Core workflow version ${coreWorkflowVersionId} is not active in workspace ${workspaceId}`);
            this.exceptionHandlerService.captureExceptions([
                new Error(`Dropped event enqueued against core version ${coreWorkflowVersionId}, no longer active in workspace ${workspaceId}`)
            ]);
            return;
        }
        const workspaceWorkflowVersion = await this.workflowCommonWorkspaceService.getWorkflowVersionOrFail({
            workspaceId,
            workflowVersionId: workspaceWorkflowVersionId
        });
        if (workspaceWorkflowVersion.coreWorkflowVersionId !== coreWorkflowVersionId) {
            this.logger.error(`Workspace version ${workspaceWorkflowVersionId} is linked to core version ${workspaceWorkflowVersion.coreWorkflowVersionId} instead of dispatched ${coreWorkflowVersionId} in workspace ${workspaceId}`);
            this.exceptionHandlerService.captureExceptions([
                new Error(`Dispatched core version ${coreWorkflowVersionId} no longer matches the twin link of workspace version ${workspaceWorkflowVersionId} in workspace ${workspaceId}`)
            ]);
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        const workspaceWorkflow = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>this.workspaceOrmManager.getRepository('workflow', {
                shouldBypassPermissionChecks: true
            }).findOneBy({
                id: coreWorkflowVersion.workflowId
            }), authContext);
        await this.workflowRunnerWorkspaceService.run({
            workspaceId,
            workflowVersionId: workspaceWorkflowVersionId,
            payload,
            source: (0, _buildworkflowrunsourceutil.buildWorkflowRunSource)(workspaceWorkflow?.name)
        });
    }
    async handleFromWorkspace(data) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(data.workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowRepository = this.workspaceOrmManager.getRepository('workflow', {
                shouldBypassPermissionChecks: true
            });
            const workflow = await workflowRepository.findOneBy({
                id: data.workflowId
            });
            if (!workflow) {
                this.logger.error(`Workflow ${data.workflowId} not found in workspace ${data.workspaceId}`, _workflowtriggerexception.WorkflowTriggerExceptionCode.NOT_FOUND);
                return;
            }
            if (!workflow.lastPublishedVersionId) {
                this.logger.error(`Workflow ${data.workflowId} has no published version in workspace ${data.workspaceId}`, _workflowtriggerexception.WorkflowTriggerExceptionCode.INTERNAL_ERROR);
                return;
            }
            const workflowVersion = await this.workflowCommonWorkspaceService.getWorkflowVersionOrFail({
                workspaceId: data.workspaceId,
                workflowVersionId: workflow.lastPublishedVersionId
            });
            if (workflowVersion.status !== _workflowversionworkspaceentity.WorkflowVersionStatus.ACTIVE) {
                this.logger.error(`Workflow version ${workflowVersion?.id} is not active in workspace ${data.workspaceId}`, _workflowtriggerexception.WorkflowTriggerExceptionCode.INTERNAL_ERROR);
                return;
            }
            await this.workflowRunnerWorkspaceService.run({
                workspaceId: data.workspaceId,
                workflowVersionId: workflow.lastPublishedVersionId,
                payload: data.payload,
                source: (0, _buildworkflowrunsourceutil.buildWorkflowRunSource)(workflow.name)
            });
        }, authContext);
    }
    constructor(workspaceOrmManager, workflowCommonWorkspaceService, workflowRunnerWorkspaceService, workflowVersionCoreSyncService, exceptionHandlerService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.workflowCommonWorkspaceService = workflowCommonWorkspaceService;
        this.workflowRunnerWorkspaceService = workflowRunnerWorkspaceService;
        this.workflowVersionCoreSyncService = workflowVersionCoreSyncService;
        this.exceptionHandlerService = exceptionHandlerService;
        this.logger = new _common.Logger(WorkflowTriggerJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(WorkflowTriggerJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkflowTriggerJobData === "undefined" ? Object : WorkflowTriggerJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], WorkflowTriggerJob.prototype, "handle", null);
WorkflowTriggerJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.workflowQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService === "undefined" ? Object : _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService,
        typeof _workflowrunnerworkspaceservice.WorkflowRunnerWorkspaceService === "undefined" ? Object : _workflowrunnerworkspaceservice.WorkflowRunnerWorkspaceService,
        typeof _workflowversioncoresyncservice.WorkflowVersionCoreSyncService === "undefined" ? Object : _workflowversioncoresyncservice.WorkflowVersionCoreSyncService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService
    ])
], WorkflowTriggerJob);

//# sourceMappingURL=workflow-trigger.job.js.map