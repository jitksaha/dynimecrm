"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingSaveMessagesAndEnqueueContactCreationService", {
    enumerable: true,
    get: function() {
        return MessagingSaveMessagesAndEnqueueContactCreationService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _messagequeuedecorator = require("../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../engine/core-modules/message-queue/services/message-queue.service");
const _workspaceormmanager = require("../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _createcompanyandcontactjob = require("../../../contact-creation-manager/jobs/create-company-and-contact.job");
const _messagingmessagefolderassociationservice = require("./messaging-message-folder-association.service");
const _messagingmessageservice = require("./messaging-message.service");
const _isgroupemail = require("../utils/is-group-email");
const _messagingmessageparticipantservice = require("../../message-participant-manager/services/messaging-message-participant.service");
const _isworkemail = require("../../../../utils/is-work-email");
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
let MessagingSaveMessagesAndEnqueueContactCreationService = class MessagingSaveMessagesAndEnqueueContactCreationService {
    async saveMessagesAndEnqueueContactCreation(messagesToSave, messageChannel, connectedAccount, workspaceId) {
        const handleAliases = connectedAccount.handleAliases || [];
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        const savedMessagesResult = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            return this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
                const { messageExternalIdsAndIdsMap, messageExternalIdToMessageChannelMessageAssociationIdMap, messageExternalIdToMessageThreadIdMap } = await this.messageService.saveMessagesWithinTransaction(messagesToSave, messageChannel.id, transactionScope, workspaceId);
                const participantsWithMessageId = messagesToSave.flatMap((message)=>{
                    const messageId = messageExternalIdsAndIdsMap.get(message.externalId);
                    return messageId ? message.participants.map((participant)=>{
                        const fromHandle = message.participants.find((p)=>p.role === _types.MessageParticipantRole.FROM)?.handle || '';
                        const isMessageSentByConnectedAccount = handleAliases.includes(fromHandle) || fromHandle === connectedAccount.handle;
                        const isParticipantConnectedAccount = handleAliases.includes(participant.handle) || participant.handle === connectedAccount.handle;
                        const isExcludedByNonProfessionalEmails = messageChannel.excludeNonProfessionalEmails && !(0, _isworkemail.isWorkEmail)(participant.handle);
                        const isExcludedByGroupEmails = messageChannel.excludeGroupEmails && (0, _isgroupemail.isGroupEmail)(participant.handle);
                        // Drafts are outgoing, so don't turn recipients of an
                        // unsent email into CRM contacts.
                        const shouldCreateContact = !message.isDraft && !!participant.handle && !isParticipantConnectedAccount && !isExcludedByNonProfessionalEmails && !isExcludedByGroupEmails && (messageChannel.contactAutoCreationPolicy === _types.MessageChannelContactAutoCreationPolicy.SENT_AND_RECEIVED || messageChannel.contactAutoCreationPolicy === _types.MessageChannelContactAutoCreationPolicy.SENT && isMessageSentByConnectedAccount);
                        return {
                            ...participant,
                            messageId,
                            shouldCreateContact
                        };
                    }) : [];
                });
                const savedMessageParticipants = await this.messageParticipantService.saveMessageParticipants(participantsWithMessageId, workspaceId, transactionScope);
                const folderAssociations = messagesToSave.flatMap((message)=>{
                    const messageFolderIds = message.messageFolderIds ?? [];
                    if (messageFolderIds.length === 0) {
                        return [];
                    }
                    const associationId = messageExternalIdToMessageChannelMessageAssociationIdMap.get(message.externalId);
                    if (!(0, _utils.isDefined)(associationId)) {
                        return [];
                    }
                    return [
                        {
                            messageChannelMessageAssociationId: associationId,
                            messageFolderIds
                        }
                    ];
                });
                await this.messageFolderAssociationService.saveMessageFolderAssociations(folderAssociations, workspaceId, transactionScope);
                return {
                    participantsWithMessageId,
                    savedMessageParticipants,
                    messageExternalIdsAndIdsMap,
                    messageExternalIdToMessageThreadIdMap
                };
            });
        }, authContext, {
            lite: true
        });
        if (messageChannel.isContactAutoCreationEnabled && savedMessagesResult) {
            const contactsToCreate = savedMessagesResult.participantsWithMessageId.filter((participant)=>participant.shouldCreateContact);
            await this.messageQueueService.add(_createcompanyandcontactjob.CreateCompanyAndContactJob.name, {
                workspaceId,
                connectedAccount,
                contactsToCreate,
                source: _types.FieldActorSource.EMAIL
            });
        }
        if (!(0, _utils.isDefined)(savedMessagesResult)) {
            return undefined;
        }
        await this.messageParticipantService.matchMessageParticipants({
            participants: savedMessagesResult.savedMessageParticipants,
            messageIds: [
                ...new Set(savedMessagesResult.participantsWithMessageId.map(({ messageId })=>messageId))
            ],
            workspaceId
        });
        return {
            messageExternalIdsAndIdsMap: savedMessagesResult.messageExternalIdsAndIdsMap,
            messageExternalIdToMessageThreadIdMap: savedMessagesResult.messageExternalIdToMessageThreadIdMap
        };
    }
    constructor(messageQueueService, messageService, messageParticipantService, messageFolderAssociationService, workspaceOrmManager){
        this.messageQueueService = messageQueueService;
        this.messageService = messageService;
        this.messageParticipantService = messageParticipantService;
        this.messageFolderAssociationService = messageFolderAssociationService;
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
MessagingSaveMessagesAndEnqueueContactCreationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.contactCreationQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _messagingmessageservice.MessagingMessageService === "undefined" ? Object : _messagingmessageservice.MessagingMessageService,
        typeof _messagingmessageparticipantservice.MessagingMessageParticipantService === "undefined" ? Object : _messagingmessageparticipantservice.MessagingMessageParticipantService,
        typeof _messagingmessagefolderassociationservice.MessagingMessageFolderAssociationService === "undefined" ? Object : _messagingmessagefolderassociationservice.MessagingMessageFolderAssociationService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], MessagingSaveMessagesAndEnqueueContactCreationService);

//# sourceMappingURL=messaging-save-messages-and-enqueue-contact-creation.service.js.map