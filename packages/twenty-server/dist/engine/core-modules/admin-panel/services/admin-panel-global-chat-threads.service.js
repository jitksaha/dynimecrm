"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelGlobalChatThreadsService", {
    enumerable: true,
    get: function() {
        return AdminPanelGlobalChatThreadsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _ai = require("twenty-shared/ai");
const _guards = require("@sniptt/guards");
const _typeorm1 = require("typeorm");
const _adminchatthreadsmaxpagesizeconstant = require("../constants/admin-chat-threads-max-page-size.constant");
const _adminchatthreadscopeenum = require("../enums/admin-chat-thread-scope.enum");
const _adminchatthreadsortdirectionenum = require("../enums/admin-chat-thread-sort-direction.enum");
const _adminchatthreadsortfieldenum = require("../enums/admin-chat-thread-sort-field.enum");
const _agentmessagepartentity = require("../../../metadata-modules/ai/ai-agent-execution/entities/agent-message-part.entity");
const _agentmessageentity = require("../../../metadata-modules/ai/ai-agent-execution/entities/agent-message.entity");
const _workspacesetupchatthreadidnamespaceconstant = require("../../../metadata-modules/ai/ai-chat/constants/workspace-setup-chat-thread-id-namespace.constant");
const _agentchatthreadentity = require("../../../metadata-modules/ai/ai-chat/entities/agent-chat-thread.entity");
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
const WORKSPACE_SETUP_THREAD_ID_EXPRESSION = `public.uuid_generate_v5(
  :setupThreadNamespace::uuid,
  "thread"."workspaceId"::text || ':' || "thread"."userWorkspaceId"::text
)`;
const ANSWERED_ASK_QUESTIONS_STATUS = 'answered';
const ANSWERED_ASK_QUESTIONS_PART_EXPRESSION = `"answeredQuestionPart"."toolOutput" -> 'result' ->> 'status' = :answeredQuestionStatus`;
const ORDER_EXPRESSION_BY_SORT_FIELD = {
    [_adminchatthreadsortfieldenum.AdminChatThreadSortField.MESSAGE_COUNT]: '"messageCount"',
    [_adminchatthreadsortfieldenum.AdminChatThreadSortField.REPLY_COUNT]: '"userReplyCount"',
    [_adminchatthreadsortfieldenum.AdminChatThreadSortField.CREATED_AT]: '"thread"."createdAt"',
    [_adminchatthreadsortfieldenum.AdminChatThreadSortField.UPDATED_AT]: '"thread"."updatedAt"'
};
let AdminPanelGlobalChatThreadsService = class AdminPanelGlobalChatThreadsService {
    buildOnboardingThreadPredicate(queryBuilder) {
        const hiddenKickoffMessageSubQuery = queryBuilder.subQuery().select('1').from(_agentmessageentity.AgentMessageEntity, 'hiddenMessage').where('hiddenMessage.threadId = thread.id').andWhere('hiddenMessage.isHidden = true').getQuery();
        return `(EXISTS (${hiddenKickoffMessageSubQuery}) OR "thread"."id" = ${WORKSPACE_SETUP_THREAD_ID_EXPRESSION})`;
    }
    buildAnsweredQuestionSubQuery(queryBuilder, selection) {
        return queryBuilder.subQuery().select(selection).from(_agentmessagepartentity.AgentMessagePartEntity, 'answeredQuestionPart').innerJoin(_agentmessageentity.AgentMessageEntity, 'questionMessage', 'questionMessage.id = answeredQuestionPart.messageId').where('questionMessage.threadId = thread.id').andWhere('questionMessage.isHidden = false').andWhere('answeredQuestionPart.toolName = :askQuestionsToolName').andWhere(ANSWERED_ASK_QUESTIONS_PART_EXPRESSION).getQuery();
    }
    buildUserNeverEngagedPredicate(queryBuilder) {
        const visibleUserMessageSubQuery = queryBuilder.subQuery().select('1').from(_agentmessageentity.AgentMessageEntity, 'userMessage').where('userMessage.threadId = thread.id').andWhere('userMessage.isHidden = false').andWhere('userMessage.role = :userMessageRole').getQuery();
        const answeredQuestionSubQuery = this.buildAnsweredQuestionSubQuery(queryBuilder, '1');
        return `(NOT EXISTS (${visibleUserMessageSubQuery}) AND NOT EXISTS (${answeredQuestionSubQuery}))`;
    }
    applyFilters(queryBuilder, { scope, hasErrorOnly, userNeverEngagedOnly, searchTerm }) {
        queryBuilder.innerJoin('thread.workspace', 'workspace', '"workspace"."allowImpersonation" = true AND "workspace"."deletedAt" IS NULL').leftJoin('thread.userWorkspace', 'userWorkspace').leftJoin('userWorkspace.user', 'user').withDeleted().setParameter('setupThreadNamespace', _workspacesetupchatthreadidnamespaceconstant.WORKSPACE_SETUP_CHAT_THREAD_ID_NAMESPACE).setParameter('userMessageRole', _agentmessageentity.AgentMessageRole.USER).setParameter('askQuestionsToolName', _ai.ASK_QUESTIONS_TOOL_NAME).setParameter('answeredQuestionStatus', ANSWERED_ASK_QUESTIONS_STATUS);
        if (scope === _adminchatthreadscopeenum.AdminChatThreadScope.ONBOARDING) {
            queryBuilder.andWhere(this.buildOnboardingThreadPredicate(queryBuilder));
        }
        if (hasErrorOnly) {
            queryBuilder.andWhere('"thread"."lastStreamError" IS NOT NULL');
        }
        if (userNeverEngagedOnly) {
            queryBuilder.andWhere(this.buildUserNeverEngagedPredicate(queryBuilder));
        }
        const trimmedSearchTerm = searchTerm?.trim();
        if ((0, _guards.isNonEmptyString)(trimmedSearchTerm)) {
            const escapedSearchTerm = trimmedSearchTerm.replace(/[\\%_]/g, '\\$&');
            queryBuilder.andWhere(new _typeorm1.Brackets((subQuery)=>{
                subQuery.where('"workspace"."displayName" ILIKE :searchPattern').orWhere('"user"."email" ILIKE :searchPattern').orWhere('"thread"."id"::text ILIKE :searchPattern');
            }), {
                searchPattern: `%${escapedSearchTerm}%`
            });
        }
        return queryBuilder;
    }
    async getGlobalChatThreads({ scope, hasErrorOnly, userNeverEngagedOnly, searchTerm, sortBy, sortDirection, limit, offset }) {
        const sanitizedLimit = Math.min(Math.max(limit, 1), _adminchatthreadsmaxpagesizeconstant.ADMIN_CHAT_THREADS_MAX_PAGE_SIZE);
        const sanitizedOffset = Math.max(offset, 0);
        const filterArgs = {
            scope,
            hasErrorOnly,
            userNeverEngagedOnly,
            searchTerm
        };
        const orderExpression = ORDER_EXPRESSION_BY_SORT_FIELD[sortBy];
        const orderDirection = sortDirection === _adminchatthreadsortdirectionenum.AdminChatThreadSortDirection.ASC ? 'ASC' : 'DESC';
        const listQueryBuilder = this.applyFilters(this.agentChatThreadRepository.createQueryBuilder('thread'), filterArgs);
        const rows = await listQueryBuilder.leftJoin('thread.messages', 'message', '"message"."isHidden" = false').select('thread.id', 'id').addSelect('thread.title', 'title').addSelect('thread.workspaceId', 'workspaceId').addSelect('thread.userWorkspaceId', 'userWorkspaceId').addSelect('thread.deletedAt', 'deletedAt').addSelect('thread.createdAt', 'createdAt').addSelect('thread.updatedAt', 'updatedAt').addSelect('workspace.displayName', 'workspaceDisplayName').addSelect('user.email', 'userEmail').addSelect('user.firstName', 'userFirstName').addSelect('user.lastName', 'userLastName').addSelect('"thread"."lastStreamError" IS NOT NULL', 'hasError').addSelect(this.buildOnboardingThreadPredicate(listQueryBuilder), 'isOnboardingThread').addSelect('COUNT("message"."id")::int', 'messageCount').addSelect(`(
          (COUNT("message"."id") FILTER (WHERE "message"."role" = :userMessageRole))
          + (${this.buildAnsweredQuestionSubQuery(listQueryBuilder, 'COUNT(*)')})
        )::int`, 'userReplyCount').groupBy('"thread"."id"').addGroupBy('"workspace"."id"').addGroupBy('"userWorkspace"."id"').addGroupBy('"user"."id"').orderBy(orderExpression, orderDirection).addOrderBy('"thread"."id"', 'ASC').limit(sanitizedLimit).offset(sanitizedOffset).getRawMany();
        const totalCount = await this.applyFilters(this.agentChatThreadRepository.createQueryBuilder('thread'), filterArgs).getCount();
        const threads = rows.map((row)=>({
                id: row.id,
                title: row.title,
                workspaceId: row.workspaceId,
                workspaceDisplayName: row.workspaceDisplayName,
                userWorkspaceId: row.userWorkspaceId,
                userEmail: row.userEmail,
                userFirstName: row.userFirstName,
                userLastName: row.userLastName,
                messageCount: row.messageCount,
                userReplyCount: row.userReplyCount,
                hasError: row.hasError,
                isOnboardingThread: row.isOnboardingThread,
                deletedAt: row.deletedAt,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt
            }));
        return {
            threads,
            totalCount,
            hasMore: sanitizedOffset + threads.length < totalCount
        };
    }
    constructor(// eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    agentChatThreadRepository){
        this.agentChatThreadRepository = agentChatThreadRepository;
    }
};
AdminPanelGlobalChatThreadsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_agentchatthreadentity.AgentChatThreadEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], AdminPanelGlobalChatThreadsService);

//# sourceMappingURL=admin-panel-global-chat-threads.service.js.map