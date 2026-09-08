"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServerRouteTriggerService", {
    enumerable: true,
    get: function() {
        return ServerRouteTriggerService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _logicfunctionexecutorservice = require("../logic-function/logic-function-executor/logic-function-executor.service");
const _logicfunctiontriggerjob = require("../logic-function/logic-function-trigger/jobs/logic-function-trigger.job");
const _logicfunctionqueueretrybackoffconstant = require("../logic-function/logic-function-trigger/constants/logic-function-queue-retry-backoff.constant");
const _buildlogicfunctioneventutil = require("../logic-function/logic-function-trigger/triggers/route/utils/build-logic-function-event.util");
const _messagequeuedecorator = require("../message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../message-queue/message-queue.constants");
const _messagequeueservice = require("../message-queue/services/message-queue.service");
const _routetriggerresponseutil = require("../logic-function/logic-function-trigger/triggers/route/utils/route-trigger-response.util");
const _defaultserverroutehttpmethodsconstant = require("./constants/default-server-route-http-methods.constant");
const _serverroutetriggerexception = require("./exceptions/server-route-trigger.exception");
const _parseresolverdispatchresultorthrowutil = require("./utils/parse-resolver-dispatch-result-or-throw.util");
const _logicfunctionentity = require("../../metadata-modules/logic-function/logic-function.entity");
const _logicfunctionexception = require("../../metadata-modules/logic-function/logic-function.exception");
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
const QUEUED_TARGET_RETRY_LIMIT = 3;
let ServerRouteTriggerService = class ServerRouteTriggerService {
    async handle({ request, resolverLogicFunctionUniversalIdentifier }) {
        const resolver = await this.findResolver({
            logicFunctionUniversalIdentifier: resolverLogicFunctionUniversalIdentifier
        });
        if (!(0, _utils.isDefined)(resolver)) {
            throw new _serverroutetriggerexception.ServerRouteTriggerException(`Server resolver function ${resolverLogicFunctionUniversalIdentifier} not found`, _serverroutetriggerexception.ServerRouteTriggerExceptionCode.LOGIC_FUNCTION_NOT_FOUND);
        }
        const allowedHttpMethods = resolver.serverRouteTriggerSettings?.httpMethods ?? _defaultserverroutehttpmethodsconstant.DEFAULT_SERVER_ROUTE_HTTP_METHODS;
        if (!allowedHttpMethods.some((httpMethod)=>httpMethod === request.method)) {
            throw new _serverroutetriggerexception.ServerRouteTriggerException(`Server resolver function ${resolverLogicFunctionUniversalIdentifier} does not accept ${request.method} requests`, _serverroutetriggerexception.ServerRouteTriggerExceptionCode.METHOD_NOT_ALLOWED);
        }
        if (resolver.httpRouteTriggerSettings?.isAuthRequired === true) {
            throw new _serverroutetriggerexception.ServerRouteTriggerException(`Server resolver function ${resolverLogicFunctionUniversalIdentifier} requires authentication and cannot be dispatched through the public server route`, _serverroutetriggerexception.ServerRouteTriggerExceptionCode.RESOLVER_REQUIRES_AUTHENTICATION);
        }
        const applicationRegistrationId = resolver.application?.applicationRegistration?.id;
        if (!(0, _utils.isDefined)(applicationRegistrationId)) {
            throw new _serverroutetriggerexception.ServerRouteTriggerException(`Server resolver function ${resolverLogicFunctionUniversalIdentifier} is not linked to an application registration`, _serverroutetriggerexception.ServerRouteTriggerExceptionCode.LOGIC_FUNCTION_NOT_FOUND);
        }
        const event = (0, _buildlogicfunctioneventutil.buildLogicFunctionEvent)({
            request,
            pathParameters: {},
            forwardedRequestHeaders: resolver.serverRouteTriggerSettings?.forwardedRequestHeaders ?? [],
            userWorkspaceId: null
        });
        const resolverResult = await this.runFunction({
            logicFunctionUniversalIdentifier: resolver.universalIdentifier,
            workspaceId: resolver.workspaceId,
            payload: event
        });
        if ((0, _utils.isDefined)(resolverResult.error)) {
            throw new _serverroutetriggerexception.ServerRouteTriggerException(resolverResult.error.errorMessage, _serverroutetriggerexception.ServerRouteTriggerExceptionCode.SERVER_ROUTE_USER_UNCAUGHT_ERROR);
        }
        if ((0, _types.isLogicFunctionHttpResponse)(resolverResult.data)) {
            return (0, _routetriggerresponseutil.buildRouteTriggerResponse)(resolverResult.data);
        }
        const dispatchResult = (0, _parseresolverdispatchresultorthrowutil.parseResolverDispatchResultOrThrow)(resolverResult.data);
        return await this.enqueueTargetFunction({
            logicFunctionUniversalIdentifier: dispatchResult.targetLogicFunctionUniversalIdentifier,
            workspaceId: dispatchResult.workspaceId,
            payload: dispatchResult.payload ?? event,
            applicationRegistrationId
        });
    }
    async findResolver({ logicFunctionUniversalIdentifier }) {
        return await this.logicFunctionRepository.createQueryBuilder('logicFunction').innerJoinAndSelect('logicFunction.application', 'application').innerJoinAndSelect('application.applicationRegistration', 'applicationRegistration').where('logicFunction.universalIdentifier = :universalIdentifier', {
            universalIdentifier: logicFunctionUniversalIdentifier
        }).andWhere('logicFunction.serverRouteTriggerSettings IS NOT NULL').andWhere('logicFunction.workspaceId = applicationRegistration.ownerWorkspaceId').getOne() ?? null;
    }
    async enqueueTargetFunction({ logicFunctionUniversalIdentifier, workspaceId, payload, applicationRegistrationId }) {
        const logicFunction = await this.findLogicFunctionOrFail({
            logicFunctionUniversalIdentifier,
            workspaceId,
            applicationRegistrationId
        });
        await this.messageQueueService.add(_logicfunctiontriggerjob.LogicFunctionTriggerJob.name, {
            logicFunctionId: logicFunction.id,
            workspaceId,
            payload
        }, {
            retryLimit: QUEUED_TARGET_RETRY_LIMIT,
            backoff: _logicfunctionqueueretrybackoffconstant.LOGIC_FUNCTION_QUEUE_RETRY_BACKOFF
        });
        return {
            statusCode: 200,
            headers: {},
            body: {
                queued: true
            }
        };
    }
    async findLogicFunctionOrFail({ logicFunctionUniversalIdentifier, workspaceId, applicationRegistrationId }) {
        const logicFunction = await this.logicFunctionRepository.findOne({
            where: {
                universalIdentifier: logicFunctionUniversalIdentifier,
                workspaceId,
                ...(0, _utils.isDefined)(applicationRegistrationId) ? {
                    application: {
                        applicationRegistrationId
                    }
                } : {}
            },
            ...(0, _utils.isDefined)(applicationRegistrationId) ? {
                relations: {
                    application: true
                }
            } : {}
        });
        if (!(0, _utils.isDefined)(logicFunction)) {
            throw new _serverroutetriggerexception.ServerRouteTriggerException(`Logic function ${logicFunctionUniversalIdentifier} not found in workspace ${workspaceId}`, _serverroutetriggerexception.ServerRouteTriggerExceptionCode.LOGIC_FUNCTION_NOT_FOUND);
        }
        return logicFunction;
    }
    async runFunction({ logicFunctionUniversalIdentifier, workspaceId, payload }) {
        const logicFunction = await this.findLogicFunctionOrFail({
            logicFunctionUniversalIdentifier,
            workspaceId
        });
        try {
            return await this.logicFunctionExecutorService.execute({
                logicFunctionId: logicFunction.id,
                workspaceId,
                payload
            });
        } catch (error) {
            this.logger.error(`Server logic function ${logicFunction.id} failed in workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            const code = this.mapExecutorErrorToServerRouteCode(error);
            throw new _serverroutetriggerexception.ServerRouteTriggerException(this.getPublicErrorMessageForCode(code), code);
        }
    }
    getPublicErrorMessageForCode(code) {
        switch(code){
            case _serverroutetriggerexception.ServerRouteTriggerExceptionCode.RATE_LIMIT_EXCEEDED:
                return 'Rate limit exceeded';
            case _serverroutetriggerexception.ServerRouteTriggerExceptionCode.LOGIC_FUNCTION_NOT_FOUND:
                return 'Logic function not found';
            case _serverroutetriggerexception.ServerRouteTriggerExceptionCode.LOGIC_FUNCTION_DISABLED:
                return 'Logic function execution is disabled';
            default:
                return 'An unexpected error occurred while handling the server route';
        }
    }
    mapExecutorErrorToServerRouteCode(error) {
        if (error instanceof _logicfunctionexception.LogicFunctionException && error.code === _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DISABLED) {
            return _serverroutetriggerexception.ServerRouteTriggerExceptionCode.LOGIC_FUNCTION_DISABLED;
        }
        if (!(error instanceof _logicfunctionexecutorservice.LogicFunctionExecutionException)) {
            return _serverroutetriggerexception.ServerRouteTriggerExceptionCode.SERVER_ROUTE_PLATFORM_ERROR;
        }
        switch(error.code){
            case _logicfunctionexecutorservice.LogicFunctionExecutionExceptionCode.LOGIC_FUNCTION_NOT_FOUND:
                return _serverroutetriggerexception.ServerRouteTriggerExceptionCode.LOGIC_FUNCTION_NOT_FOUND;
            case _logicfunctionexecutorservice.LogicFunctionExecutionExceptionCode.RATE_LIMIT_EXCEEDED:
                return _serverroutetriggerexception.ServerRouteTriggerExceptionCode.RATE_LIMIT_EXCEEDED;
            default:
                return _serverroutetriggerexception.ServerRouteTriggerExceptionCode.SERVER_ROUTE_PLATFORM_ERROR;
        }
    }
    constructor(logicFunctionRepository, logicFunctionExecutorService, messageQueueService){
        this.logicFunctionRepository = logicFunctionRepository;
        this.logicFunctionExecutorService = logicFunctionExecutorService;
        this.messageQueueService = messageQueueService;
        this.logger = new _common.Logger(ServerRouteTriggerService.name);
    }
};
ServerRouteTriggerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_logicfunctionentity.LogicFunctionEntity)),
    _ts_param(2, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.logicFunctionQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _logicfunctionexecutorservice.LogicFunctionExecutorService === "undefined" ? Object : _logicfunctionexecutorservice.LogicFunctionExecutorService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], ServerRouteTriggerService);

//# sourceMappingURL=server-route-trigger.service.js.map