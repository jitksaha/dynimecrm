"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HttpExceptionHandlerService", {
    enumerable: true,
    get: function() {
        return HttpExceptionHandlerService;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _typeorm = require("typeorm");
const _utils = require("twenty-shared/utils");
const _postgresexception = require("../../api/graphql/workspace-query-runner/utils/postgres-exception");
const _exceptionhandlerservice = require("./exception-handler.service");
const _hasrestresponseutil = require("./utils/has-rest-response.util");
const _twentyormexception = require("../../twenty-orm/exceptions/twenty-orm.exception");
const _istwentyormuserinputerrorutil = require("../../twenty-orm/utils/is-twenty-orm-user-input-error.util");
const _globalexceptionhandlerutil = require("../../utils/global-exception-handler.util");
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
const getErrorNameFromStatusCode = (statusCode)=>{
    switch(statusCode){
        case 400:
            return 'BadRequestException';
        case 401:
            return 'UnauthorizedException';
        case 402:
            return 'PaymentRequiredException';
        case 403:
            return 'ForbiddenException';
        case 404:
            return 'NotFoundException';
        case 405:
            return 'MethodNotAllowedException';
        case 409:
            return 'ConflictException';
        case 416:
            return 'RequestedRangeNotSatisfiableException';
        case 422:
            return 'UnprocessableEntityException';
        case 500:
            return 'InternalServerErrorException';
        default:
            {
                if (statusCode >= 500) {
                    return 'InternalServerErrorException';
                }
                return 'BadRequestException';
            }
    }
};
let HttpExceptionHandlerService = class HttpExceptionHandlerService {
    constructor(exceptionHandlerService, request){
        this.exceptionHandlerService = exceptionHandlerService;
        this.request = request;
        this.handleError = (exception, response, errorCode, user, workspace, { shouldBeCapturedBySentry = true } = {})=>{
            const params = this.request?.params;
            if (params?.workspaceId) {
                workspace = {
                    ...workspace,
                    id: params.workspaceId
                };
            }
            if (params?.userId) {
                user = {
                    ...user,
                    id: params.userId
                };
            }
            let statusCode = errorCode || 500;
            if (exception instanceof _typeorm.QueryFailedError) {
                exception = new _common.BadRequestException(exception.message);
                statusCode = 400;
            }
            if (exception instanceof _twentyormexception.TwentyOrmException && (0, _istwentyormuserinputerrorutil.isTwentyOrmUserInputError)(exception)) {
                exception = new _common.BadRequestException(exception.message);
                statusCode = 400;
            }
            if (exception instanceof _postgresexception.PostgresException) {
                exception = new _common.InternalServerErrorException(exception.message);
                statusCode = 500;
            }
            (0, _globalexceptionhandlerutil.handleException)({
                exception,
                exceptionHandlerService: this.exceptionHandlerService,
                user,
                workspace,
                statusCode,
                shouldBeCapturedBySentry
            });
            if ((0, _hasrestresponseutil.hasRestResponse)(exception)) {
                return response.status(statusCode).send(exception.getResponseBody());
            }
            return response.status(statusCode).send({
                statusCode,
                error: exception.name ?? getErrorNameFromStatusCode(statusCode),
                messages: [
                    exception?.message
                ],
                code: exception instanceof _utils.CustomError ? exception.code : undefined
            });
        };
    }
};
HttpExceptionHandlerService = _ts_decorate([
    (0, _common.Injectable)({
        scope: _common.Scope.REQUEST
    }),
    _ts_param(1, (0, _common.Inject)(_core.REQUEST)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService,
        Object
    ])
], HttpExceptionHandlerService);

//# sourceMappingURL=http-exception-handler.service.js.map