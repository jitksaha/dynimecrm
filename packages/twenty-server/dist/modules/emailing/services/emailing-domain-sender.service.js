"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingDomainSenderService", {
    enumerable: true,
    get: function() {
        return EmailingDomainSenderService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _typeorm1 = require("typeorm");
const _emailingdomaindriverexception = require("../../../engine/core-modules/emailing-domain/drivers/exceptions/emailing-domain-driver.exception");
const _emailingdomaindriverfactory = require("../../../engine/core-modules/emailing-domain/drivers/emailing-domain-driver.factory");
const _emailingdomainstatustype = require("../../../engine/core-modules/emailing-domain/drivers/types/emailing-domain-status.type");
const _emailingdomaintenantstatustype = require("../../../engine/core-modules/emailing-domain/drivers/types/emailing-domain-tenant-status.type");
const _emailingdomainentity = require("../../../engine/core-modules/emailing-domain/emailing-domain.entity");
const _formatmessagefromheaderutil = require("../../messaging/message-outbound-manager/utils/format-message-from-header.util");
const _messagesuppressionservice = require("./message-suppression.service");
const _messagechannelentity = require("../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _issuppressionblockingsendutil = require("../../../engine/core-modules/emailing-domain/utils/is-suppression-blocking-send.util");
const _getdomainfromemail = require("../../../utils/get-domain-from-email");
const _injectworkspacescopedrepositorydecorator = require("../../../engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
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
let EmailingDomainSenderService = class EmailingDomainSenderService {
    async sendEmail(workspaceId, emailingDomainId, emailContent) {
        const emailingDomain = await this.findEmailingDomainByIdOrThrow(workspaceId, emailingDomainId);
        this.assertDomainCanSend(emailingDomain, emailContent.from);
        const recipients = await this.selectDeliverableRecipients(workspaceId, emailingDomain, emailContent);
        const emailGroupChannel = await this.findEmailGroupChannel(workspaceId, emailContent.from);
        const replyTo = this.resolveReplyTo(emailContent, emailGroupChannel);
        const emailToSend = {
            ...emailContent,
            from: (0, _formatmessagefromheaderutil.formatMessageFromHeader)({
                fromEmail: emailContent.from,
                fromName: emailGroupChannel?.displayName
            }),
            workspaceId,
            domain: emailingDomain.domain,
            emailingDomain,
            replyTo,
            to: recipients.to,
            cc: recipients.cc,
            bcc: recipients.bcc
        };
        return this.emailingDomainDriverFactory.getCurrentDriver().sendEmail(emailToSend);
    }
    async findEmailGroupChannel(workspaceId, fromAddress) {
        return this.messageChannelRepository.findOne({
            where: {
                workspaceId,
                type: _types.MessageChannelType.EMAIL_GROUP,
                connectedAccount: {
                    handle: fromAddress
                }
            },
            relations: {
                connectedAccount: true
            }
        });
    }
    resolveReplyTo(emailContent, emailGroupChannel) {
        if ((0, _utils.isDefined)(emailContent.replyTo) && emailContent.replyTo.length > 0) {
            return emailContent.replyTo;
        }
        const forwardingAddress = emailGroupChannel?.handle;
        return (0, _guards.isNonEmptyString)(forwardingAddress) ? [
            forwardingAddress
        ] : undefined;
    }
    async findEmailingDomainByIdOrThrow(workspaceId, emailingDomainId) {
        const emailingDomain = await this.emailingDomainRepository.findOne(workspaceId, {
            where: {
                id: emailingDomainId
            }
        });
        if (!(0, _utils.isDefined)(emailingDomain)) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException('Emailing domain not found', _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.NOT_FOUND);
        }
        return emailingDomain;
    }
    assertDomainCanSend(emailingDomain, fromAddress) {
        if (emailingDomain.status !== _emailingdomainstatustype.EmailingDomainStatus.VERIFIED) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException(`Emailing domain is not verified (status: ${emailingDomain.status})`, _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.CONFIGURATION_ERROR);
        }
        if (emailingDomain.tenantStatus !== _emailingdomaintenantstatustype.EmailingDomainTenantStatus.ACTIVE) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException(`Sending is suspended for emailing domain ${emailingDomain.domain} (tenantStatus: ${emailingDomain.tenantStatus})`, _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.SENDING_SUSPENDED);
        }
        const fromAddressDomain = (0, _getdomainfromemail.getDomainFromEmail)(fromAddress)?.toLowerCase();
        if (fromAddressDomain !== emailingDomain.domain.toLowerCase()) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException(`From address ${fromAddress} does not match verified domain ${emailingDomain.domain}`, _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.CONFIGURATION_ERROR);
        }
    }
    async selectDeliverableRecipients(workspaceId, emailingDomain, emailContent) {
        const allRecipients = [
            ...emailContent.to,
            ...emailContent.cc ?? [],
            ...emailContent.bcc ?? []
        ];
        const suppressions = await this.messageSuppressionService.findApplicableSuppressions({
            workspaceId,
            emailAddresses: allRecipients,
            unsubscribeTopicId: emailContent.unsubscribeTopicId
        });
        const blockedAddresses = new Set(suppressions.filter((suppression)=>(0, _issuppressionblockingsendutil.isSuppressionBlockingSend)({
                sendKind: emailContent.sendKind,
                suppression,
                unsubscribeTopicId: emailContent.unsubscribeTopicId
            })).map((suppression)=>suppression.emailAddress));
        const isDeliverable = (address)=>!blockedAddresses.has(address.trim().toLowerCase());
        const to = emailContent.to.filter(isDeliverable);
        if (to.length === 0) {
            throw new _emailingdomaindriverexception.EmailingDomainDriverException(`All primary recipients are suppressed for emailing domain ${emailingDomain.domain}`, _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.ALL_RECIPIENTS_SUPPRESSED);
        }
        return {
            to,
            cc: emailContent.cc?.filter(isDeliverable),
            bcc: emailContent.bcc?.filter(isDeliverable)
        };
    }
    constructor(emailingDomainRepository, emailingDomainDriverFactory, messageSuppressionService, messageChannelRepository){
        this.emailingDomainRepository = emailingDomainRepository;
        this.emailingDomainDriverFactory = emailingDomainDriverFactory;
        this.messageSuppressionService = messageSuppressionService;
        this.messageChannelRepository = messageChannelRepository;
    }
};
EmailingDomainSenderService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_emailingdomainentity.EmailingDomainEntity)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _emailingdomaindriverfactory.EmailingDomainDriverFactory === "undefined" ? Object : _emailingdomaindriverfactory.EmailingDomainDriverFactory,
        typeof _messagesuppressionservice.MessageSuppressionService === "undefined" ? Object : _messagesuppressionservice.MessageSuppressionService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], EmailingDomainSenderService);

//# sourceMappingURL=emailing-domain-sender.service.js.map