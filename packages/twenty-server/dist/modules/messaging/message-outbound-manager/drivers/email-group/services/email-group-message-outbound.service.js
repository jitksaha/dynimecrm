"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailGroupMessageOutboundService", {
    enumerable: true,
    get: function() {
        return EmailGroupMessageOutboundService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _emailingdomainstatustype = require("../../../../../../engine/core-modules/emailing-domain/drivers/types/emailing-domain-status.type");
const _emailingdomainentity = require("../../../../../../engine/core-modules/emailing-domain/emailing-domain.entity");
const _emailbillingservice = require("../../../../../emailing/services/email-billing.service");
const _emailingdomainsenderservice = require("../../../../../emailing/services/emailing-domain-sender.service");
const _messagechannelexception = require("../../../../../../engine/metadata-modules/message-channel/message-channel.exception");
const _injectworkspacescopedrepositorydecorator = require("../../../../../../engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../../../../engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _getdomainfromemail = require("../../../../../../utils/get-domain-from-email");
const _countdeliveredrecipientsutil = require("../../../../../../engine/core-modules/emailing-domain/utils/count-delivered-recipients.util");
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
let EmailGroupMessageOutboundService = class EmailGroupMessageOutboundService {
    async sendMessage(sendMessageInput, connectedAccount) {
        const emailingDomain = await this.resolveEmailingDomain(connectedAccount);
        if (emailingDomain.status !== _emailingdomainstatustype.EmailingDomainStatus.VERIFIED) {
            throw new _messagechannelexception.MessageChannelException(`Cannot send from ${connectedAccount.handle}: domain ${emailingDomain.domain} is not verified for outbound (status: ${emailingDomain.status}).`, _messagechannelexception.MessageChannelExceptionCode.EMAIL_GROUP_NOT_CONFIGURED);
        }
        await this.emailBillingService.validateEmailCreditsOrThrow(connectedAccount.workspaceId);
        const result = await this.emailingDomainSenderService.sendEmail(connectedAccount.workspaceId, emailingDomain.id, {
            sendKind: 'TRANSACTIONAL',
            to: this.toRecipientArray(sendMessageInput.to),
            cc: this.toRecipientArray(sendMessageInput.cc),
            bcc: this.toRecipientArray(sendMessageInput.bcc),
            subject: sendMessageInput.subject,
            text: sendMessageInput.body,
            html: (0, _guards.isNonEmptyString)(sendMessageInput.html) ? sendMessageInput.html : undefined,
            from: connectedAccount.handle,
            replyTo: [
                connectedAccount.handle
            ],
            attachments: sendMessageInput.attachments
        });
        // The provider has already accepted the mail, so surfacing a billing
        // failure would invite a retry that sends it a second time.
        await this.emailBillingService.billSentEmails({
            workspaceId: connectedAccount.workspaceId,
            sentEmailCount: (0, _countdeliveredrecipientsutil.countDeliveredRecipients)(result.deliveredRecipients)
        }).catch((error)=>{
            this.logger.error(`Workspace ${connectedAccount.workspaceId} sent email ${result.messageId} but failed to bill it, so this send is unbilled: ${error instanceof Error ? error.message : String(error)}`);
        });
        return {
            headerMessageId: result.messageId,
            messageExternalId: result.messageId,
            deliveredRecipients: result.deliveredRecipients
        };
    }
    async createDraft() {
        throw new _messagechannelexception.MessageChannelException('Email handle channels do not support drafts.', _messagechannelexception.MessageChannelExceptionCode.INVALID_MESSAGE_CHANNEL_INPUT);
    }
    async sendDraft() {
        throw new _messagechannelexception.MessageChannelException('Email handle channels do not support drafts.', _messagechannelexception.MessageChannelExceptionCode.INVALID_MESSAGE_CHANNEL_INPUT);
    }
    async resolveEmailingDomain(connectedAccount) {
        const handleDomain = (0, _getdomainfromemail.getDomainFromEmail)(connectedAccount.handle);
        if (!(0, _guards.isNonEmptyString)(handleDomain)) {
            throw new _messagechannelexception.MessageChannelException(`Email group ${connectedAccount.handle} has no domain.`, _messagechannelexception.MessageChannelExceptionCode.EMAIL_GROUP_NOT_CONFIGURED);
        }
        const emailingDomain = await this.emailingDomainRepository.findOne(connectedAccount.workspaceId, {
            where: {
                domain: handleDomain
            }
        });
        if (!(0, _utils.isDefined)(emailingDomain)) {
            throw new _messagechannelexception.MessageChannelException(`No outbound domain configured for ${handleDomain}. Verify it under Outbound Domains to send from ${connectedAccount.handle}.`, _messagechannelexception.MessageChannelExceptionCode.EMAIL_GROUP_NOT_CONFIGURED);
        }
        return emailingDomain;
    }
    toRecipientArray(value) {
        if (!(0, _utils.isDefined)(value)) {
            return [];
        }
        return Array.isArray(value) ? value : [
            value
        ];
    }
    constructor(emailingDomainRepository, emailingDomainSenderService, emailBillingService){
        this.emailingDomainRepository = emailingDomainRepository;
        this.emailingDomainSenderService = emailingDomainSenderService;
        this.emailBillingService = emailBillingService;
        this.logger = new _common.Logger(EmailGroupMessageOutboundService.name);
    }
};
EmailGroupMessageOutboundService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_emailingdomainentity.EmailingDomainEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _emailingdomainsenderservice.EmailingDomainSenderService === "undefined" ? Object : _emailingdomainsenderservice.EmailingDomainSenderService,
        typeof _emailbillingservice.EmailBillingService === "undefined" ? Object : _emailbillingservice.EmailBillingService
    ])
], EmailGroupMessageOutboundService);

//# sourceMappingURL=email-group-message-outbound.service.js.map