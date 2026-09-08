"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationJobService", {
    enumerable: true,
    get: function() {
        return ApplicationJobService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _enqueuejobconstant = require("../constants/enqueue-job.constant");
const _applicationexception = require("../../application.exception");
const _logicfunctiontriggerjob = require("../../../logic-function/logic-function-trigger/jobs/logic-function-trigger.job");
const _logicfunctionqueueretrybackoffconstant = require("../../../logic-function/logic-function-trigger/constants/logic-function-queue-retry-backoff.constant");
const _messagequeuedecorator = require("../../../message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../message-queue/message-queue.constants");
const _messagequeueservice = require("../../../message-queue/services/message-queue.service");
const _findflatentitybyuniversalidentifierutil = require("../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _workspacecacheservice = require("../../../../workspace-cache/services/workspace-cache.service");
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
let ApplicationJobService = class ApplicationJobService {
    async enqueueJob({ applicationId, workspaceId, userId, userWorkspaceId, input }) {
        const { enqueued, logicFunctionUniversalIdentifier } = await this.enqueueJobs({
            applicationId,
            workspaceId,
            userId,
            userWorkspaceId,
            input: {
                logicFunctionUniversalIdentifier: input.logicFunctionUniversalIdentifier,
                payloads: [
                    input.payload ?? {}
                ],
                retryLimit: input.retryLimit,
                delayMs: input.delayMs
            }
        });
        return {
            enqueued,
            logicFunctionUniversalIdentifier
        };
    }
    async enqueueJobs({ applicationId, workspaceId, userId, userWorkspaceId, input }) {
        const { logicFunctionUniversalIdentifier } = input;
        const { flatLogicFunctionMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatLogicFunctionMaps'
        ]);
        const flatLogicFunction = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatLogicFunctionMaps,
            universalIdentifier: logicFunctionUniversalIdentifier
        });
        if (!(0, _utils.isDefined)(flatLogicFunction) || (0, _utils.isDefined)(flatLogicFunction.deletedAt) || flatLogicFunction.applicationId !== applicationId) {
            throw new _applicationexception.ApplicationException(`Logic function ${logicFunctionUniversalIdentifier} not found in this application`, _applicationexception.ApplicationExceptionCode.LOGIC_FUNCTION_NOT_FOUND);
        }
        await this.messageQueueService.bulkAdd(_logicfunctiontriggerjob.LogicFunctionTriggerJob.name, input.payloads.map((payload)=>({
                logicFunctionId: flatLogicFunction.id,
                workspaceId,
                payload,
                ...(0, _utils.isDefined)(userId) ? {
                    userId
                } : {},
                ...(0, _utils.isDefined)(userWorkspaceId) ? {
                    userWorkspaceId
                } : {}
            })), {
            retryLimit: input.retryLimit ?? _enqueuejobconstant.ENQUEUE_JOB_DEFAULT_RETRY_LIMIT,
            backoff: _logicfunctionqueueretrybackoffconstant.LOGIC_FUNCTION_QUEUE_RETRY_BACKOFF,
            priority: _enqueuejobconstant.ENQUEUE_JOB_PRIORITY,
            ...(0, _utils.isDefined)(input.delayMs) ? {
                delay: input.delayMs
            } : {}
        });
        return {
            enqueued: true,
            logicFunctionUniversalIdentifier,
            enqueuedJobsCount: input.payloads.length
        };
    }
    constructor(workspaceCacheService, messageQueueService){
        this.workspaceCacheService = workspaceCacheService;
        this.messageQueueService = messageQueueService;
    }
};
ApplicationJobService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.logicFunctionQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], ApplicationJobService);

//# sourceMappingURL=application-job.service.js.map