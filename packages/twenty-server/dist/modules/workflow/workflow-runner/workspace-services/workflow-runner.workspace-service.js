"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowRunnerWorkspaceService", {
    enumerable: true,
    get: function() {
        return WorkflowRunnerWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _billingusageservice = require("../../../../engine/core-modules/billing/services/billing-usage.service");
const _messagequeuedecorator = require("../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../engine/core-modules/message-queue/services/message-queue.service");
const _metricsservice = require("../../../../engine/core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../engine/core-modules/metrics/types/metrics-keys.type");
const _workflowversionstepexception = require("../../common/exceptions/workflow-version-step.exception");
const _workflowrunworkspaceentity = require("../../common/standard-objects/workflow-run.workspace-entity");
const _setalliteratorsstepinfosasstoppedutil = require("../../common/utils/set-all-iterators-step-infos-as-stopped.util");
const _workflowhasrunningstepsutil = require("../../common/utils/workflow-has-running-steps.util");
const _workflowcommonworkspaceservice = require("../../common/workspace-services/workflow-common.workspace-service");
const _workflowversionstepoperationsworkspaceservice = require("../../workflow-builder/workflow-version-step/workflow-version-step-operations.workspace-service");
const _isworkflowformactionguard = require("../../workflow-executor/workflow-actions/form/guards/is-workflow-form-action.guard");
const _workflowrunexception = require("../exceptions/workflow-run.exception");
const _runworkflowjob = require("../jobs/run-workflow.job");
const _buildretrystepinfosutil = require("../utils/build-retry-step-infos.util");
const _buildrunworkflowjoboptionsutil = require("../utils/build-run-workflow-job-options.util");
const _getrunnablestepidsutil = require("../utils/get-runnable-step-ids.util");
const _workflowrunenqueuejob = require("../workflow-run-queue/jobs/workflow-run-enqueue.job");
const _workflowthrottlingworkspaceservice = require("../workflow-run-queue/workspace-services/workflow-throttling.workspace-service");
const _workflowrunworkspaceservice = require("../workflow-run/workflow-run.workspace-service");
const _workflowtriggertype = require("../../workflow-trigger/types/workflow-trigger.type");
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
let WorkflowRunnerWorkspaceService = class WorkflowRunnerWorkspaceService {
    async run({ workspaceId, workflowVersionId, payload, source, workflowRunId: initialWorkflowRunId }) {
        const canFeatureBeUsed = await this.billingUsageService.canFeatureBeUsed(workspaceId);
        if (!canFeatureBeUsed) {
            this.logger.log('Cannot execute billed function, there is no subscription for this workspace');
        }
        const workflowVersion = await this.workflowCommonWorkspaceService.getWorkflowVersionOrFail({
            workspaceId,
            workflowVersionId
        });
        const isManualTrigger = workflowVersion.trigger?.type === _workflowtriggertype.WorkflowTriggerType.MANUAL;
        const isHardThrottled = await this.checkHardThrottleLimit(workspaceId);
        if (isHardThrottled) {
            this.logger.log(`Workflow throttled for workspace ${workspaceId}`);
            return this.createFailedWorkflowRun({
                workspaceId,
                workflowVersionId,
                initialWorkflowRunId,
                source,
                payload
            });
        }
        if (isManualTrigger) {
            return this.enqueueWorkflowRun({
                workspaceId,
                workflowVersionId,
                initialWorkflowRunId,
                source,
                payload
            });
        }
        return this.createNotStartedWorkflowRunAndTriggerEnqueueJob({
            workspaceId,
            workflowVersionId,
            initialWorkflowRunId,
            source,
            payload
        });
    }
    async resume({ workspaceId, workflowRunId, lastExecutedStepId }) {
        await this.messageQueueService.add(_runworkflowjob.RunWorkflowJob.name, {
            workspaceId,
            workflowRunId,
            lastExecutedStepId
        }, (0, _buildrunworkflowjoboptionsutil.buildRunWorkflowJobOptions)(workflowRunId));
    }
    async submitFormStep({ workspaceId, stepId, workflowRunId, response }) {
        const workflowRun = await this.workflowRunWorkspaceService.getWorkflowRunOrFail({
            workflowRunId,
            workspaceId
        });
        const step = workflowRun.state?.flow?.steps?.find((step)=>step.id === stepId);
        if (!(0, _utils.isDefined)(step)) {
            throw new _workflowversionstepexception.WorkflowVersionStepException('Step not found', _workflowversionstepexception.WorkflowVersionStepExceptionCode.NOT_FOUND);
        }
        if (!(0, _isworkflowformactionguard.isWorkflowFormAction)(step)) {
            throw new _workflowversionstepexception.WorkflowVersionStepException('Step is not a form', _workflowversionstepexception.WorkflowVersionStepExceptionCode.INVALID_REQUEST, {
                userFriendlyMessage: /*i18n*/ {
                    id: "u+rv4L",
                    message: "Step is not a form"
                }
            });
        }
        const enrichedResponse = await this.workflowVersionStepOperationsWorkspaceService.enrichFormStepResponse({
            workspaceId,
            step,
            response
        });
        await this.workflowRunWorkspaceService.updateWorkflowRunStepInfo({
            stepId,
            stepInfo: {
                status: _workflow.StepStatus.SUCCESS,
                result: enrichedResponse
            },
            workspaceId,
            workflowRunId
        });
        await this.resume({
            workspaceId,
            workflowRunId,
            lastExecutedStepId: stepId
        });
    }
    async stopWorkflowRun(workspaceId, workflowRunId) {
        const workflowRun = await this.workflowRunWorkspaceService.getWorkflowRunOrFail({
            workflowRunId,
            workspaceId
        });
        const stoppableStatuses = [
            _workflowrunworkspaceentity.WorkflowRunStatus.NOT_STARTED,
            _workflowrunworkspaceentity.WorkflowRunStatus.ENQUEUED,
            _workflowrunworkspaceentity.WorkflowRunStatus.RUNNING
        ];
        if (!stoppableStatuses.includes(workflowRun.status)) {
            return {
                id: workflowRun.id,
                status: workflowRun.status
            };
        }
        const wasNotStarted = workflowRun.status === _workflowrunworkspaceentity.WorkflowRunStatus.NOT_STARTED;
        let newStatus;
        if (!(0, _utils.isDefined)(workflowRun.state)) {
            await this.workflowRunWorkspaceService.endWorkflowRun({
                workflowRunId,
                workspaceId,
                status: _workflowrunworkspaceentity.WorkflowRunStatus.STOPPED
            });
            newStatus = _workflowrunworkspaceentity.WorkflowRunStatus.STOPPED;
        } else {
            const stepInfos = workflowRun.state.stepInfos;
            const steps = workflowRun.state.flow.steps;
            if ((0, _workflowhasrunningstepsutil.workflowHasRunningSteps)({
                stepInfos,
                steps
            })) {
                const stoppedIteratorStepInfos = (0, _setalliteratorsstepinfosasstoppedutil.setAllIteratorsStepInfosAsStopped)({
                    stepInfos,
                    steps
                });
                const mergedStepInfos = {
                    ...stepInfos,
                    ...stoppedIteratorStepInfos
                };
                await this.workflowRunWorkspaceService.updateWorkflowRun({
                    workflowRunId,
                    workspaceId,
                    partialUpdate: {
                        status: _workflowrunworkspaceentity.WorkflowRunStatus.STOPPING,
                        state: {
                            ...workflowRun.state,
                            stepInfos: mergedStepInfos
                        }
                    }
                });
                newStatus = _workflowrunworkspaceentity.WorkflowRunStatus.STOPPING;
            } else {
                await this.workflowRunWorkspaceService.endWorkflowRun({
                    workflowRunId,
                    workspaceId,
                    status: _workflowrunworkspaceentity.WorkflowRunStatus.STOPPED
                });
                newStatus = _workflowrunworkspaceentity.WorkflowRunStatus.STOPPED;
            }
        }
        // Release the cached not-started slot only after the stop has been
        // persisted, so a persistence failure can't desync the throttle counter.
        if (wasNotStarted) {
            await this.workflowThrottlingWorkspaceService.decreaseWorkflowRunNotStartedCount(workspaceId);
        }
        return {
            id: workflowRun.id,
            status: newStatus
        };
    }
    async retryWorkflowRun(workspaceId, workflowRunId) {
        const workflowRun = await this.workflowRunWorkspaceService.getWorkflowRunOrFail({
            workflowRunId,
            workspaceId
        });
        if (workflowRun.status !== _workflowrunworkspaceentity.WorkflowRunStatus.FAILED) {
            return {
                id: workflowRun.id,
                status: workflowRun.status
            };
        }
        if (!(0, _utils.isDefined)(workflowRun.state)) {
            throw new _workflowrunexception.WorkflowRunException('Cannot retry a workflow run without state', _workflowrunexception.WorkflowRunExceptionCode.WORKFLOW_RUN_INVALID);
        }
        const steps = workflowRun.state.flow.steps;
        const { stepInfosToUpdate, stepIdsToRetry } = (0, _buildretrystepinfosutil.buildRetryStepInfos)({
            steps,
            stepInfos: workflowRun.state.stepInfos
        });
        const mergedStepInfos = {
            ...workflowRun.state.stepInfos,
            ...stepInfosToUpdate
        };
        const runnableStepIds = (0, _getrunnablestepidsutil.getRunnableStepIds)({
            steps,
            stepInfos: mergedStepInfos
        });
        const stepIdsToRun = Array.from(new Set([
            ...stepIdsToRetry,
            ...runnableStepIds
        ]));
        if (stepIdsToRun.length === 0) {
            return {
                id: workflowRun.id,
                status: workflowRun.status
            };
        }
        await this.workflowRunWorkspaceService.updateWorkflowRun({
            workflowRunId,
            workspaceId,
            partialUpdate: {
                status: _workflowrunworkspaceentity.WorkflowRunStatus.RUNNING,
                endedAt: null,
                state: {
                    ...workflowRun.state,
                    stepInfos: mergedStepInfos,
                    workflowRunError: undefined
                }
            }
        });
        try {
            await this.messageQueueService.add(_runworkflowjob.RunWorkflowJob.name, {
                workspaceId,
                workflowRunId,
                stepIdsToRetry: stepIdsToRun
            }, (0, _buildrunworkflowjoboptionsutil.buildRunWorkflowJobOptions)(workflowRunId));
        } catch (error) {
            // The job couldn't be enqueued: revert to the previous failed state so
            // the run isn't left stuck as RUNNING without a worker job.
            await this.workflowRunWorkspaceService.updateWorkflowRun({
                workflowRunId,
                workspaceId,
                partialUpdate: {
                    status: _workflowrunworkspaceentity.WorkflowRunStatus.FAILED,
                    endedAt: workflowRun.endedAt,
                    state: workflowRun.state
                }
            });
            throw error;
        }
        return {
            id: workflowRun.id,
            status: _workflowrunworkspaceentity.WorkflowRunStatus.RUNNING
        };
    }
    async checkHardThrottleLimit(workspaceId) {
        try {
            await this.workflowThrottlingWorkspaceService.throttleOrThrowIfHardLimitReached(workspaceId);
            return false;
        } catch  {
            void this.metricsService.incrementCounterForEvent({
                key: _metricskeystype.MetricsKeys.WorkflowRunThrottled,
                eventId: workspaceId
            });
            return true;
        }
    }
    async createFailedWorkflowRun({ workspaceId, workflowVersionId, initialWorkflowRunId, source, payload }) {
        const workflowRunId = await this.workflowRunWorkspaceService.createWorkflowRun({
            workflowVersionId,
            workflowRunId: initialWorkflowRunId,
            createdBy: source,
            status: _workflowrunworkspaceentity.WorkflowRunStatus.FAILED,
            triggerPayload: payload,
            error: 'Throttle limit reached',
            workspaceId
        });
        return {
            workflowRunId
        };
    }
    async enqueueWorkflowRun({ workspaceId, workflowVersionId, initialWorkflowRunId, source, payload }) {
        const workflowRunId = await this.workflowRunWorkspaceService.createWorkflowRun({
            workflowVersionId,
            workflowRunId: initialWorkflowRunId,
            createdBy: source,
            status: _workflowrunworkspaceentity.WorkflowRunStatus.ENQUEUED,
            triggerPayload: payload,
            workspaceId
        });
        await this.messageQueueService.add(_runworkflowjob.RunWorkflowJob.name, {
            workspaceId,
            workflowRunId
        }, (0, _buildrunworkflowjoboptionsutil.buildRunWorkflowJobOptions)(workflowRunId));
        return {
            workflowRunId
        };
    }
    async createNotStartedWorkflowRunAndTriggerEnqueueJob({ workspaceId, workflowVersionId, initialWorkflowRunId, source, payload }) {
        const workflowRunId = await this.workflowRunWorkspaceService.createWorkflowRun({
            workflowVersionId,
            workflowRunId: initialWorkflowRunId,
            createdBy: source,
            status: _workflowrunworkspaceentity.WorkflowRunStatus.NOT_STARTED,
            triggerPayload: payload,
            workspaceId
        });
        await this.workflowThrottlingWorkspaceService.increaseWorkflowRunNotStartedCount(workspaceId);
        await this.messageQueueService.add(_workflowrunenqueuejob.WorkflowRunEnqueueJob.name, {
            workspaceId,
            isCacheMode: true
        });
        return {
            workflowRunId
        };
    }
    constructor(workflowRunWorkspaceService, workflowCommonWorkspaceService, messageQueueService, billingUsageService, workflowVersionStepOperationsWorkspaceService, workflowThrottlingWorkspaceService, metricsService){
        this.workflowRunWorkspaceService = workflowRunWorkspaceService;
        this.workflowCommonWorkspaceService = workflowCommonWorkspaceService;
        this.messageQueueService = messageQueueService;
        this.billingUsageService = billingUsageService;
        this.workflowVersionStepOperationsWorkspaceService = workflowVersionStepOperationsWorkspaceService;
        this.workflowThrottlingWorkspaceService = workflowThrottlingWorkspaceService;
        this.metricsService = metricsService;
        this.logger = new _common.Logger(WorkflowRunnerWorkspaceService.name);
    }
};
WorkflowRunnerWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.workflowQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workflowrunworkspaceservice.WorkflowRunWorkspaceService === "undefined" ? Object : _workflowrunworkspaceservice.WorkflowRunWorkspaceService,
        typeof _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService === "undefined" ? Object : _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _billingusageservice.BillingUsageService === "undefined" ? Object : _billingusageservice.BillingUsageService,
        typeof _workflowversionstepoperationsworkspaceservice.WorkflowVersionStepOperationsWorkspaceService === "undefined" ? Object : _workflowversionstepoperationsworkspaceservice.WorkflowVersionStepOperationsWorkspaceService,
        typeof _workflowthrottlingworkspaceservice.WorkflowThrottlingWorkspaceService === "undefined" ? Object : _workflowthrottlingworkspaceservice.WorkflowThrottlingWorkspaceService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], WorkflowRunnerWorkspaceService);

//# sourceMappingURL=workflow-runner.workspace-service.js.map