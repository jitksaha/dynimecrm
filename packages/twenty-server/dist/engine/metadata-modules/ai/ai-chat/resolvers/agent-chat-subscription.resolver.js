"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentChatSubscriptionResolver", {
    enumerable: true,
    get: function() {
        return AgentChatSubscriptionResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _metadataresolverdecorator = require("../../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _scalars = require("../../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _authuserworkspaceiddecorator = require("../../../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../../../guards/settings-permission.guard");
const _userauthguard = require("../../../../guards/user-auth.guard");
const _workspaceauthguard = require("../../../../guards/workspace-auth.guard");
const _aiexception = require("../../ai.exception");
const _aigraphqlapiexceptioninterceptor = require("../../interceptors/ai-graphql-api-exception.interceptor");
const _agentchatkeepaliveintervalmsconstant = require("../constants/agent-chat-keepalive-interval-ms.constant");
const _agentchatstreamreapcheckintervalmsconstant = require("../constants/agent-chat-stream-reap-check-interval-ms.constant");
const _agentchateventdto = require("../dtos/agent-chat-event.dto");
const _agentchatthreadentity = require("../entities/agent-chat-thread.entity");
const _agentchatstreamingservice = require("../services/agent-chat-streaming.service");
const _subscriptionservice = require("../../../../subscriptions/subscription.service");
const _wrapasynciteratorwithlifecycle = require("../../../../subscriptions/utils/wrap-async-iterator-with-lifecycle");
const _injectworkspacescopedrepositorydecorator = require("../../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
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
let AgentChatSubscriptionResolver = class AgentChatSubscriptionResolver {
    async onAgentChatEvent(threadId, workspace, userWorkspaceId) {
        const thread = await this.threadRepository.findOne(workspace.id, {
            where: {
                id: threadId,
                userWorkspaceId
            },
            select: [
                'id'
            ]
        });
        if (!(0, _utils.isDefined)(thread)) {
            throw new _aiexception.AiException('Thread not found', _aiexception.AiExceptionCode.THREAD_NOT_FOUND);
        }
        const iterator = await this.subscriptionService.subscribeToAgentChat({
            workspaceId: workspace.id,
            threadId
        });
        const keepalivePayload = {
            onAgentChatEvent: {
                threadId,
                event: {
                    type: 'keepalive'
                }
            }
        };
        let lastReapCheckAt = 0;
        return (0, _wrapasynciteratorwithlifecycle.wrapAsyncIteratorWithLifecycle)(iterator, {
            initialValue: keepalivePayload,
            onHeartbeat: async ()=>{
                if (Date.now() - lastReapCheckAt >= _agentchatstreamreapcheckintervalmsconstant.AGENT_CHAT_STREAM_REAP_CHECK_INTERVAL_MS) {
                    lastReapCheckAt = Date.now();
                    await this.reapWatchedStreamIfDead(workspace.id, threadId);
                }
                await this.subscriptionService.publishToAgentChat({
                    workspaceId: workspace.id,
                    threadId,
                    payload: keepalivePayload
                });
                return true;
            },
            heartbeatIntervalMs: _agentchatkeepaliveintervalmsconstant.AGENT_CHAT_KEEPALIVE_INTERVAL_MS
        });
    }
    async reapWatchedStreamIfDead(workspaceId, threadId) {
        const thread = await this.threadRepository.findOne(workspaceId, {
            where: {
                id: threadId
            },
            select: [
                'id',
                'activeStreamId'
            ]
        }).catch(()=>null);
        if (!(0, _utils.isDefined)(thread) || !(0, _utils.isDefined)(thread.activeStreamId)) {
            return;
        }
        await this.agentChatStreamingService.reapDeadStream({
            thread,
            workspaceId
        }).catch(()=>{});
    }
    constructor(subscriptionService, agentChatStreamingService, threadRepository){
        this.subscriptionService = subscriptionService;
        this.agentChatStreamingService = agentChatStreamingService;
        this.threadRepository = threadRepository;
    }
};
_ts_decorate([
    (0, _graphql.Subscription)(()=>_agentchateventdto.AgentChatEventDTO, {
        filter: (payload, variables)=>{
            return payload.onAgentChatEvent.threadId === variables.threadId;
        }
    }),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.AI)),
    _ts_param(0, (0, _graphql.Args)('threadId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AgentChatSubscriptionResolver.prototype, "onAgentChatEvent", null);
AgentChatSubscriptionResolver = _ts_decorate([
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _userauthguard.UserAuthGuard),
    (0, _common.UseInterceptors)(_aigraphqlapiexceptioninterceptor.AiGraphqlApiExceptionInterceptor),
    _ts_param(2, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_agentchatthreadentity.AgentChatThreadEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _subscriptionservice.SubscriptionService === "undefined" ? Object : _subscriptionservice.SubscriptionService,
        typeof _agentchatstreamingservice.AgentChatStreamingService === "undefined" ? Object : _agentchatstreamingservice.AgentChatStreamingService,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository
    ])
], AgentChatSubscriptionResolver);

//# sourceMappingURL=agent-chat-subscription.resolver.js.map