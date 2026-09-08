"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CallDatabaseEventTriggerJobsJob", {
    enumerable: true,
    get: function() {
        return CallDatabaseEventTriggerJobsJob;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _findactiveflatapplicationbyidutil = require("../../../../application/utils/find-active-flat-application-by-id.util");
const _messagequeuedecorator = require("../../../../message-queue/decorators/message-queue.decorator");
const _processdecorator = require("../../../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../message-queue/message-queue.constants");
const _applicationjobenqueuethrottlerservice = require("../../../../message-queue/services/application-job-enqueue-throttler.service");
const _messagequeueservice = require("../../../../message-queue/services/message-queue.service");
const _throttlerexception = require("../../../../throttler/throttler.exception");
const _logicfunctionqueueretrybackoffconstant = require("../../constants/logic-function-queue-retry-backoff.constant");
const _transformeventbatchtoeventpayloads = require("./utils/transform-event-batch-to-event-payloads");
const _logicfunctiontriggerjob = require("../../jobs/logic-function-trigger.job");
const _workspacecacheservice = require("../../../../../workspace-cache/services/workspace-cache.service");
const _workspaceeventbatchtype = require("../../../../../workspace-event-emitter/types/workspace-event-batch.type");
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
let CallDatabaseEventTriggerJobsJob = class CallDatabaseEventTriggerJobsJob {
    async handle(workspaceEventBatch) {
        const { flatLogicFunctionMaps, flatApplicationMaps } = await this.workspaceCacheService.getOrRecompute(workspaceEventBatch.workspaceId, [
            'flatLogicFunctionMaps',
            'flatApplicationMaps'
        ]);
        const logicFunctionsWithDatabaseEventTrigger = Object.values(flatLogicFunctionMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((logicFunction)=>!(0, _utils.isDefined)(logicFunction.deletedAt) && (0, _utils.isDefined)(logicFunction.databaseEventTriggerSettings));
        const logicFunctionsToTrigger = logicFunctionsWithDatabaseEventTrigger.filter((logicFunction)=>this.shouldTriggerJob({
                workspaceEventBatch,
                eventName: (0, _utils.isDefined)(logicFunction.databaseEventTriggerSettings) ? logicFunction.databaseEventTriggerSettings.eventName : ''
            }));
        const logicFunctionsByApplicationId = new Map();
        for (const logicFunction of logicFunctionsToTrigger){
            const applicationLogicFunctions = logicFunctionsByApplicationId.get(logicFunction.applicationId) ?? [];
            applicationLogicFunctions.push(logicFunction);
            logicFunctionsByApplicationId.set(logicFunction.applicationId, applicationLogicFunctions);
        }
        for (const [applicationId, logicFunctions] of logicFunctionsByApplicationId){
            const application = (0, _findactiveflatapplicationbyidutil.findActiveFlatApplicationById)(flatApplicationMaps, applicationId);
            const applicationRegistrationId = application?.applicationRegistrationId;
            if (!(0, _utils.isDefined)(applicationRegistrationId)) {
                continue;
            }
            const logicFunctionPayloads = (0, _transformeventbatchtoeventpayloads.transformEventBatchToEventPayloads)({
                logicFunctions,
                workspaceEventBatch
            });
            if (logicFunctionPayloads.length === 0) {
                continue;
            }
            try {
                await this.applicationJobEnqueueThrottlerService.throttleOrThrow({
                    applicationId,
                    applicationRegistrationId,
                    jobCount: logicFunctionPayloads.length
                });
            } catch (error) {
                if (error instanceof _throttlerexception.ThrottlerException) {
                    this.logger.warn(`Enqueue throttled for application ${applicationId} (registration ${applicationRegistrationId}) in workspace ${workspaceEventBatch.workspaceId}: skipping ${logicFunctionPayloads.length} logic function trigger(s)`);
                    continue;
                }
                throw error;
            }
            await this.messageQueueService.bulkAdd(_logicfunctiontriggerjob.LogicFunctionTriggerJob.name, logicFunctionPayloads, {
                retryLimit: 3,
                backoff: _logicfunctionqueueretrybackoffconstant.LOGIC_FUNCTION_QUEUE_RETRY_BACKOFF
            });
        }
    }
    shouldTriggerJob({ workspaceEventBatch, eventName }) {
        const [nameSingular, operation] = workspaceEventBatch.name.split('.');
        const validEventNames = [
            `${nameSingular}.${operation}`,
            `*.${operation}`,
            `${nameSingular}.*`,
            '*.*'
        ];
        return validEventNames.includes(eventName);
    }
    constructor(messageQueueService, workspaceCacheService, applicationJobEnqueueThrottlerService){
        this.messageQueueService = messageQueueService;
        this.workspaceCacheService = workspaceCacheService;
        this.applicationJobEnqueueThrottlerService = applicationJobEnqueueThrottlerService;
        this.logger = new _common.Logger(CallDatabaseEventTriggerJobsJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(CallDatabaseEventTriggerJobsJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceeventbatchtype.WorkspaceEventBatch === "undefined" ? Object : _workspaceeventbatchtype.WorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], CallDatabaseEventTriggerJobsJob.prototype, "handle", null);
CallDatabaseEventTriggerJobsJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.triggerQueue),
    _ts_param(0, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.logicFunctionQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _applicationjobenqueuethrottlerservice.ApplicationJobEnqueueThrottlerService === "undefined" ? Object : _applicationjobenqueuethrottlerservice.ApplicationJobEnqueueThrottlerService
    ])
], CallDatabaseEventTriggerJobsJob);

//# sourceMappingURL=call-database-event-trigger-jobs.job.js.map