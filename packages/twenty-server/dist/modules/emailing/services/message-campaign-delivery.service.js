"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageCampaignDeliveryService", {
    enumerable: true,
    get: function() {
        return MessageCampaignDeliveryService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _campaigndeliveryentity = require("../../../engine/core-modules/emailing-domain/campaign-delivery.entity");
const _campaignconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign.constant");
const _campaignsendretrybackoffconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-send-retry-backoff.constant");
const _campaignsendretrylimitconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-send-retry-limit.constant");
const _campaigndeliveryclaimttlmsconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-delivery-claim-ttl-ms.constant");
const _messagequeuedecorator = require("../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../engine/core-modules/message-queue/services/message-queue.service");
const _usagelimitexception = require("../../../engine/core-modules/usage-limit/exceptions/usage-limit.exception");
const _usagelimitspeedservice = require("../../../engine/core-modules/usage-limit/services/usage-limit-speed.service");
const _usageoperationtypeenum = require("../../../engine/core-modules/usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../../engine/core-modules/usage/enums/usage-resource-type.enum");
const _campaigndeliverystateconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-delivery-state.constant");
const _campaignfailurereasonconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-failure-reason.constant");
const _campaignskipreasonconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-skip-reason.constant");
const _injectworkspacescopedrepositorydecorator = require("../../../engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _uuid = require("uuid");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _campaignvariableservice = require("./campaign-variable.service");
const _emailbillingservice = require("./email-billing.service");
const _emailingdomainsenderservice = require("./emailing-domain-sender.service");
const _messagecampaignlifecycleservice = require("./message-campaign-lifecycle.service");
const _messagecampaignworkspaceentity = require("../standard-objects/message-campaign.workspace-entity");
const _resolvecampaignsendfailureutil = require("../utils/resolve-campaign-send-failure.util");
const _rendercampaignemailutil = require("../utils/render-campaign-email.util");
const _messagechannelmessageassociationworkspaceentity = require("../../messaging/common/standard-objects/message-channel-message-association.workspace-entity");
const _messageworkspaceentity = require("../../messaging/common/standard-objects/message.workspace-entity");
const _personworkspaceentity = require("../../person/standard-objects/person.workspace-entity");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
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
const SEND_SLOT_RETRY = {
    attemptLimit: 60,
    jitterRatio: 0.5,
    maxWindows: 3,
    minDelayMs: 1_000,
    maxDelayMs: 60_000
};
let MessageCampaignDeliveryService = class MessageCampaignDeliveryService {
    async processSendJob(data) {
        const { workspaceId, campaignId } = data;
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const campaign = await this.findRunningCampaign(campaignId);
            if (!(0, _utils.isDefined)(campaign)) {
                return;
            }
            const claimableCount = await this.campaignDeliveryRepository.count(workspaceId, {
                where: {
                    id: data.messageId,
                    state: (0, _typeorm.In)([
                        _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.QUEUED,
                        _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED
                    ])
                }
            });
            if (claimableCount === 0) {
                return;
            }
            const creditContext = await this.emailBillingService.resolveEmailCreditContext(workspaceId);
            if (creditContext.hasCredits) {
                const refusal = await this.findSendSlotRefusal(workspaceId);
                if ((0, _utils.isDefined)(refusal)) {
                    await this.requeueRateLimitedSendJob({
                        data,
                        refusal
                    });
                    return;
                }
            }
            const messageRepository = this.workspaceOrmManager.getRepository(_messageworkspaceentity.MessageWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            const sendContext = await this.loadSendContext({
                data,
                campaign
            });
            if (!(0, _utils.isDefined)(sendContext)) {
                return;
            }
            await this.deliverMessage({
                data,
                messageRepository,
                sendContext,
                creditContext
            });
            await this.messageCampaignLifecycleService.finalizeCampaignIfComplete({
                workspaceId,
                campaignId
            });
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId));
    }
    async findRunningCampaign(campaignId) {
        const campaignRepository = this.workspaceOrmManager.getRepository(_messagecampaignworkspaceentity.MessageCampaignWorkspaceEntity, {
            shouldBypassPermissionChecks: true
        });
        const campaign = await campaignRepository.findOne({
            where: {
                id: campaignId
            }
        });
        if (!(0, _utils.isDefined)(campaign) || campaign.status === _types.MessageCampaignStatus.CANCELED) {
            return null;
        }
        return campaign;
    }
    async findSendSlotRefusal(workspaceId) {
        try {
            await this.usageLimitSpeedService.consumeOrThrow({
                resourceType: _usageresourcetypeenum.UsageResourceType.EMAIL,
                operationType: _usageoperationtypeenum.UsageOperationType.EMAIL_SEND,
                authContext: (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId)
            });
            return null;
        } catch (error) {
            if (!(error instanceof _usagelimitexception.UsageLimitException) || error.code !== _usagelimitexception.UsageLimitExceptionCode.RATE_LIMITED) {
                throw error;
            }
            return {
                retryDelayMs: Math.max(error.exhaustedScope?.retryAfterMs ?? 0, SEND_SLOT_RETRY.minDelayMs),
                windowMs: (error.exhaustedScope?.windowSeconds ?? 0) * 1000
            };
        }
    }
    async requeueRateLimitedSendJob({ data, refusal: { retryDelayMs, windowMs } }) {
        const attemptCount = (data.rateLimitedAttemptCount ?? 0) + 1;
        if (attemptCount > SEND_SLOT_RETRY.attemptLimit) {
            await this.failRateLimitedDelivery({
                workspaceId: data.workspaceId,
                campaignId: data.campaignId,
                messageId: data.messageId
            });
            return;
        }
        const backoffCeilingMs = Math.min(windowMs * SEND_SLOT_RETRY.maxWindows, SEND_SLOT_RETRY.maxDelayMs);
        const backoffMs = Math.min(retryDelayMs * 2 ** (attemptCount - 1), Math.max(backoffCeilingMs, SEND_SLOT_RETRY.minDelayMs));
        await this.messageQueueService.add(_campaignconstant.SEND_CAMPAIGN_EMAIL_JOB, {
            ...data,
            rateLimitedAttemptCount: attemptCount
        }, {
            delay: Math.ceil(backoffMs * (1 + Math.random() * SEND_SLOT_RETRY.jitterRatio)),
            retryLimit: _campaignsendretrylimitconstant.CAMPAIGN_SEND_RETRY_LIMIT,
            backoff: _campaignsendretrybackoffconstant.CAMPAIGN_SEND_RETRY_BACKOFF
        });
    }
    async failRateLimitedDelivery({ workspaceId, campaignId, messageId }) {
        const { affected } = await this.campaignDeliveryRepository.update(workspaceId, {
            id: messageId,
            state: (0, _typeorm.In)([
                _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.QUEUED,
                _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED
            ])
        }, {
            state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
            failureReason: _campaignfailurereasonconstant.CAMPAIGN_FAILURE_REASON.RATE_LIMITED
        });
        if (affected === 1) {
            this.logger.warn(`Campaign ${campaignId} of workspace ${workspaceId} gave up on message ${messageId} after ${SEND_SLOT_RETRY.attemptLimit} refused send slots`);
        }
        await this.messageCampaignLifecycleService.finalizeCampaignIfComplete({
            workspaceId,
            campaignId
        });
    }
    async loadSendContext({ data, campaign }) {
        const { workspaceId, campaignId, messageId, personId } = data;
        const campaignRepository = this.workspaceOrmManager.getRepository(_messagecampaignworkspaceentity.MessageCampaignWorkspaceEntity, {
            shouldBypassPermissionChecks: true
        });
        const claimToken = await this.claimDeliveryForSending({
            workspaceId,
            messageId
        });
        if (!(0, _utils.isDefined)(claimToken)) {
            return null;
        }
        const campaignAfterClaim = await campaignRepository.findOne({
            where: {
                id: campaignId
            },
            select: {
                id: true,
                status: true
            }
        });
        if (campaignAfterClaim?.status === _types.MessageCampaignStatus.CANCELED) {
            await this.settleClaimedDelivery({
                workspaceId,
                messageId,
                claimToken,
                update: {
                    state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SKIPPED,
                    skipReason: _campaignskipreasonconstant.CAMPAIGN_SKIP_REASON.CAMPAIGN_CANCELED
                }
            });
            return null;
        }
        const personRepository = this.workspaceOrmManager.getRepository(_personworkspaceentity.PersonWorkspaceEntity, {
            shouldBypassPermissionChecks: true
        });
        return {
            campaign,
            claimToken,
            person: await personRepository.findOne({
                where: {
                    id: personId
                }
            })
        };
    }
    async deliverMessage({ data, messageRepository, sendContext: { campaign, person, claimToken }, creditContext: { hasCredits, currentBillingSubscription } }) {
        const { workspaceId, campaignId, messageId, recipientEmail, emailingDomainId, userWorkspaceId } = data;
        if (!hasCredits) {
            await this.settleClaimedDelivery({
                workspaceId,
                messageId,
                claimToken,
                update: {
                    state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SKIPPED,
                    skipReason: _campaignskipreasonconstant.CAMPAIGN_SKIP_REASON.OUT_OF_CREDITS
                }
            });
            return;
        }
        const variables = await this.campaignVariableService.buildVariablesForPerson(workspaceId, person);
        const { subject, html, plainText } = await (0, _rendercampaignemailutil.renderCampaignEmail)({
            subjectTemplate: campaign.subject ?? '',
            bodyTemplate: campaign.bodyTemplate ?? '',
            variables
        });
        const result = await this.sendOrRecordFailure({
            messageId,
            claimToken,
            campaignId,
            workspaceId,
            emailingDomainId,
            email: {
                from: campaign.fromAddress?.primaryEmail ?? '',
                to: [
                    recipientEmail
                ],
                subject,
                text: plainText,
                html,
                sendKind: 'MARKETING',
                unsubscribeTopicId: campaign.unsubscribeTopicId ?? undefined
            }
        });
        if (!(0, _utils.isDefined)(result)) {
            return;
        }
        const affected = await this.settleClaimedDelivery({
            workspaceId,
            messageId,
            claimToken,
            update: {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SENT,
                providerMessageId: result.messageId,
                sentAt: new Date(),
                failureReason: null,
                skipReason: null
            }
        });
        if (affected !== 1) {
            this.logger.warn(`Campaign ${campaignId} delivered message ${messageId} but another worker owns the claim, so this send is recorded by neither and is not billed`);
            return;
        }
        await messageRepository.update(messageId, {
            headerMessageId: result.messageId,
            subject,
            text: plainText
        });
        await this.emailBillingService.billSentEmails({
            workspaceId,
            sentEmailCount: 1,
            userWorkspaceId,
            currentBillingSubscription
        }).catch((error)=>{
            this.logger.error(`Campaign ${campaignId} delivered message ${messageId} but failed to bill it, so this send is unbilled: ${error instanceof Error ? error.message : String(error)}`);
        });
        await this.linkMessageToProviderThread({
            messageId,
            providerMessageId: result.messageId
        });
    }
    async linkMessageToProviderThread({ messageId, providerMessageId }) {
        const associationRepository = this.workspaceOrmManager.getRepository(_messagechannelmessageassociationworkspaceentity.MessageChannelMessageAssociationWorkspaceEntity, {
            shouldBypassPermissionChecks: true
        });
        await associationRepository.update({
            messageId
        }, {
            messageExternalId: providerMessageId,
            messageThreadExternalId: providerMessageId
        });
    }
    async sendOrRecordFailure({ messageId, claimToken, campaignId, workspaceId, emailingDomainId, email }) {
        try {
            return await this.emailingDomainSenderService.sendEmail(workspaceId, emailingDomainId, email);
        } catch (error) {
            await this.recordSendFailure({
                workspaceId,
                messageId,
                claimToken,
                campaignId,
                error
            });
            return null;
        }
    }
    async recordSendFailure({ workspaceId, messageId, claimToken, campaignId, error }) {
        const { state, skipReason, failureReason, shouldRetry } = (0, _resolvecampaignsendfailureutil.resolveCampaignSendFailure)(error);
        await this.settleClaimedDelivery({
            workspaceId,
            messageId,
            claimToken,
            update: shouldRetry ? {
                state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.QUEUED,
                skipReason,
                failureReason
            } : {
                state,
                skipReason,
                failureReason
            }
        });
        if (state === _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED) {
            this.logger.warn(`Campaign ${campaignId} send failed for message ${messageId}: ${error instanceof Error ? error.message : String(error)}`);
        }
        if (shouldRetry) {
            throw error;
        }
    }
    async claimDeliveryForSending({ workspaceId, messageId }) {
        const claimToken = (0, _uuid.v4)();
        const { affected } = await this.campaignDeliveryRepository.update(workspaceId, {
            id: messageId,
            state: (0, _typeorm.In)([
                _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.QUEUED,
                _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED
            ])
        }, {
            state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SENDING,
            claimToken,
            claimExpiresAt: new Date(Date.now() + _campaigndeliveryclaimttlmsconstant.CAMPAIGN_DELIVERY_CLAIM_TTL_MS)
        });
        return affected === 1 ? claimToken : null;
    }
    async settleClaimedDelivery({ workspaceId, messageId, claimToken, update }) {
        const { affected } = await this.campaignDeliveryRepository.update(workspaceId, {
            id: messageId,
            claimToken
        }, {
            ...update,
            claimToken: null,
            claimExpiresAt: null
        });
        return affected ?? 0;
    }
    constructor(campaignDeliveryRepository, workspaceOrmManager, emailingDomainSenderService, emailBillingService, campaignVariableService, messageCampaignLifecycleService, usageLimitSpeedService, messageQueueService){
        this.campaignDeliveryRepository = campaignDeliveryRepository;
        this.workspaceOrmManager = workspaceOrmManager;
        this.emailingDomainSenderService = emailingDomainSenderService;
        this.emailBillingService = emailBillingService;
        this.campaignVariableService = campaignVariableService;
        this.messageCampaignLifecycleService = messageCampaignLifecycleService;
        this.usageLimitSpeedService = usageLimitSpeedService;
        this.messageQueueService = messageQueueService;
        this.logger = new _common.Logger(MessageCampaignDeliveryService.name);
    }
};
MessageCampaignDeliveryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_campaigndeliveryentity.CampaignDeliveryEntity)),
    _ts_param(7, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.campaignQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _emailingdomainsenderservice.EmailingDomainSenderService === "undefined" ? Object : _emailingdomainsenderservice.EmailingDomainSenderService,
        typeof _emailbillingservice.EmailBillingService === "undefined" ? Object : _emailbillingservice.EmailBillingService,
        typeof _campaignvariableservice.CampaignVariableService === "undefined" ? Object : _campaignvariableservice.CampaignVariableService,
        typeof _messagecampaignlifecycleservice.MessageCampaignLifecycleService === "undefined" ? Object : _messagecampaignlifecycleservice.MessageCampaignLifecycleService,
        typeof _usagelimitspeedservice.UsageLimitSpeedService === "undefined" ? Object : _usagelimitspeedservice.UsageLimitSpeedService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], MessageCampaignDeliveryService);

//# sourceMappingURL=message-campaign-delivery.service.js.map