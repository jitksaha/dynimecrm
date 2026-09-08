"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineMessagingService", {
    enumerable: true,
    get: function() {
        return TimelineMessagingService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _fileurlservice = require("../../file/file-url/file-url.service");
const _userworkspaceentity = require("../../user-workspace/user-workspace.entity");
const _connectedaccountentity = require("../../../metadata-modules/connected-account/entities/connected-account.entity");
const _messagechannelentity = require("../../../metadata-modules/message-channel/entities/message-channel.entity");
const _workspaceormmanager = require("../../../twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../twenty-orm/utils/build-system-auth-context.util");
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
let TimelineMessagingService = class TimelineMessagingService {
    async getAndCountMessageThreads(personIds, workspaceId, offset, pageSize, targetFilter) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageThreadRepository = this.workspaceOrmManager.getRepository('messageThread');
            const totalQueryBuilder = messageThreadRepository.createQueryBuilder('messageThread').innerJoin('messageThread.messages', 'messages').groupBy('messageThread.id');
            const threadIdsQueryBuilder = messageThreadRepository.createQueryBuilder('messageThread').select('messageThread.id', 'id').addSelect('MAX(messages.receivedAt)', 'max_received_at').innerJoin('messageThread.messages', 'messages').groupBy('messageThread.id').orderBy('max_received_at', 'DESC').offset(offset).limit(pageSize);
            const applyRecordFilter = (queryBuilder)=>{
                if ((0, _utils.isDefined)(targetFilter)) {
                    queryBuilder.innerJoin('messageThread.messageThreadTargets', 'messageThreadTargets').where(`messageThreadTargets.${targetFilter.fieldName} = :targetRecordId`, {
                        targetRecordId: targetFilter.recordId
                    });
                    return;
                }
                queryBuilder.innerJoin('messages.messageParticipants', 'messageParticipants').where('messageParticipants.personId IN(:...personIds)', {
                    personIds
                });
            };
            applyRecordFilter(totalQueryBuilder);
            applyRecordFilter(threadIdsQueryBuilder);
            const totalNumberOfThreads = await totalQueryBuilder.getCount();
            const threadIdsQuery = await threadIdsQueryBuilder.getRawMany();
            const messageThreadIds = threadIdsQuery.map((thread)=>thread.id);
            const messageThreads = await messageThreadRepository.find({
                where: {
                    id: (0, _typeorm1.In)(messageThreadIds)
                },
                order: {
                    messages: {
                        receivedAt: 'DESC'
                    }
                },
                relations: [
                    'messages'
                ]
            });
            return {
                messageThreads: messageThreads.map((messageThread)=>{
                    const lastMessage = messageThread.messages[0];
                    const firstMessage = messageThread.messages[messageThread.messages.length - 1];
                    return {
                        id: messageThread.id,
                        subject: firstMessage.subject ?? '',
                        lastMessageBody: lastMessage.text ?? '',
                        lastMessageReceivedAt: lastMessage.receivedAt ?? new Date(),
                        numberOfMessagesInThread: messageThread.messages.length,
                        lastMessageIsDraft: lastMessage.isDraft ?? false
                    };
                }),
                totalNumberOfThreads
            };
        }, authContext);
    }
    async getThreadParticipantsByThreadId(messageThreadIds, workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageParticipantRepository = this.workspaceOrmManager.getRepository('messageParticipant');
            const threadParticipants = await messageParticipantRepository.createQueryBuilder().select('messageParticipant').addSelect('message.messageThreadId').addSelect('message.receivedAt').leftJoinAndSelect('messageParticipant.person', 'person').leftJoinAndSelect('messageParticipant.workspaceMember', 'workspaceMember').leftJoin('messageParticipant.message', 'message').where('message.messageThreadId = ANY(:messageThreadIds)', {
                messageThreadIds
            }).andWhere('messageParticipant.role = :role', {
                role: _types.MessageParticipantRole.FROM
            }).orderBy('message.messageThreadId').distinctOn([
                'message.messageThreadId',
                'messageParticipant.handle'
            ]).getMany();
            const orderedThreadParticipants = threadParticipants.sort((a, b)=>(a.message.receivedAt ?? new Date()).getTime() - (b.message.receivedAt ?? new Date()).getTime());
            const threadParticipantPromises = orderedThreadParticipants.map(async (threadParticipant)=>{
                const personAvatarFileUrl = await this.fileUrlService.signFirstFilesFieldFileUrl({
                    filesFieldValue: threadParticipant.person?.avatarFile,
                    workspaceId
                });
                return {
                    ...threadParticipant,
                    person: {
                        id: threadParticipant.person?.id,
                        name: {
                            //oxlint-disable-next-line
                            //@ts-ignore
                            firstName: threadParticipant.person?.nameFirstName,
                            //oxlint-disable-next-line
                            //@ts-ignore
                            lastName: threadParticipant.person?.nameLastName
                        },
                        avatarUrl: personAvatarFileUrl || threadParticipant.person?.avatarUrl
                    },
                    workspaceMember: {
                        id: threadParticipant.workspaceMember?.id,
                        name: {
                            //oxlint-disable-next-line
                            //@ts-ignore
                            firstName: threadParticipant.workspaceMember?.nameFirstName,
                            //oxlint-disable-next-line
                            //@ts-ignore
                            lastName: threadParticipant.workspaceMember?.nameLastName
                        },
                        avatarUrl: threadParticipant.workspaceMember?.avatarUrl
                    }
                };
            });
            const threadParticipantsWithCompositeFields = await Promise.all(threadParticipantPromises);
            return threadParticipantsWithCompositeFields.reduce((threadParticipantsAcc, threadParticipant)=>{
                if (!threadParticipant.message.messageThreadId) return threadParticipantsAcc;
                if (// @ts-expect-error legacy noImplicitAny
                !threadParticipantsAcc[threadParticipant.message.messageThreadId]) // @ts-expect-error legacy noImplicitAny
                threadParticipantsAcc[threadParticipant.message.messageThreadId] = [];
                // @ts-expect-error legacy noImplicitAny
                threadParticipantsAcc[threadParticipant.message.messageThreadId].push(threadParticipant);
                return threadParticipantsAcc;
            }, {});
        }, authContext);
    }
    async getThreadVisibilityByThreadId(messageThreadIds, workspaceMemberId, workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceMemberRepository = this.workspaceOrmManager.getRepository('workspaceMember', {
                shouldBypassPermissionChecks: true
            });
            const currentMember = await workspaceMemberRepository.findOne({
                where: {
                    id: workspaceMemberId
                },
                select: {
                    userId: true
                }
            });
            if (!currentMember) {
                return {};
            }
            const currentUserWorkspace = await this.userWorkspaceRepository.findOne({
                where: {
                    userId: currentMember.userId,
                    workspaceId
                },
                select: {
                    id: true
                }
            });
            if (!currentUserWorkspace) {
                return {};
            }
            const currentUserWorkspaceId = currentUserWorkspace.id;
            const messageThreadRepository = this.workspaceOrmManager.getRepository('messageThread');
            const threadChannelRows = await messageThreadRepository.createQueryBuilder().select('messageThread.id', 'id').addSelect('messageChannelMessageAssociation.messageChannelId', 'messageChannelId').leftJoin('messageThread.messages', 'message').leftJoin('message.messageChannelMessageAssociations', 'messageChannelMessageAssociation').where('messageThread.id = ANY(:messageThreadIds)', {
                messageThreadIds
            }).getRawMany();
            const allMessageChannelIds = [
                ...new Set(threadChannelRows.map((row)=>row.messageChannelId).filter((id)=>id !== null && id !== undefined))
            ];
            if (allMessageChannelIds.length === 0) {
                return {};
            }
            const messageChannels = await this.messageChannelRepository.find({
                where: {
                    id: (0, _typeorm1.In)(allMessageChannelIds),
                    workspaceId
                },
                select: {
                    id: true,
                    visibility: true,
                    connectedAccountId: true
                }
            });
            const allConnectedAccountIds = [
                ...new Set(messageChannels.map((channel)=>channel.connectedAccountId))
            ];
            const ownedAccountIds = new Set((await this.connectedAccountRepository.find({
                where: {
                    id: (0, _typeorm1.In)(allConnectedAccountIds),
                    userWorkspaceId: currentUserWorkspaceId
                },
                select: {
                    id: true
                }
            })).map((account)=>account.id));
            const channelVisibilityMap = new Map(messageChannels.map((channel)=>[
                    channel.id,
                    ownedAccountIds.has(channel.connectedAccountId) ? _types.MessageChannelVisibility.SHARE_EVERYTHING : channel.visibility
                ]));
            const visibilityValues = Object.values(_types.MessageChannelVisibility);
            const threadVisibilityByThreadId = {};
            for (const { id: threadId, messageChannelId } of threadChannelRows){
                if (!messageChannelId) continue;
                const channelVisibility = channelVisibilityMap.get(messageChannelId);
                if (!channelVisibility) continue;
                threadVisibilityByThreadId[threadId] = visibilityValues[Math.max(visibilityValues.indexOf(channelVisibility), visibilityValues.indexOf(threadVisibilityByThreadId[threadId] ?? _types.MessageChannelVisibility.METADATA))];
            }
            return threadVisibilityByThreadId;
        }, authContext);
    }
    constructor(workspaceOrmManager, messageChannelRepository, connectedAccountRepository, userWorkspaceRepository, fileUrlService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.messageChannelRepository = messageChannelRepository;
        this.connectedAccountRepository = connectedAccountRepository;
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.fileUrlService = fileUrlService;
    }
};
TimelineMessagingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _fileurlservice.FileUrlService === "undefined" ? Object : _fileurlservice.FileUrlService
    ])
], TimelineMessagingService);

//# sourceMappingURL=timeline-messaging.service.js.map