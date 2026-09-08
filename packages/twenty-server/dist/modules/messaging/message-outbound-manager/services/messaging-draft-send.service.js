"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingDraftSendService", {
    enumerable: true,
    get: function() {
        return MessagingDraftSendService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _messagechannelentity = require("../../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagingmessagecleanerservice = require("../../message-cleaner/services/messaging-message-cleaner.service");
const _messagingmessageoutboundservice = require("./messaging-message-outbound.service");
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
let MessagingDraftSendService = class MessagingDraftSendService {
    async sendDraftMessage({ draftMessageId, sendMessageInput, connectedAccount, workspaceId }) {
        const draftAssociation = await this.resolveDraftAssociation(draftMessageId, connectedAccount.id, workspaceId);
        if (!(0, _utils.isDefined)(draftAssociation)) {
            throw new Error(`Could not find a synced draft to send for message ${draftMessageId}`);
        }
        return this.messageOutboundService.sendDraft(draftAssociation.messageExternalId, sendMessageInput, connectedAccount);
    }
    async getSentMessageThreadId({ messageExternalId, workspaceId }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageChannelMessageAssociationRepository = this.workspaceOrmManager.getRepository('messageChannelMessageAssociation');
            const association = await messageChannelMessageAssociationRepository.findOne({
                where: {
                    messageExternalId
                },
                relations: {
                    message: true
                }
            });
            return association?.message?.messageThreadId ?? undefined;
        }, authContext, {
            lite: true
        });
    }
    async deleteSentDraft({ draftMessageId, connectedAccountId, workspaceId }) {
        const draftAssociation = await this.resolveDraftAssociation(draftMessageId, connectedAccountId, workspaceId);
        if (!(0, _utils.isDefined)(draftAssociation)) {
            return;
        }
        await this.messageCleanerService.deleteMessagesChannelMessageAssociationsAndRelatedOrphans({
            workspaceId,
            messageExternalIds: [
                draftAssociation.messageExternalId
            ],
            messageChannelId: draftAssociation.messageChannelId
        });
    }
    // Scoped to the caller's own channels so a member cannot act on another
    // member's draft by passing its message id.
    async resolveDraftAssociation(draftMessageId, connectedAccountId, workspaceId) {
        const channels = await this.messageChannelRepository.find({
            where: {
                connectedAccountId,
                workspaceId
            }
        });
        const channelIds = channels.map((channel)=>channel.id);
        if (channelIds.length === 0) {
            return null;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        const associations = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageChannelMessageAssociationRepository = this.workspaceOrmManager.getRepository('messageChannelMessageAssociation');
            return messageChannelMessageAssociationRepository.find({
                where: {
                    messageId: draftMessageId,
                    messageChannelId: (0, _typeorm1.In)(channelIds)
                }
            });
        }, authContext, {
            lite: true
        });
        const association = associations.find((currentAssociation)=>(0, _guards.isNonEmptyString)(currentAssociation.messageExternalId));
        if (!association || !(0, _guards.isNonEmptyString)(association.messageExternalId)) {
            return null;
        }
        return {
            messageExternalId: association.messageExternalId,
            messageChannelId: association.messageChannelId
        };
    }
    constructor(workspaceOrmManager, messageOutboundService, messageCleanerService, messageChannelRepository){
        this.workspaceOrmManager = workspaceOrmManager;
        this.messageOutboundService = messageOutboundService;
        this.messageCleanerService = messageCleanerService;
        this.messageChannelRepository = messageChannelRepository;
    }
};
MessagingDraftSendService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _messagingmessageoutboundservice.MessagingMessageOutboundService === "undefined" ? Object : _messagingmessageoutboundservice.MessagingMessageOutboundService,
        typeof _messagingmessagecleanerservice.MessagingMessageCleanerService === "undefined" ? Object : _messagingmessagecleanerservice.MessagingMessageCleanerService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], MessagingDraftSendService);

//# sourceMappingURL=messaging-draft-send.service.js.map