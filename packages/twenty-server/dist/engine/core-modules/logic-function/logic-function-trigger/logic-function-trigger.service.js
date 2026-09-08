"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LogicFunctionTriggerService", {
    enumerable: true,
    get: function() {
        return LogicFunctionTriggerService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _logicfunctionexecutorservice = require("../logic-function-executor/logic-function-executor.service");
const _buildlogicfunctioneventutil = require("./triggers/route/utils/build-logic-function-event.util");
const _routetriggerresponseutil = require("./triggers/route/utils/route-trigger-response.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LogicFunctionTriggerService = class LogicFunctionTriggerService {
    async run({ logicFunction, request, pathParameters, forwardedRequestHeaders, forwardAllHeaders = false, userId, userWorkspaceId }) {
        const event = (0, _buildlogicfunctioneventutil.buildLogicFunctionEvent)({
            request,
            pathParameters,
            forwardedRequestHeaders,
            forwardAllHeaders,
            userWorkspaceId: userWorkspaceId ?? null
        });
        const result = await this.logicFunctionExecutorService.execute({
            logicFunctionId: logicFunction.id,
            workspaceId: logicFunction.workspaceId,
            payload: event,
            ...(0, _utils.isDefined)(userId) ? {
                userId
            } : {},
            ...(0, _utils.isDefined)(userWorkspaceId) ? {
                userWorkspaceId
            } : {}
        });
        if (!(0, _utils.isDefined)(result)) {
            return {
                kind: 'response',
                response: (0, _routetriggerresponseutil.buildRouteTriggerResponse)(result)
            };
        }
        if (result.error) {
            return {
                kind: 'userError',
                errorMessage: result.error.errorMessage
            };
        }
        return {
            kind: 'response',
            response: (0, _routetriggerresponseutil.buildRouteTriggerResponse)(result.data)
        };
    }
    constructor(logicFunctionExecutorService){
        this.logicFunctionExecutorService = logicFunctionExecutorService;
    }
};
LogicFunctionTriggerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _logicfunctionexecutorservice.LogicFunctionExecutorService === "undefined" ? Object : _logicfunctionexecutorservice.LogicFunctionExecutorService
    ])
], LogicFunctionTriggerService);

//# sourceMappingURL=logic-function-trigger.service.js.map