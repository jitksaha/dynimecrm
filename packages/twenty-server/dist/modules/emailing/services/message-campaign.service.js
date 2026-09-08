"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageCampaignService", {
    enumerable: true,
    get: function() {
        return MessageCampaignService;
    }
});
const _campaignsendretrylimitconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-send-retry-limit.constant");
const _campaignsendretrybackoffconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign-send-retry-backoff.constant");
const _throttlerservice = require("../../../engine/core-modules/throttler/throttler.service");
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _campaignconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign.constant");
const _emailingdomainstatustype = require("../../../engine/core-modules/emailing-domain/drivers/types/emailing-domain-status.type");
const _unsubscribehostnamestatustype = require("../../../engine/core-modules/emailing-domain/drivers/types/unsubscribe-hostname-status.type");
const _emailingdomainexception = require("../../../engine/core-modules/emailing-domain/exceptions/emailing-domain.exception");
const _emailingdomainentity = require("../../../engine/core-modules/emailing-domain/emailing-domain.entity");
const _messagequeuedecorator = require("../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../engine/core-modules/message-queue/services/message-queue.service");
const _messagechannelmetadataservice = require("../../../engine/metadata-modules/message-channel/message-channel-metadata.service");
const _userroleservice = require("../../../engine/metadata-modules/user-role/user-role.service");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _injectworkspacescopedrepositorydecorator = require("../../../engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _campaignvariableservice = require("./campaign-variable.service");
const _emailbillingservice = require("./email-billing.service");
const _emailingdomainsenderservice = require("./emailing-domain-sender.service");
const _messagecampaignaudienceservice = require("./message-campaign-audience.service");
const _messagecampaignlifecycleservice = require("./message-campaign-lifecycle.service");
const _messagecampaignworkspaceentity = require("../standard-objects/message-campaign.workspace-entity");
const _collectcampaignvariablenamesfromtemplatesutil = require("../utils/collect-campaign-variable-names-from-templates.util");
const _rendercampaignemailutil = require("../utils/render-campaign-email.util");
const _sendabledraftcampaignzodschema = require("../zod-schemas/sendable-draft-campaign.zod-schema");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getdomainfromemail = require("../../../utils/get-domain-from-email");
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
const TEST_SEND_THROTTLE = {
    maxRequests: 3,
    windowMs: 24 * 60 * 60 * 1000
};
let MessageCampaignService = class MessageCampaignService {
    async send({ workspaceId, userWorkspaceId, campaignId }) {
        const roleId = await this.userRoleService.getRoleIdForUserWorkspace({
            workspaceId,
            userWorkspaceId
        });
        const { fromAddress, listId, unsubscribeTopicId } = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const { fromAddress, listId, unsubscribeTopicId } = await this.findSendableDraftCampaignOrThrow({
                workspaceId,
                campaignId,
                roleId
            });
            return {
                fromAddress: fromAddress.primaryEmail,
                listId,
                unsubscribeTopicId
            };
        });
        const emailingDomain = await this.findSendReadyEmailingDomainOrThrow({
            workspaceId,
            fromAddress
        });
        const { sendableRecipients, audience } = await this.messageCampaignAudienceService.resolveNormalizedAudience({
            workspaceId,
            listId,
            roleId,
            unsubscribeTopicId: unsubscribeTopicId ?? undefined
        });
        const { hasCredits } = await this.emailBillingService.resolveEmailCreditContext(workspaceId);
        if (sendableRecipients.length > 0 && !hasCredits) {
            throw new _emailingdomainexception.EmailingDomainException(`Campaign ${campaignId} cannot be sent to ${sendableRecipients.length} recipient(s) because the workspace has no email credits left`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_INSUFFICIENT_CREDITS);
        }
        const messageChannel = await this.messageChannelMetadataService.getOrCreateEmailGroupChannel({
            fromAddress,
            userWorkspaceId,
            workspaceId
        });
        const claimed = await this.messageCampaignLifecycleService.transitionCampaignStatus({
            workspaceId,
            campaignId,
            roleId,
            from: _types.MessageCampaignStatus.DRAFT,
            to: _types.MessageCampaignStatus.SENDING
        });
        if (!claimed) {
            throw new _emailingdomainexception.EmailingDomainException(`Campaign ${campaignId} is no longer a sendable draft`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_SENDABLE);
        }
        await this.messageQueueService.add(_campaignconstant.MATERIALIZE_CAMPAIGN_JOB, {
            workspaceId,
            campaignId,
            messageChannelId: messageChannel.id,
            emailingDomainId: emailingDomain.id,
            userWorkspaceId,
            recipients: sendableRecipients
        }, {
            retryLimit: _campaignsendretrylimitconstant.CAMPAIGN_SEND_RETRY_LIMIT,
            backoff: _campaignsendretrybackoffconstant.CAMPAIGN_SEND_RETRY_BACKOFF
        }).catch(async (error)=>{
            await this.messageCampaignLifecycleService.transitionCampaignStatus({
                workspaceId,
                campaignId,
                roleId,
                from: _types.MessageCampaignStatus.SENDING,
                to: _types.MessageCampaignStatus.DRAFT
            });
            throw error;
        });
        return {
            campaignId,
            queuedCount: sendableRecipients.length,
            audience
        };
    }
    async sendTest({ workspaceId, toAddress, subject, html, fromAddress, unsubscribeTopicId }) {
        const emailingDomain = await this.findSendReadyEmailingDomainOrThrow({
            workspaceId,
            fromAddress
        });
        const variables = await this.campaignVariableService.buildVariablesForPerson(workspaceId, null);
        const rendered = await (0, _rendercampaignemailutil.renderCampaignEmail)({
            subjectTemplate: subject,
            bodyTemplate: html,
            variables
        });
        await this.throttlerService.tokenBucketThrottleOrThrow(`message-campaign-test-send:throttler:${workspaceId}`, 1, TEST_SEND_THROTTLE.maxRequests, TEST_SEND_THROTTLE.windowMs);
        return this.emailingDomainSenderService.sendEmail(workspaceId, emailingDomain.id, {
            from: fromAddress,
            to: [
                toAddress
            ],
            subject: rendered.subject,
            text: rendered.plainText,
            html: rendered.html,
            sendKind: 'MARKETING',
            unsubscribeTopicId
        });
    }
    async findSendReadyEmailingDomainOrThrow({ workspaceId, fromAddress }) {
        const emailingDomain = await this.emailingDomainRepository.findOne(workspaceId, {
            where: {
                domain: (0, _getdomainfromemail.getDomainFromEmail)(fromAddress)?.toLowerCase(),
                status: _emailingdomainstatustype.EmailingDomainStatus.VERIFIED
            }
        });
        if (!(0, _utils.isDefined)(emailingDomain)) {
            throw new _emailingdomainexception.EmailingDomainException(`No verified emailing domain matches the from address ${fromAddress}`, _emailingdomainexception.EmailingDomainExceptionCode.EMAILING_DOMAIN_NOT_VERIFIED);
        }
        if (emailingDomain.unsubscribeHostnameStatus !== _unsubscribehostnamestatustype.UnsubscribeHostnameStatus.ACTIVE || !(0, _guards.isNonEmptyString)(emailingDomain.unsubscribeHostname)) {
            throw new _emailingdomainexception.EmailingDomainException(`Cannot send email for ${emailingDomain.domain}: unsubscribe domain is not active (status: ${emailingDomain.unsubscribeHostnameStatus})`, _emailingdomainexception.EmailingDomainExceptionCode.EMAILING_DOMAIN_UNSUBSCRIBE_NOT_READY);
        }
        return emailingDomain;
    }
    async findSendableDraftCampaignOrThrow({ workspaceId, campaignId, roleId }) {
        const campaignRepository = this.workspaceOrmManager.getRepository(_messagecampaignworkspaceentity.MessageCampaignWorkspaceEntity, {
            unionOf: [
                roleId
            ]
        });
        const campaign = await campaignRepository.findOne({
            where: {
                id: campaignId
            }
        });
        if (!(0, _utils.isDefined)(campaign)) {
            throw new _emailingdomainexception.EmailingDomainException(`Campaign ${campaignId} not found`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_FOUND);
        }
        const sendableCampaign = _sendabledraftcampaignzodschema.sendableDraftCampaignSchema.safeParse(campaign);
        if (!sendableCampaign.success) {
            throw new _emailingdomainexception.EmailingDomainException(`Campaign ${campaignId} is not sendable: ${sendableCampaign.error.issues.map((issue)=>`${issue.path.join('.')} ${issue.message}`).join(', ')}`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_SENDABLE);
        }
        await this.campaignVariableService.assertKnownVariables(workspaceId, (0, _collectcampaignvariablenamesfromtemplatesutil.collectCampaignVariableNamesFromTemplates)({
            subject: sendableCampaign.data.subject,
            bodyTemplate: sendableCampaign.data.bodyTemplate
        }));
        return sendableCampaign.data;
    }
    constructor(emailingDomainRepository, emailingDomainSenderService, workspaceOrmManager, messageQueueService, messageChannelMetadataService, userRoleService, campaignVariableService, messageCampaignAudienceService, messageCampaignLifecycleService, throttlerService, emailBillingService){
        this.emailingDomainRepository = emailingDomainRepository;
        this.emailingDomainSenderService = emailingDomainSenderService;
        this.workspaceOrmManager = workspaceOrmManager;
        this.messageQueueService = messageQueueService;
        this.messageChannelMetadataService = messageChannelMetadataService;
        this.userRoleService = userRoleService;
        this.campaignVariableService = campaignVariableService;
        this.messageCampaignAudienceService = messageCampaignAudienceService;
        this.messageCampaignLifecycleService = messageCampaignLifecycleService;
        this.throttlerService = throttlerService;
        this.emailBillingService = emailBillingService;
    }
};
MessageCampaignService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_emailingdomainentity.EmailingDomainEntity)),
    _ts_param(3, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.campaignQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _emailingdomainsenderservice.EmailingDomainSenderService === "undefined" ? Object : _emailingdomainsenderservice.EmailingDomainSenderService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _messagechannelmetadataservice.MessageChannelMetadataService === "undefined" ? Object : _messagechannelmetadataservice.MessageChannelMetadataService,
        typeof _userroleservice.UserRoleService === "undefined" ? Object : _userroleservice.UserRoleService,
        typeof _campaignvariableservice.CampaignVariableService === "undefined" ? Object : _campaignvariableservice.CampaignVariableService,
        typeof _messagecampaignaudienceservice.MessageCampaignAudienceService === "undefined" ? Object : _messagecampaignaudienceservice.MessageCampaignAudienceService,
        typeof _messagecampaignlifecycleservice.MessageCampaignLifecycleService === "undefined" ? Object : _messagecampaignlifecycleservice.MessageCampaignLifecycleService,
        typeof _throttlerservice.ThrottlerService === "undefined" ? Object : _throttlerservice.ThrottlerService,
        typeof _emailbillingservice.EmailBillingService === "undefined" ? Object : _emailbillingservice.EmailBillingService
    ])
], MessageCampaignService);

//# sourceMappingURL=message-campaign.service.js.map