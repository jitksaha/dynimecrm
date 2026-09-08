"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RouteTriggerService", {
    enumerable: true,
    get: function() {
        return RouteTriggerService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _pathtoregexp = require("path-to-regexp");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _workspace = require("twenty-shared/workspace");
const _authexception = require("../../../../auth/auth.exception");
const _accesstokenservice = require("../../../../auth/token/services/access-token.service");
const _workspacedomainsservice = require("../../../../domain/workspace-domains/services/workspace-domains.service");
const _twentyconfigservice = require("../../../../twenty-config/twenty-config.service");
const _routetriggerexception = require("./exceptions/route-trigger.exception");
const _logicfunctiontriggerservice = require("../../logic-function-trigger.service");
const _sanitizeroutetriggerpathutil = require("./utils/sanitize-route-trigger-path.util");
const _logicfunctionexception = require("../../../../../metadata-modules/logic-function/logic-function.exception");
const _logicfunctionentity = require("../../../../../metadata-modules/logic-function/logic-function.entity");
const _logicfunctionexecutorservice = require("../../../logic-function-executor/logic-function-executor.service");
const _customexception = require("../../../../../../utils/custom-exception");
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
let RouteTriggerService = class RouteTriggerService {
    async resolveAuthenticationContextForWorkspaceFallback({ request, workspaceFromHost }) {
        if ((0, _utils.isDefined)(workspaceFromHost) || !(0, _guards.isNonEmptyString)(request.headers.authorization)) {
            return undefined;
        }
        try {
            return await this.accessTokenService.validateTokenByRequest(request);
        } catch (error) {
            if (error instanceof _authexception.AuthException) {
                return undefined;
            }
            throw error;
        }
    }
    async resolveRouteTriggerRequestContextOrFail(request) {
        const host = `${request.protocol}://${request.get('host')}`;
        const { workspace: workspaceFromHost, publicDomain, isIsolatedOrigin } = await this.workspaceDomainsService.resolveWorkspaceAndPublicDomain(host);
        const authenticationContext = await this.resolveAuthenticationContextForWorkspaceFallback({
            request,
            workspaceFromHost
        });
        const workspace = workspaceFromHost ?? authenticationContext?.workspace;
        (0, _utils.assertIsDefinedOrThrow)(workspace, new _routetriggerexception.RouteTriggerException('Workspace not found', _routetriggerexception.RouteTriggerExceptionCode.WORKSPACE_NOT_FOUND));
        if (workspace.activationStatus === _workspace.WorkspaceActivationStatus.SUSPENDED) {
            throw new _routetriggerexception.RouteTriggerException('Workspace is suspended', _routetriggerexception.RouteTriggerExceptionCode.WORKSPACE_SUSPENDED);
        }
        return {
            workspace,
            applicationId: publicDomain?.applicationId ?? null,
            isIsolatedOrigin,
            authenticationContext
        };
    }
    findLogicFunctionWithPathParamsOrFail({ httpMethod, logicFunctionsWithHttpRouteTrigger, requestPath }) {
        for (const logicFunction of logicFunctionsWithHttpRouteTrigger){
            const httpRouteSettings = logicFunction.httpRouteTriggerSettings;
            if (!(0, _utils.isDefined)(httpRouteSettings) || httpRouteSettings.httpMethod !== httpMethod) {
                continue;
            }
            const routeMatcher = (0, _pathtoregexp.match)(httpRouteSettings.path, {
                decode: decodeURIComponent
            });
            const routeMatched = routeMatcher(requestPath);
            if (routeMatched) {
                return {
                    logicFunction,
                    pathParams: routeMatched.params
                };
            }
        }
        throw new _routetriggerexception.RouteTriggerException('No Route trigger found', _routetriggerexception.RouteTriggerExceptionCode.TRIGGER_NOT_FOUND);
    }
    assertLegacyRouteIsServableOrThrow({ logicFunction, workspace, isIsolatedOrigin }) {
        if (isIsolatedOrigin) {
            return;
        }
        const cutoffIso = this.twentyConfigService.get('LOGIC_FUNCTION_LEGACY_ROUTE_CUTOFF');
        if (!(0, _guards.isNonEmptyString)(cutoffIso)) {
            return;
        }
        const publicFunctionUrl = this.workspaceDomainsService.buildPublicFunctionUrl({
            workspace,
            path: logicFunction.httpRouteTriggerSettings?.path ?? '/'
        });
        if (!(0, _utils.isDefined)(publicFunctionUrl)) {
            return;
        }
        const cutoffDate = new Date(cutoffIso);
        if (Number.isNaN(cutoffDate.getTime())) {
            return;
        }
        if (logicFunction.createdAt.getTime() >= cutoffDate.getTime()) {
            this.logger.warn(`Logic function ${logicFunction.id} was requested on the deprecated /s/ route but is only served on ${publicFunctionUrl}`);
            throw new _routetriggerexception.RouteTriggerException(`Logic function ${logicFunction.id} is no longer served on the legacy /s/ route`, _routetriggerexception.RouteTriggerExceptionCode.LEGACY_ROUTE_DEPRECATED, {
                userFriendlyMessage: /*i18n*/ {
                    id: "w0nNxn",
                    message: "This endpoint has moved. Call it at {publicFunctionUrl} instead.",
                    values: {
                        publicFunctionUrl: publicFunctionUrl
                    }
                }
            });
        }
    }
    mapErrorToRouteTriggerCode(error) {
        if (error instanceof _logicfunctionexecutorservice.LogicFunctionExecutionException) {
            switch(error.code){
                case _logicfunctionexecutorservice.LogicFunctionExecutionExceptionCode.LOGIC_FUNCTION_NOT_FOUND:
                    return _routetriggerexception.RouteTriggerExceptionCode.LOGIC_FUNCTION_NOT_FOUND;
                case _logicfunctionexecutorservice.LogicFunctionExecutionExceptionCode.RATE_LIMIT_EXCEEDED:
                    return _routetriggerexception.RouteTriggerExceptionCode.RATE_LIMIT_EXCEEDED;
            }
        }
        if (error instanceof _logicfunctionexception.LogicFunctionException) {
            switch(error.code){
                case _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_NOT_FOUND:
                    return _routetriggerexception.RouteTriggerExceptionCode.LOGIC_FUNCTION_NOT_FOUND;
                case _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DISABLED:
                    return _routetriggerexception.RouteTriggerExceptionCode.FORBIDDEN_EXCEPTION;
                case _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED:
                    return _routetriggerexception.RouteTriggerExceptionCode.LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED;
            }
        }
        return _routetriggerexception.RouteTriggerExceptionCode.ROUTE_TRIGGER_PLATFORM_ERROR;
    }
    async handle({ request, httpMethod }) {
        const { workspace, applicationId, isIsolatedOrigin, authenticationContext } = await this.resolveRouteTriggerRequestContextOrFail(request);
        const logicFunctionsWithHttpRouteTrigger = await this.logicFunctionRepository.find({
            where: {
                workspaceId: workspace.id,
                httpRouteTriggerSettings: (0, _typeorm1.Not)((0, _typeorm1.IsNull)()),
                ...(0, _utils.isDefined)(applicationId) ? {
                    applicationId
                } : {}
            }
        });
        const { logicFunction, pathParams } = this.findLogicFunctionWithPathParamsOrFail({
            httpMethod,
            logicFunctionsWithHttpRouteTrigger,
            requestPath: (0, _sanitizeroutetriggerpathutil.sanitizeRouteTriggerPath)(request.path)
        });
        this.assertLegacyRouteIsServableOrThrow({
            logicFunction,
            workspace,
            isIsolatedOrigin
        });
        const httpRouteSettings = logicFunction.httpRouteTriggerSettings;
        let userWorkspaceId = null;
        let userId = null;
        if (httpRouteSettings?.isAuthRequired) {
            const routeAuthenticationContext = authenticationContext ?? await this.accessTokenService.validateTokenByRequest(request);
            if (!(0, _utils.isDefined)(routeAuthenticationContext.workspace)) {
                throw new _routetriggerexception.RouteTriggerException('Workspace not found', _routetriggerexception.RouteTriggerExceptionCode.WORKSPACE_NOT_FOUND);
            }
            if (routeAuthenticationContext.workspace.id !== workspace.id) {
                throw new _routetriggerexception.RouteTriggerException('You are not authorized', _routetriggerexception.RouteTriggerExceptionCode.FORBIDDEN_EXCEPTION);
            }
            userWorkspaceId = routeAuthenticationContext.userWorkspaceId ?? null;
            userId = routeAuthenticationContext.user?.id ?? null;
        }
        let outcome;
        try {
            outcome = await this.logicFunctionTriggerService.run({
                logicFunction,
                request,
                pathParameters: pathParams,
                forwardedRequestHeaders: httpRouteSettings?.forwardedRequestHeaders ?? [],
                forwardAllHeaders: isIsolatedOrigin,
                userId,
                userWorkspaceId
            });
        } catch (error) {
            if (error instanceof _routetriggerexception.RouteTriggerException) {
                throw error;
            }
            this.logger.error(`Unexpected error executing logic function ${logicFunction.id}: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            const code = this.mapErrorToRouteTriggerCode(error);
            throw new _routetriggerexception.RouteTriggerException(`Logic function execution failed for ${logicFunction.id}`, code, {
                userFriendlyMessage: error instanceof _customexception.CustomException ? error.userFriendlyMessage : undefined
            });
        }
        if (outcome.kind === 'userError') {
            throw new _routetriggerexception.RouteTriggerException(outcome.errorMessage, _routetriggerexception.RouteTriggerExceptionCode.ROUTE_TRIGGER_USER_UNCAUGHT_ERROR);
        }
        return {
            response: outcome.response,
            isIsolatedOrigin
        };
    }
    constructor(accessTokenService, logicFunctionTriggerService, workspaceDomainsService, twentyConfigService, logicFunctionRepository){
        this.accessTokenService = accessTokenService;
        this.logicFunctionTriggerService = logicFunctionTriggerService;
        this.workspaceDomainsService = workspaceDomainsService;
        this.twentyConfigService = twentyConfigService;
        this.logicFunctionRepository = logicFunctionRepository;
        this.logger = new _common.Logger(RouteTriggerService.name);
    }
};
RouteTriggerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(4, (0, _typeorm.InjectRepository)(_logicfunctionentity.LogicFunctionEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _accesstokenservice.AccessTokenService === "undefined" ? Object : _accesstokenservice.AccessTokenService,
        typeof _logicfunctiontriggerservice.LogicFunctionTriggerService === "undefined" ? Object : _logicfunctiontriggerservice.LogicFunctionTriggerService,
        typeof _workspacedomainsservice.WorkspaceDomainsService === "undefined" ? Object : _workspacedomainsservice.WorkspaceDomainsService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], RouteTriggerService);

//# sourceMappingURL=route-trigger.service.js.map