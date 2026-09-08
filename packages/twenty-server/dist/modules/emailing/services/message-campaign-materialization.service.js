"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageCampaignMaterializationService", {
    enumerable: true,
    get: function() {
        return MessageCampaignMaterializationService;
    }
});
const _campaignsendretrylimitconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-send-retry-limit.constant");
const _campaignsendretrybackoffconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-send-retry-backoff.constant");
const _common = require("@nestjs/common");
const _campaigndeliveryentity = require("../../../engine/core-modules/emailing-domain/campaign-delivery.entity");
const _campaigndeliverystateconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-delivery-state.constant");
const _injectworkspacescopedrepositorydecorator = require("../../../engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _lodashchunk = /*#__PURE__*/ _interop_require_default(require("lodash.chunk"));
const _typeorm = require("typeorm");
const _uuid = require("uuid");
const _campaignconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign.constant");
const _messagequeuedecorator = require("../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../engine/core-modules/message-queue/services/message-queue.service");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagecampaignlifecycleservice = require("./message-campaign-lifecycle.service");
const _messagecampaignworkspaceentity = require("../standard-objects/message-campaign.workspace-entity");
const _buildcampaignmessageidutil = require("../utils/build-campaign-message-id.util");
const _compilecampaignemailcontentutil = require("../utils/compile-campaign-email-content.util");
const _messagedirectionenum = require("../../messaging/common/enums/message-direction.enum");
const _messageworkspaceentity = require("../../messaging/common/standard-objects/message.workspace-entity");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const MATERIALIZATION_CHUNK_SIZE = 500;
// Campaign rows are machine-generated and nothing subscribes to them: no
// webhook, workflow trigger or timeline activity. Emitting would cost a
// snapshot SELECT of every row written plus a timeline row per recipient.
const SKIP_EVENT_EMISSION = {
    shouldSkipEventEmission: true
};
let MessageCampaignMaterializationService = class MessageCampaignMaterializationService {
    async processMaterializeJob({ workspaceId, campaignId, messageChannelId, emailingDomainId, userWorkspaceId, recipients }) {
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const campaignRepository = this.workspaceOrmManager.getRepository(_messagecampaignworkspaceentity.MessageCampaignWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            const campaign = await campaignRepository.findOne({
                where: {
                    id: campaignId
                }
            });
            if (!(0, _utils.isDefined)(campaign) || campaign.status !== _types.MessageCampaignStatus.SENDING) {
                return;
            }
            const uniqueRecipients = this.deduplicateRecipientsByMessageId({
                campaignId,
                recipients
            });
            const existingDeliveries = await this.campaignDeliveryRepository.find(workspaceId, {
                where: {
                    campaignId
                },
                select: {
                    id: true,
                    state: true
                }
            });
            const existingMessageIds = new Set(existingDeliveries.map((delivery)=>delivery.id));
            const queuedMessageIds = new Set(existingDeliveries.filter((delivery)=>delivery.state === _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.QUEUED).map((delivery)=>delivery.id));
            const recipientsStrandedByAnEarlierAttempt = uniqueRecipients.filter((recipient)=>queuedMessageIds.has(recipient.messageId));
            const recipientsToCreate = uniqueRecipients.filter((recipient)=>!existingMessageIds.has(recipient.messageId));
            const enqueuedChunkCount = await this.enqueueMaterializationChunks({
                workspaceId,
                campaignId,
                messageChannelId,
                emailingDomainId,
                userWorkspaceId,
                recipientsToCreate,
                recipientsStrandedByAnEarlierAttempt
            });
            // Only finalize here when there is no chunk left to run. Doing it while
            // chunks are still pending would see zero deliveries and settle the
            // campaign as SENT_WITH_ERRORS before a single message exists.
            if (enqueuedChunkCount === 0) {
                await this.messageCampaignLifecycleService.finalizeCampaignIfComplete({
                    workspaceId,
                    campaignId
                });
            }
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
    }
    async enqueueMaterializationChunks({ workspaceId, campaignId, messageChannelId, emailingDomainId, userWorkspaceId, recipientsToCreate, recipientsStrandedByAnEarlierAttempt }) {
        const receivedAtIso = new Date().toISOString();
        const chunks = [
            ...(0, _lodashchunk.default)(recipientsToCreate, MATERIALIZATION_CHUNK_SIZE).map((recipients)=>({
                    recipients,
                    shouldCreateMessages: true
                })),
            ...(0, _lodashchunk.default)(recipientsStrandedByAnEarlierAttempt, MATERIALIZATION_CHUNK_SIZE).map((recipients)=>({
                    recipients,
                    shouldCreateMessages: false
                }))
        ].map(({ recipients, shouldCreateMessages })=>({
                workspaceId,
                campaignId,
                messageChannelId,
                emailingDomainId,
                userWorkspaceId,
                receivedAtIso,
                shouldCreateMessages,
                recipients
            }));
        if (chunks.length === 0) {
            return 0;
        }
        await this.messageQueueService.bulkAdd(_campaignconstant.MATERIALIZE_CAMPAIGN_CHUNK_JOB, chunks, {
            retryLimit: 3,
            backoff: _campaignsendretrybackoffconstant.CAMPAIGN_SEND_RETRY_BACKOFF
        });
        return chunks.length;
    }
    async processMaterializeChunkJob({ workspaceId, campaignId, messageChannelId, emailingDomainId, userWorkspaceId, receivedAtIso, shouldCreateMessages, recipients }) {
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const campaignRepository = this.workspaceOrmManager.getRepository(_messagecampaignworkspaceentity.MessageCampaignWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            const campaign = await campaignRepository.findOne({
                where: {
                    id: campaignId
                }
            });
            // A cancel between chunks stops the ones that have not run yet.
            if (!(0, _utils.isDefined)(campaign) || campaign.status !== _types.MessageCampaignStatus.SENDING) {
                return;
            }
            if (shouldCreateMessages) {
                const { plainText: unrenderedText } = await (0, _compilecampaignemailcontentutil.compileCampaignEmailContent)(campaign.bodyTemplate ?? '', null);
                await this.insertMessagesBeforeTheirDeliveries({
                    workspaceId,
                    campaignId,
                    messageChannelId,
                    fromAddress: campaign.fromAddress?.primaryEmail ?? '',
                    subjectTemplate: campaign.subject ?? '',
                    text: unrenderedText,
                    now: new Date(receivedAtIso),
                    recipients: await this.rejectAlreadyMaterializedRecipients({
                        campaignId,
                        recipients
                    })
                });
            }
            await this.enqueueSendJobs({
                workspaceId,
                campaignId,
                emailingDomainId,
                userWorkspaceId,
                recipients
            });
            await this.messageCampaignLifecycleService.finalizeCampaignIfComplete({
                workspaceId,
                campaignId
            });
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
    }
    // A retried chunk job must not insert the rows its previous attempt already
    // wrote: message ids are deterministic and would collide, and the thread,
    // association and participant rows would be duplicated under fresh ids.
    async rejectAlreadyMaterializedRecipients({ campaignId, recipients }) {
        if (recipients.length === 0) {
            return [];
        }
        const messageRepository = this.workspaceOrmManager.getRepository(_messageworkspaceentity.MessageWorkspaceEntity, {
            shouldBypassPermissionChecks: true
        });
        const alreadyMaterialized = await messageRepository.find({
            where: {
                messageCampaignId: campaignId,
                id: (0, _typeorm.In)(recipients.map((recipient)=>recipient.messageId))
            },
            select: {
                id: true
            }
        });
        if (alreadyMaterialized.length === 0) {
            return recipients;
        }
        const alreadyMaterializedIds = new Set(alreadyMaterialized.map((message)=>message.id));
        return recipients.filter((recipient)=>!alreadyMaterializedIds.has(recipient.messageId));
    }
    deduplicateRecipientsByMessageId({ campaignId, recipients }) {
        const recipientsByMessageId = new Map();
        for (const recipient of recipients){
            const messageId = (0, _buildcampaignmessageidutil.buildCampaignMessageId)({
                campaignId,
                personId: recipient.personId
            });
            if (!recipientsByMessageId.has(messageId)) {
                recipientsByMessageId.set(messageId, {
                    ...recipient,
                    messageId
                });
            }
        }
        return [
            ...recipientsByMessageId.values()
        ];
    }
    async enqueueSendJobs({ workspaceId, campaignId, emailingDomainId, userWorkspaceId, recipients }) {
        if (recipients.length === 0) {
            return;
        }
        await this.messageQueueService.bulkAdd(_campaignconstant.SEND_CAMPAIGN_EMAIL_JOB, recipients.map((recipient)=>({
                workspaceId,
                campaignId,
                messageId: recipient.messageId,
                personId: recipient.personId,
                recipientEmail: recipient.email,
                emailingDomainId,
                userWorkspaceId
            })), {
            retryLimit: _campaignsendretrylimitconstant.CAMPAIGN_SEND_RETRY_LIMIT,
            backoff: _campaignsendretrybackoffconstant.CAMPAIGN_SEND_RETRY_BACKOFF
        });
    }
    async insertMessagesBeforeTheirDeliveries({ workspaceId, campaignId, messageChannelId, fromAddress, subjectTemplate, text, now, recipients }) {
        await this.insertChunk({
            campaignId,
            messageChannelId,
            fromAddress,
            subjectTemplate,
            text,
            now,
            rows: recipients.map((recipient)=>({
                    recipient,
                    messageId: recipient.messageId,
                    threadId: (0, _uuid.v4)(),
                    temporaryExternalId: (0, _uuid.v4)()
                }))
        });
        await this.campaignDeliveryRepository.upsert(workspaceId, recipients.map((recipient)=>({
                id: recipient.messageId,
                campaignId,
                personId: recipient.personId,
                recipientEmail: recipient.email,
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.QUEUED
            })), {
            conflictPaths: [
                'id'
            ],
            skipUpdateIfNoValuesChanged: true
        });
    }
    async insertChunk({ campaignId, messageChannelId, fromAddress, subjectTemplate, text, now, rows }) {
        await this.workspaceOrmManager.runInWorkspaceTransaction(async (transactionScope)=>{
            const repositoryFor = (objectName)=>transactionScope.getRepository(objectName, {
                    shouldBypassPermissionChecks: true
                }, SKIP_EVENT_EMISSION);
            await repositoryFor('messageThread').insert(rows.map((row)=>({
                    id: row.threadId
                })));
            await repositoryFor('message').insert(rows.map((row)=>({
                    id: row.messageId,
                    headerMessageId: row.temporaryExternalId,
                    subject: subjectTemplate,
                    text,
                    receivedAt: now,
                    messageThreadId: row.threadId,
                    messageCampaignId: campaignId
                })));
            await repositoryFor('messageChannelMessageAssociation').insert(rows.map((row)=>({
                    id: (0, _uuid.v4)(),
                    messageId: row.messageId,
                    messageChannelId,
                    messageExternalId: row.temporaryExternalId,
                    messageThreadExternalId: row.temporaryExternalId,
                    direction: _messagedirectionenum.MessageDirection.OUTGOING
                })));
            await repositoryFor('messageParticipant').insert(rows.flatMap((row)=>[
                    {
                        id: (0, _uuid.v4)(),
                        messageId: row.messageId,
                        role: _types.MessageParticipantRole.FROM,
                        handle: fromAddress,
                        displayName: fromAddress
                    },
                    {
                        id: (0, _uuid.v4)(),
                        messageId: row.messageId,
                        role: _types.MessageParticipantRole.TO,
                        handle: row.recipient.email,
                        displayName: row.recipient.email,
                        personId: row.recipient.personId,
                        messageCampaignId: campaignId
                    }
                ]));
        });
    }
    constructor(campaignDeliveryRepository, workspaceOrmManager, messageCampaignLifecycleService, messageQueueService){
        this.campaignDeliveryRepository = campaignDeliveryRepository;
        this.workspaceOrmManager = workspaceOrmManager;
        this.messageCampaignLifecycleService = messageCampaignLifecycleService;
        this.messageQueueService = messageQueueService;
    }
};
MessageCampaignMaterializationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_campaigndeliveryentity.CampaignDeliveryEntity)),
    _ts_param(3, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.campaignQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _messagecampaignlifecycleservice.MessageCampaignLifecycleService === "undefined" ? Object : _messagecampaignlifecycleservice.MessageCampaignLifecycleService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], MessageCampaignMaterializationService);

//# sourceMappingURL=message-campaign-materialization.service.js.map