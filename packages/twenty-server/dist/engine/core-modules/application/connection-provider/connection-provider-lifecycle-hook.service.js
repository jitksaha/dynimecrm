"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectionProviderLifecycleHookService", {
    enumerable: true,
    get: function() {
        return ConnectionProviderLifecycleHookService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _connectionproviderexceptioncodeenum = require("./connection-provider-exception-code.enum");
const _connectionproviderexception = require("./connection-provider.exception");
const _connectionproviderservice = require("./connection-provider.service");
const _exceptionhandlerservice = require("../../exception-handler/exception-handler.service");
const _logicfunctionqueueretrybackoffconstant = require("../../logic-function/logic-function-trigger/constants/logic-function-queue-retry-backoff.constant");
const _logicfunctiontriggerjob = require("../../logic-function/logic-function-trigger/jobs/logic-function-trigger.job");
const _messagequeuedecorator = require("../../message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _messagequeueservice = require("../../message-queue/services/message-queue.service");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
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
const MISSING_LOGIC_FUNCTION_EXCEPTION_CODE_BY_HOOK = {
    onConnect: _connectionproviderexceptioncodeenum.ConnectionProviderExceptionCode.ON_CONNECT_LOGIC_FUNCTION_NOT_FOUND,
    onDisconnect: _connectionproviderexceptioncodeenum.ConnectionProviderExceptionCode.ON_DISCONNECT_LOGIC_FUNCTION_NOT_FOUND
};
let ConnectionProviderLifecycleHookService = class ConnectionProviderLifecycleHookService {
    async dispatchOnConnect({ provider, workspaceId, connectedAccountId }) {
        await this.captureFailures(workspaceId, ()=>this.enqueueLogicFunction({
                hook: 'onConnect',
                logicFunctionUniversalIdentifier: provider.onConnectLogicFunctionUniversalIdentifier,
                provider,
                workspaceId,
                connectedAccountId
            }));
    }
    async dispatchOnDisconnect({ connectionProviderId, workspaceId, connectedAccountId }) {
        await this.captureFailures(workspaceId, async ()=>{
            const provider = await this.connectionProviderService.findOneByIdOrThrow(connectionProviderId);
            await this.enqueueLogicFunction({
                hook: 'onDisconnect',
                logicFunctionUniversalIdentifier: provider.onDisconnectLogicFunctionUniversalIdentifier,
                provider,
                workspaceId,
                connectedAccountId
            });
        });
    }
    // Lifecycle hooks are best effort: a failing hook must never surface to the
    // user connecting or disconnecting their account.
    async captureFailures(workspaceId, dispatch) {
        try {
            await dispatch();
        } catch (error) {
            this.exceptionHandlerService.captureExceptions([
                error
            ], {
                workspace: {
                    id: workspaceId
                }
            });
        }
    }
    async enqueueLogicFunction({ hook, logicFunctionUniversalIdentifier, provider, workspaceId, connectedAccountId }) {
        if (!(0, _utils.isDefined)(logicFunctionUniversalIdentifier)) {
            return;
        }
        const { flatLogicFunctionMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatLogicFunctionMaps'
        ]);
        const flatLogicFunction = flatLogicFunctionMaps.byUniversalIdentifier[logicFunctionUniversalIdentifier];
        if (!(0, _utils.isDefined)(flatLogicFunction) || (0, _utils.isDefined)(flatLogicFunction.deletedAt)) {
            throw new _connectionproviderexception.ConnectionProviderException(`Connection provider ${provider.id} references ${hook} logic function ${logicFunctionUniversalIdentifier}, which was not found in workspace ${workspaceId}.`, MISSING_LOGIC_FUNCTION_EXCEPTION_CODE_BY_HOOK[hook]);
        }
        await this.messageQueueService.add(_logicfunctiontriggerjob.LogicFunctionTriggerJob.name, {
            logicFunctionId: flatLogicFunction.id,
            workspaceId,
            payload: {
                connectionProviderId: provider.id,
                connectionProviderName: provider.name,
                connectedAccountId
            }
        }, {
            retryLimit: 3,
            backoff: _logicfunctionqueueretrybackoffconstant.LOGIC_FUNCTION_QUEUE_RETRY_BACKOFF
        });
    }
    constructor(connectionProviderService, messageQueueService, workspaceCacheService, exceptionHandlerService){
        this.connectionProviderService = connectionProviderService;
        this.messageQueueService = messageQueueService;
        this.workspaceCacheService = workspaceCacheService;
        this.exceptionHandlerService = exceptionHandlerService;
    }
};
ConnectionProviderLifecycleHookService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.logicFunctionQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _connectionproviderservice.ConnectionProviderService === "undefined" ? Object : _connectionproviderservice.ConnectionProviderService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService
    ])
], ConnectionProviderLifecycleHookService);

//# sourceMappingURL=connection-provider-lifecycle-hook.service.js.map