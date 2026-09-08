"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InboundEmailImportService", {
    enumerable: true,
    get: function() {
        return InboundEmailImportService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _twentyconfigservice = require("../../../../../../engine/core-modules/twenty-config/twenty-config.service");
const _connectedaccountentity = require("../../../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _messagechannelentity = require("../../../../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _workspaceormmanager = require("../../../../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _inboundemailmessagesourceresolverservice = require("../sources/inbound-email-message-source-resolver.service");
const _messagingsavemessagesandenqueuecontactcreationservice = require("../../../services/messaging-save-messages-and-enqueue-contact-creation.service");
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
let InboundEmailImportService = class InboundEmailImportService {
    async importInboundMessage(params) {
        const { messageReference, envelopeRecipients } = params;
        const inboundEmailDomain = this.twentyConfigService.get('INBOUND_EMAIL_DOMAIN');
        if (!(0, _guards.isNonEmptyString)(inboundEmailDomain)) {
            this.logger.warn(`Skipping inbound email import for ${messageReference.reference}: email group is not configured.`);
            return {
                kind: 'unconfigured'
            };
        }
        const messageSource = this.inboundEmailMessageSourceResolverService.resolve(messageReference.source);
        if (!messageSource.isConfigured()) {
            this.logger.warn(`Skipping inbound email import for ${messageReference.reference}: message source ${messageReference.source} is not configured.`);
            return {
                kind: 'unconfigured'
            };
        }
        const recipient = this.matchInboundRecipient(envelopeRecipients, inboundEmailDomain);
        if (!(0, _utils.isDefined)(recipient)) {
            this.logger.warn(`No recipient at ${inboundEmailDomain} in inbound notification for ${messageReference.reference}`);
            return {
                kind: 'unmatched',
                recipient: null
            };
        }
        const messageChannel = await this.messageChannelRepository.findOne({
            where: {
                handle: recipient,
                type: _types.MessageChannelType.EMAIL_GROUP
            }
        });
        if (!(0, _utils.isDefined)(messageChannel)) {
            this.logger.warn(`No email group channel matches recipient ${recipient} (reference ${messageReference.reference})`);
            return {
                kind: 'unmatched',
                recipient
            };
        }
        const message = await messageSource.fetchMessage(messageReference.reference);
        const { workspaceId } = messageChannel;
        const connectedAccount = await this.connectedAccountRepository.findOne({
            where: {
                id: messageChannel.connectedAccountId,
                workspaceId
            }
        });
        if (!(0, _utils.isDefined)(connectedAccount)) {
            throw new Error(`Email group channel ${messageChannel.id} has no connected account`);
        }
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messagingSaveMessagesAndEnqueueContactCreationService.saveMessagesAndEnqueueContactCreation([
                message
            ], messageChannel, connectedAccount, workspaceId);
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId), {
            lite: true
        });
        await messageSource.cleanup(messageReference.reference);
        return {
            kind: 'imported',
            workspaceId,
            messageChannelId: messageChannel.id
        };
    }
    matchInboundRecipient(envelopeRecipients, inboundEmailDomain) {
        const normalizedDomain = inboundEmailDomain.toLowerCase();
        return envelopeRecipients.map((address)=>address.toLowerCase()).find((address)=>address.endsWith(`@${normalizedDomain}`)) ?? null;
    }
    constructor(twentyConfigService, inboundEmailMessageSourceResolverService, workspaceOrmManager, messagingSaveMessagesAndEnqueueContactCreationService, messageChannelRepository, connectedAccountRepository){
        this.twentyConfigService = twentyConfigService;
        this.inboundEmailMessageSourceResolverService = inboundEmailMessageSourceResolverService;
        this.workspaceOrmManager = workspaceOrmManager;
        this.messagingSaveMessagesAndEnqueueContactCreationService = messagingSaveMessagesAndEnqueueContactCreationService;
        this.messageChannelRepository = messageChannelRepository;
        this.connectedAccountRepository = connectedAccountRepository;
        this.logger = new _common.Logger(InboundEmailImportService.name);
    }
};
InboundEmailImportService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(4, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_param(5, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _inboundemailmessagesourceresolverservice.InboundEmailMessageSourceResolverService === "undefined" ? Object : _inboundemailmessagesourceresolverservice.InboundEmailMessageSourceResolverService,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _messagingsavemessagesandenqueuecontactcreationservice.MessagingSaveMessagesAndEnqueueContactCreationService === "undefined" ? Object : _messagingsavemessagesandenqueuecontactcreationservice.MessagingSaveMessagesAndEnqueueContactCreationService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], InboundEmailImportService);

//# sourceMappingURL=inbound-email-import.service.js.map