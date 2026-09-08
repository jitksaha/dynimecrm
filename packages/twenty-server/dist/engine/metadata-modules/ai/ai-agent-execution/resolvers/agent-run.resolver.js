"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentRunResolver", {
    enumerable: true,
    get: function() {
        return AgentRunResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _metadataresolverdecorator = require("../../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _authapplicationdecorator = require("../../../../decorators/auth/auth-application.decorator");
const _authuserworkspaceiddecorator = require("../../../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacememberiddecorator = require("../../../../decorators/auth/auth-workspace-member-id.decorator");
const _authworkspacedecorator = require("../../../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../../guards/workspace-auth.guard");
const _runagentinput = require("../dtos/run-agent.input");
const _runagentresultdto = require("../dtos/run-agent-result.dto");
const _agentrunservice = require("../services/agent-run.service");
const _aigraphqlapiexceptioninterceptor = require("../../interceptors/ai-graphql-api-exception.interceptor");
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
let AgentRunResolver = class AgentRunResolver {
    async runAgent(input, workspace, userWorkspaceId, callerApplication, workspaceMemberId) {
        return this.agentRunService.run({
            workspace,
            requestUserWorkspaceId: userWorkspaceId ?? null,
            requestWorkspaceMemberId: workspaceMemberId ?? null,
            callerApplication,
            input
        });
    }
    constructor(agentRunService){
        this.agentRunService = agentRunService;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_runagentresultdto.RunAgentResultDTO),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)({
        allowUndefined: true
    })),
    _ts_param(3, (0, _authapplicationdecorator.AuthApplication)({
        allowUndefined: true
    })),
    _ts_param(4, (0, _authworkspacememberiddecorator.AuthWorkspaceMemberId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _runagentinput.RunAgentInputDTO === "undefined" ? Object : _runagentinput.RunAgentInputDTO,
        typeof FlatWorkspace === "undefined" ? Object : FlatWorkspace,
        Object,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AgentRunResolver.prototype, "runAgent", null);
AgentRunResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.AI)),
    (0, _common.UseInterceptors)(_aigraphqlapiexceptioninterceptor.AiGraphqlApiExceptionInterceptor),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _agentrunservice.AgentRunService === "undefined" ? Object : _agentrunservice.AgentRunService
    ])
], AgentRunResolver);

//# sourceMappingURL=agent-run.resolver.js.map