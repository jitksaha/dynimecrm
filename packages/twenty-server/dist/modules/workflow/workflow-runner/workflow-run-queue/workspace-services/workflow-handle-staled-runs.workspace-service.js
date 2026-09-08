"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkflowHandleStaledRunsWorkspaceService", {
    enumerable: true,
    get: function() {
        return WorkflowHandleStaledRunsWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _workflow = require("twenty-shared/workflow");
const _cachestoragedecorator = require("../../../../../engine/core-modules/cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../../../../engine/core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../../../../engine/core-modules/cache-storage/types/cache-storage-namespace.enum");
const _messagequeuedecorator = require("../../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../../engine/core-modules/message-queue/services/message-queue.service");
const _metricsservice = require("../../../../../engine/core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../../engine/core-modules/metrics/types/metrics-keys.type");
const _workspaceormmanager = require("../../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workflowrunworkspaceentity = require("../../../common/standard-objects/workflow-run.workspace-entity");
const _workflowhasrunningstepsutil = require("../../../common/utils/workflow-has-running-steps.util");
const _workflowshouldfailutil = require("../../../workflow-executor/utils/workflow-should-fail.util");
const _workflowshouldkeeprunningutil = require("../../../workflow-executor/utils/workflow-should-keep-running.util");
const _getstaledrunsfindoptionsutil = require("../utils/get-staled-runs-find-options.util");
const _getstuckrunningrunsfindoptionsutil = require("../utils/get-stuck-running-runs-find-options.util");
const _getstuckrunningrunsmonitorcachekeyutil = require("../utils/get-stuck-running-runs-monitor-cache-key.util");
const _getstuckstoppingrunsfindoptionsutil = require("../utils/get-stuck-stopping-runs-find-options.util");
const _workflowthrottlingworkspaceservice = require("./workflow-throttling.workspace-service");
const _workflowrunworkspaceservice = require("../../workflow-run/workflow-run.workspace-service");
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
let WorkflowHandleStaledRunsWorkspaceService = class WorkflowHandleStaledRunsWorkspaceService {
    async handleStaledRunsForWorkspace(workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowRunRepository = this.workspaceOrmManager.getRepository(_workflowrunworkspaceentity.WorkflowRunWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            const staledRunsCount = await workflowRunRepository.count({
                where: (0, _getstaledrunsfindoptionsutil.getStaledRunsFindOptions)()
            });
            if (staledRunsCount <= 0) {
                return;
            }
            const batchCount = Math.ceil(staledRunsCount / _constants.QUERY_MAX_RECORDS);
            for(let batchIndex = 0; batchIndex < batchCount; batchIndex++){
                const staledWorkflowRuns = await workflowRunRepository.find({
                    where: (0, _getstaledrunsfindoptionsutil.getStaledRunsFindOptions)(),
                    select: {
                        id: true
                    },
                    order: {
                        createdAt: 'ASC'
                    },
                    take: _constants.QUERY_MAX_RECORDS
                });
                if (staledWorkflowRuns.length <= 0) {
                    break;
                }
                await workflowRunRepository.update(staledWorkflowRuns.map((workflowRun)=>workflowRun.id), {
                    enqueuedAt: null,
                    status: _workflowrunworkspaceentity.WorkflowRunStatus.NOT_STARTED
                });
            }
            await this.workflowThrottlingWorkspaceService.recomputeWorkflowRunNotStartedCount(workspaceId);
        }, authContext);
    }
    async handleStuckStoppingRunsForWorkspace(workspaceId) {
        const stuckStoppingRunIds = await this.collectRunIds({
            workspaceId,
            findOptions: (0, _getstuckstoppingrunsfindoptionsutil.getStuckStoppingRunsFindOptions)()
        });
        for (const workflowRunId of stuckStoppingRunIds){
            try {
                await this.workflowRunWorkspaceService.endWorkflowRun({
                    workflowRunId,
                    workspaceId,
                    status: _workflowrunworkspaceentity.WorkflowRunStatus.STOPPED
                });
            } catch (error) {
                this.logger.error(`Failed to finalize stuck stopping workflow run ${workflowRunId} for workspace ${workspaceId}`, error);
            }
        }
    }
    // Monitoring mode: stuck RUNNING runs are only flagged, never finalized.
    // Flagged runs are re-checked on every sweep; one that ends or gets a new
    // job on its own is a false positive, disproving that it was stuck forever.
    async handleStuckRunningRunsForWorkspace(workspaceId) {
        const cacheKey = (0, _getstuckrunningrunsmonitorcachekeyutil.getStuckRunningRunsMonitorCacheKey)(workspaceId);
        const flaggedRuns = await this.cacheStorageService.get(cacheKey) ?? {};
        const stuckRunningRunIds = await this.collectRunIds({
            workspaceId,
            findOptions: (0, _getstuckrunningrunsfindoptionsutil.getStuckRunningRunsFindOptions)()
        });
        if (stuckRunningRunIds.length === 0 && Object.keys(flaggedRuns).length === 0) {
            return;
        }
        const inFlightJobs = await this.messageQueueService.getInFlightJobs();
        const hasInFlightJob = (workflowRunId)=>inFlightJobs.some((job)=>job.id?.startsWith(`${workflowRunId}-`) || job.data?.workflowRunId === workflowRunId);
        const stillFlaggedRuns = {};
        for (const [workflowRunId, detectedAt] of Object.entries(flaggedRuns)){
            try {
                const workflowRun = await this.workflowRunWorkspaceService.getWorkflowRunOrFail({
                    workflowRunId,
                    workspaceId
                });
                if (workflowRun.status !== _workflowrunworkspaceentity.WorkflowRunStatus.RUNNING || hasInFlightJob(workflowRunId)) {
                    this.logger.warn(`Stuck running workflow run ${workflowRunId} in workspace ${workspaceId} was a false positive: flagged at ${detectedAt}, now in status ${workflowRun.status}`);
                    await this.metricsService.incrementCounterForEvent({
                        key: _metricskeystype.MetricsKeys.WorkflowRunStuckRunningFalsePositive,
                        eventId: workflowRunId
                    });
                } else {
                    stillFlaggedRuns[workflowRunId] = detectedAt;
                }
            } catch (error) {
                stillFlaggedRuns[workflowRunId] = detectedAt;
                this.logger.error(`Failed to re-check flagged stuck running workflow run ${workflowRunId} for workspace ${workspaceId}`, error);
            }
        }
        for (const workflowRunId of stuckRunningRunIds){
            if ((0, _utils.isDefined)(flaggedRuns[workflowRunId]) || hasInFlightJob(workflowRunId)) {
                continue;
            }
            try {
                const expectedOutcome = await this.computeStuckRunningRunOutcome({
                    workflowRunId,
                    workspaceId
                });
                if (!(0, _utils.isDefined)(expectedOutcome)) {
                    continue;
                }
                stillFlaggedRuns[workflowRunId] = new Date().toISOString();
                this.logger.warn(`Workflow run ${workflowRunId} in workspace ${workspaceId} is stuck in RUNNING without a queue job and would have been finalized as ${expectedOutcome}`);
                await this.metricsService.incrementCounterForEvent({
                    key: _metricskeystype.MetricsKeys.WorkflowRunStuckRunningDetected,
                    eventId: workflowRunId
                });
            } catch (error) {
                this.logger.error(`Failed to check stuck running workflow run ${workflowRunId} for workspace ${workspaceId}`, error);
            }
        }
        await this.cacheStorageService.set(cacheKey, stillFlaggedRuns);
    }
    async computeStuckRunningRunOutcome({ workflowRunId, workspaceId }) {
        const workflowRun = await this.workflowRunWorkspaceService.getWorkflowRunOrFail({
            workflowRunId,
            workspaceId
        });
        if (workflowRun.status !== _workflowrunworkspaceentity.WorkflowRunStatus.RUNNING) {
            return undefined;
        }
        const stepInfos = workflowRun.state?.stepInfos;
        const steps = workflowRun.state?.flow?.steps;
        if (!(0, _utils.isDefined)(stepInfos) || !(0, _utils.isDefined)(steps) || (0, _workflowhasrunningstepsutil.workflowHasRunningSteps)({
            stepInfos,
            steps
        })) {
            return _workflowrunworkspaceentity.WorkflowRunStatus.FAILED;
        }
        if ((0, _workflowshouldfailutil.workflowShouldFail)({
            stepInfos,
            steps
        })) {
            return _workflowrunworkspaceentity.WorkflowRunStatus.FAILED;
        }
        const hasPendingSteps = steps.some((step)=>stepInfos[step.id]?.status === _workflow.StepStatus.PENDING);
        if (hasPendingSteps) {
            return undefined;
        }
        if ((0, _workflowshouldkeeprunningutil.workflowShouldKeepRunning)({
            stepInfos,
            steps
        })) {
            return _workflowrunworkspaceentity.WorkflowRunStatus.FAILED;
        }
        return _workflowrunworkspaceentity.WorkflowRunStatus.COMPLETED;
    }
    async collectRunIds({ workspaceId, findOptions }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowRunRepository = this.workspaceOrmManager.getRepository(_workflowrunworkspaceentity.WorkflowRunWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            const runIds = [];
            let page;
            do {
                page = await workflowRunRepository.find({
                    where: findOptions,
                    select: {
                        id: true
                    },
                    order: {
                        createdAt: 'ASC',
                        id: 'ASC'
                    },
                    take: _constants.QUERY_MAX_RECORDS,
                    skip: runIds.length
                });
                runIds.push(...page.map((workflowRun)=>workflowRun.id));
            }while (page.length === _constants.QUERY_MAX_RECORDS)
            return runIds;
        }, authContext);
    }
    constructor(workspaceOrmManager, workflowThrottlingWorkspaceService, workflowRunWorkspaceService, messageQueueService, metricsService, cacheStorageService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.workflowThrottlingWorkspaceService = workflowThrottlingWorkspaceService;
        this.workflowRunWorkspaceService = workflowRunWorkspaceService;
        this.messageQueueService = messageQueueService;
        this.metricsService = metricsService;
        this.cacheStorageService = cacheStorageService;
        this.logger = new _common.Logger(WorkflowHandleStaledRunsWorkspaceService.name);
    }
};
WorkflowHandleStaledRunsWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.workflowQueue)),
    _ts_param(5, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.ModuleWorkflow)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workflowthrottlingworkspaceservice.WorkflowThrottlingWorkspaceService === "undefined" ? Object : _workflowthrottlingworkspaceservice.WorkflowThrottlingWorkspaceService,
        typeof _workflowrunworkspaceservice.WorkflowRunWorkspaceService === "undefined" ? Object : _workflowrunworkspaceservice.WorkflowRunWorkspaceService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService,
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService
    ])
], WorkflowHandleStaledRunsWorkspaceService);

//# sourceMappingURL=workflow-handle-staled-runs.workspace-service.js.map