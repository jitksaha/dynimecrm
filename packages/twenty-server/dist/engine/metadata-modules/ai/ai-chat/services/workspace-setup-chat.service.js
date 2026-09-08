"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceSetupChatService", {
    enumerable: true,
    get: function() {
        return WorkspaceSetupChatService;
    }
});
const _common = require("@nestjs/common");
const _translations = require("twenty-shared/translations");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _postgreserrorcodesconstants = require("../../../../api/graphql/workspace-query-runner/constants/postgres-error-codes.constants");
const _billingusageservice = require("../../../../core-modules/billing/services/billing-usage.service");
const _i18nservice = require("../../../../core-modules/i18n/i18n.service");
const _twentyconfigservice = require("../../../../core-modules/twenty-config/twenty-config.service");
const _userworkspaceservice = require("../../../../core-modules/user-workspace/user-workspace.service");
const _workspacesetupchatoutcomeenum = require("../enums/workspace-setup-chat-outcome.enum");
const _agentchatstreamingservice = require("./agent-chat-streaming.service");
const _agentchatservice = require("./agent-chat.service");
const _buildworkspacesetupchatthreadidutil = require("../utils/build-workspace-setup-chat-thread-id.util");
const _buildworkspacesetupkickoffmessagetextutil = require("../utils/build-workspace-setup-kickoff-message-text.util");
const _tagaichatstreamscopeutil = require("../utils/tag-ai-chat-stream-scope.util");
const _aimodelregistryservice = require("../../ai-models/services/ai-model-registry.service");
const _workspaceormmanager = require("../../../../twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const WORKSPACE_SETUP_CHAT_THREAD_TITLE = /*i18n*/ {
    id: "2gzz0t",
    message: "Workspace setup"
};
let WorkspaceSetupChatService = class WorkspaceSetupChatService {
    async startWorkspaceSetupChat({ userId, userEmail, userLocale, userWorkspaceId, workspace, companyContext, personContext }) {
        if (!this.twentyConfigService.get('IS_ONBOARDING_AI_CHAT_ENABLED')) {
            return {
                outcome: _workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome.UNAVAILABLE,
                thread: null
            };
        }
        const isWorkspaceCreator = await this.userWorkspaceService.isWorkspaceCreator({
            userId,
            workspaceId: workspace.id
        });
        if (!isWorkspaceCreator) {
            return {
                outcome: _workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome.UNAVAILABLE,
                thread: null
            };
        }
        if (this.aiModelRegistryService.getAvailableModels().length === 0) {
            return {
                outcome: _workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome.UNAVAILABLE,
                thread: null
            };
        }
        const localePromise = this.resolveUserLocale({
            userId,
            userLocale,
            workspaceId: workspace.id
        });
        const threadId = (0, _buildworkspacesetupchatthreadidutil.buildWorkspaceSetupChatThreadId)({
            workspaceId: workspace.id,
            userWorkspaceId
        });
        let thread = await this.agentChatService.findThreadById({
            threadId,
            userWorkspaceId,
            workspaceId: workspace.id
        });
        if ((0, _utils.isDefined)(thread)) {
            if ((0, _utils.isDefined)(thread.deletedAt)) {
                thread = await this.agentChatService.unarchiveThread({
                    threadId,
                    userWorkspaceId,
                    workspaceId: workspace.id
                });
            }
            if ((0, _utils.isDefined)(thread.activeStreamId)) {
                const interruptedError = await this.agentChatStreamingService.reapDeadStream({
                    thread,
                    workspaceId: workspace.id
                });
                if (!(0, _utils.isDefined)(interruptedError)) {
                    return {
                        outcome: _workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome.ALREADY_STARTED,
                        thread
                    };
                }
            }
            const hasConversationMessages = await this.agentChatService.hasConversationMessages({
                threadId,
                workspaceId: workspace.id
            });
            if (hasConversationMessages) {
                return {
                    outcome: _workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome.ALREADY_STARTED,
                    thread
                };
            }
        }
        const hasAvailableCredits = await this.billingUsageService.hasAvailableCredits(workspace.id);
        if (!hasAvailableCredits) {
            return {
                outcome: _workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome.UNAVAILABLE,
                thread: null
            };
        }
        const locale = await localePromise;
        thread ??= await this.createThreadWithDeterministicId({
            threadId,
            userWorkspaceId,
            workspaceId: workspace.id,
            locale
        });
        const kickoffResult = await this.agentChatStreamingService.startHiddenKickoffStream({
            thread,
            userWorkspaceId,
            workspace,
            text: (0, _buildworkspacesetupkickoffmessagetextutil.buildWorkspaceSetupKickoffMessageText)({
                companyEnrichment: companyContext,
                personEnrichment: personContext,
                workspaceContext: {
                    workspaceDisplayName: workspace.displayName ?? null,
                    workspaceSubdomain: workspace.subdomain,
                    userEmail
                },
                locale
            }),
            modelId: workspace.fastModel
        });
        if (!(0, _utils.isDefined)(kickoffResult)) {
            return {
                outcome: _workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome.ALREADY_STARTED,
                thread
            };
        }
        (0, _tagaichatstreamscopeutil.tagAiChatStreamScope)({
            streamId: kickoffResult.streamId,
            turnId: kickoffResult.turnId,
            threadId,
            workspaceId: workspace.id
        });
        return {
            outcome: _workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome.STARTED,
            thread
        };
    }
    async createThreadWithDeterministicId({ threadId, userWorkspaceId, workspaceId, locale }) {
        const safeLocale = locale ?? _translations.SOURCE_LOCALE;
        const title = this.i18nService.getI18nInstance(safeLocale)._(WORKSPACE_SETUP_CHAT_THREAD_TITLE);
        try {
            return await this.agentChatService.createThread({
                userWorkspaceId,
                workspaceId,
                id: threadId,
                title
            });
        } catch (error) {
            if (this.isUniqueViolation(error)) {
                const concurrentlyCreatedThread = await this.agentChatService.findThreadById({
                    threadId,
                    userWorkspaceId,
                    workspaceId
                });
                if ((0, _utils.isDefined)(concurrentlyCreatedThread)) {
                    return concurrentlyCreatedThread;
                }
            }
            throw error;
        }
    }
    isUniqueViolation(error) {
        return error instanceof _typeorm.QueryFailedError && error.code === _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.UNIQUE_VIOLATION;
    }
    async resolveUserLocale({ userId, userLocale, workspaceId }) {
        // The workspace member locale is what the UI is translated with, while the user
        // one stays at its signup default, so the assistant must follow the member locale.
        const workspaceMemberLocale = await this.findWorkspaceMemberLocale({
            userId,
            workspaceId
        });
        return workspaceMemberLocale ?? userLocale ?? _translations.SOURCE_LOCALE;
    }
    async findWorkspaceMemberLocale({ userId, workspaceId }) {
        try {
            const workspaceMember = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                const workspaceMemberRepository = this.workspaceOrmManager.getRepository('workspaceMember', {
                    shouldBypassPermissionChecks: true
                });
                return workspaceMemberRepository.findOne({
                    where: {
                        userId
                    }
                });
            }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
            return workspaceMember?.locale ?? null;
        } catch (error) {
            this.logger.warn(`Failed to read the workspace member locale for workspace ${workspaceId}: ${error instanceof Error ? error.message : String(error)}`);
            return null;
        }
    }
    constructor(twentyConfigService, billingUsageService, aiModelRegistryService, userWorkspaceService, i18nService, agentChatService, agentChatStreamingService, workspaceOrmManager){
        this.twentyConfigService = twentyConfigService;
        this.billingUsageService = billingUsageService;
        this.aiModelRegistryService = aiModelRegistryService;
        this.userWorkspaceService = userWorkspaceService;
        this.i18nService = i18nService;
        this.agentChatService = agentChatService;
        this.agentChatStreamingService = agentChatStreamingService;
        this.workspaceOrmManager = workspaceOrmManager;
        this.logger = new _common.Logger(WorkspaceSetupChatService.name);
    }
};
WorkspaceSetupChatService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _billingusageservice.BillingUsageService === "undefined" ? Object : _billingusageservice.BillingUsageService,
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _userworkspaceservice.UserWorkspaceService === "undefined" ? Object : _userworkspaceservice.UserWorkspaceService,
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService,
        typeof _agentchatservice.AgentChatService === "undefined" ? Object : _agentchatservice.AgentChatService,
        typeof _agentchatstreamingservice.AgentChatStreamingService === "undefined" ? Object : _agentchatstreamingservice.AgentChatStreamingService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], WorkspaceSetupChatService);

//# sourceMappingURL=workspace-setup-chat.service.js.map