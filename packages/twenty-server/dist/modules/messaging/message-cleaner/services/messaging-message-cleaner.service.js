"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingMessageCleanerService", {
    enumerable: true,
    get: function() {
        return MessagingMessageCleanerService;
    }
});
const _common = require("@nestjs/common");
const _lodashchunk = /*#__PURE__*/ _interop_require_default(require("lodash.chunk"));
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _participanttargetreconciliationservice = require("../../../match-participant/participant-target-reconciliation.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const ORPHAN_CLEANUP_PAGE_SIZE = 500;
let MessagingMessageCleanerService = class MessagingMessageCleanerService {
    async deleteMessagesChannelMessageAssociationsAndRelatedOrphans({ workspaceId, messageExternalIds, messageChannelId }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                const messageRepository = transactionScope.getRepository('message');
                const messageChannelMessageAssociationRepository = transactionScope.getRepository('messageChannelMessageAssociation');
                const messageThreadRepository = transactionScope.getRepository('messageThread');
                for (const messageExternalIdsChunk of (0, _lodashchunk.default)(messageExternalIds, 500)){
                    const associationsToDelete = await messageChannelMessageAssociationRepository.find({
                        where: {
                            messageExternalId: (0, _typeorm.In)(messageExternalIdsChunk),
                            messageChannelId
                        }
                    });
                    if (associationsToDelete.length <= 0) {
                        continue;
                    }
                    await messageChannelMessageAssociationRepository.delete(associationsToDelete.map(({ id })=>id));
                    this.logger.log(`WorkspaceId: ${workspaceId} Deleting ${associationsToDelete.length} message channel message associations`);
                    const candidateMessageIds = [
                        ...new Set(associationsToDelete.map(({ messageId })=>messageId))
                    ];
                    const orphanMessageIds = await this.filterOrphans(candidateMessageIds, (messageIds)=>this.findReferencedMessageIds(messageChannelMessageAssociationRepository, messageIds));
                    if (orphanMessageIds.length <= 0) {
                        continue;
                    }
                    const orphanMessages = await messageRepository.find({
                        where: {
                            id: (0, _typeorm.In)(orphanMessageIds)
                        }
                    });
                    await messageRepository.delete(orphanMessageIds);
                    const candidateThreadIds = [
                        ...new Set(orphanMessages.map(({ messageThreadId })=>messageThreadId).filter(_utils.isDefined))
                    ];
                    const orphanThreadIds = await this.filterOrphans(candidateThreadIds, (threadIds)=>this.findReferencedThreadIds(messageRepository, threadIds));
                    if (orphanThreadIds.length > 0) {
                        await messageThreadRepository.delete(orphanThreadIds);
                    }
                    await this.participantTargetReconciliationService.reconcileMessageThreadTargets({
                        messageThreadIds: candidateThreadIds.filter((threadId)=>!orphanThreadIds.includes(threadId)),
                        transactionScope
                    });
                }
            });
        }, authContext, {
            lite: true
        });
    }
    async deleteMessageChannelMessageAssociationsByChannelId({ workspaceId, messageChannelId }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                const messageChannelMessageAssociationRepository = transactionScope.getRepository('messageChannelMessageAssociation');
                for(;;){
                    const associations = await messageChannelMessageAssociationRepository.find({
                        where: {
                            messageChannelId
                        },
                        take: ORPHAN_CLEANUP_PAGE_SIZE,
                        select: {
                            id: true
                        }
                    });
                    if (associations.length === 0) {
                        break;
                    }
                    const ids = associations.map(({ id })=>id);
                    this.logger.log(`WorkspaceId: ${workspaceId} Deleting ${ids.length} message channel message associations for channel ${messageChannelId}`);
                    await messageChannelMessageAssociationRepository.delete(ids);
                }
            });
        }, authContext, {
            lite: true
        });
    }
    async cleanOrphanMessagesAndThreads(workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                const messageThreadRepository = transactionScope.getRepository('messageThread');
                const messageRepository = transactionScope.getRepository('message');
                const messageChannelMessageAssociationRepository = transactionScope.getRepository('messageChannelMessageAssociation');
                await this.deleteOrphansByKeyset(async (cursor)=>{
                    const page = await messageRepository.find({
                        where: (0, _utils.isDefined)(cursor) ? {
                            id: (0, _typeorm.MoreThan)(cursor)
                        } : {},
                        order: {
                            id: 'ASC'
                        },
                        take: ORPHAN_CLEANUP_PAGE_SIZE,
                        select: {
                            id: true
                        }
                    });
                    return page.map(({ id })=>id);
                }, async (ids)=>{
                    const messagesToDelete = await messageRepository.find({
                        where: {
                            id: (0, _typeorm.In)(ids)
                        },
                        select: {
                            messageThreadId: true
                        }
                    });
                    const candidateThreadIds = [
                        ...new Set(messagesToDelete.map(({ messageThreadId })=>messageThreadId).filter(_utils.isDefined))
                    ];
                    await messageRepository.delete(ids);
                    const survivingThreadIds = await this.findReferencedThreadIds(messageRepository, candidateThreadIds);
                    await this.participantTargetReconciliationService.reconcileMessageThreadTargets({
                        messageThreadIds: survivingThreadIds,
                        transactionScope
                    });
                }, (pageIds)=>this.filterOrphans(pageIds, (ids)=>this.findReferencedMessageIds(messageChannelMessageAssociationRepository, ids)));
                await this.deleteOrphansByKeyset(async (cursor)=>{
                    const page = await messageThreadRepository.find({
                        where: (0, _utils.isDefined)(cursor) ? {
                            id: (0, _typeorm.MoreThan)(cursor)
                        } : {},
                        order: {
                            id: 'ASC'
                        },
                        take: ORPHAN_CLEANUP_PAGE_SIZE,
                        select: {
                            id: true
                        }
                    });
                    return page.map(({ id })=>id);
                }, (ids)=>messageThreadRepository.delete(ids), (pageIds)=>this.filterOrphans(pageIds, (ids)=>this.findReferencedThreadIds(messageRepository, ids)));
            });
        }, authContext, {
            lite: true
        });
    }
    async findReferencedMessageIds(messageChannelMessageAssociationRepository, messageIds) {
        const associations = await messageChannelMessageAssociationRepository.find({
            where: {
                messageId: (0, _typeorm.In)(messageIds)
            },
            select: {
                messageId: true
            }
        });
        return associations.map(({ messageId })=>messageId);
    }
    async findReferencedThreadIds(messageRepository, threadIds) {
        if (threadIds.length === 0) {
            return [];
        }
        const messages = await messageRepository.find({
            where: {
                messageThreadId: (0, _typeorm.In)(threadIds)
            },
            select: {
                messageThreadId: true
            }
        });
        return messages.map(({ messageThreadId })=>messageThreadId).filter(_utils.isDefined);
    }
    async filterOrphans(parentIds, findReferencedParentIds) {
        if (parentIds.length === 0) {
            return [];
        }
        const referencedParentIds = new Set(await findReferencedParentIds(parentIds));
        return parentIds.filter((parentId)=>!referencedParentIds.has(parentId));
    }
    async deleteOrphansByKeyset(fetchPageIds, deleteByIds, findOrphanIds) {
        let cursor;
        for(;;){
            const pageIds = await fetchPageIds(cursor);
            if (pageIds.length === 0) {
                break;
            }
            cursor = pageIds[pageIds.length - 1];
            const orphanIds = await findOrphanIds(pageIds);
            if (orphanIds.length > 0) {
                await deleteByIds(orphanIds);
            }
        }
    }
    constructor(workspaceOrmManager, participantTargetReconciliationService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.participantTargetReconciliationService = participantTargetReconciliationService;
        this.logger = new _common.Logger(MessagingMessageCleanerService.name);
    }
};
MessagingMessageCleanerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _participanttargetreconciliationservice.ParticipantTargetReconciliationService === "undefined" ? Object : _participanttargetreconciliationservice.ParticipantTargetReconciliationService
    ])
], MessagingMessageCleanerService);

//# sourceMappingURL=messaging-message-cleaner.service.js.map