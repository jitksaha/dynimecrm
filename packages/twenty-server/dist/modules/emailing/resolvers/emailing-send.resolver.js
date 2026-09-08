"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingSendResolver", {
    enumerable: true,
    get: function() {
        return EmailingSendResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _metadataresolverdecorator = require("../../../engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _campaignaudiencepreviewdto = require("../../../engine/core-modules/emailing-domain/dtos/campaign-audience-preview.dto");
const _cancelmessagecampaigninput = require("../../../engine/core-modules/emailing-domain/dtos/cancel-message-campaign.input");
const _cancelmessagecampaignoutputdto = require("../../../engine/core-modules/emailing-domain/dtos/cancel-message-campaign-output.dto");
const _emailgroupaccessgraphqlapiexceptionfilter = require("../../../engine/core-modules/emailing-domain/filters/email-group-access-graphql-api-exception.filter");
const _emailingdomaingraphqlapiexceptionfilter = require("../../../engine/core-modules/emailing-domain/filters/emailing-domain-graphql-api-exception.filter");
const _previewmessagecampaignaudienceinput = require("../../../engine/core-modules/emailing-domain/dtos/preview-message-campaign-audience.input");
const _sendemailviadomaininput = require("../../../engine/core-modules/emailing-domain/dtos/send-email-via-domain.input");
const _sendemailviadomainoutputdto = require("../../../engine/core-modules/emailing-domain/dtos/send-email-via-domain-output.dto");
const _sendmessagecampaigninput = require("../../../engine/core-modules/emailing-domain/dtos/send-message-campaign.input");
const _sendmessagecampaigntestinput = require("../../../engine/core-modules/emailing-domain/dtos/send-message-campaign-test.input");
const _sendmessagecampaignoutputdto = require("../../../engine/core-modules/emailing-domain/dtos/send-message-campaign-output.dto");
const _emailgroupaccessservice = require("../../../engine/core-modules/emailing-domain/services/email-group-access.service");
const _resolvervalidationpipe = require("../../../engine/core-modules/graphql/pipes/resolver-validation.pipe");
const _workspaceentity = require("../../../engine/core-modules/workspace/workspace.entity");
const _authuserworkspaceiddecorator = require("../../../engine/decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../engine/decorators/auth/auth-workspace.decorator");
const _featureflagguard = require("../../../engine/guards/feature-flag.guard");
const _settingspermissionguard = require("../../../engine/guards/settings-permission.guard");
const _workspaceauthguard = require("../../../engine/guards/workspace-auth.guard");
const _throttlergraphqlapiexceptionfilter = require("../../../engine/core-modules/throttler/filters/throttler-graphql-api-exception.filter");
const _emailbillingservice = require("../services/email-billing.service");
const _emailingdomainsenderservice = require("../services/emailing-domain-sender.service");
const _messagecampaignaudienceservice = require("../services/message-campaign-audience.service");
const _messagecampaignlifecycleservice = require("../services/message-campaign-lifecycle.service");
const _messagecampaignservice = require("../services/message-campaign.service");
const _countdeliveredrecipientsutil = require("../../../engine/core-modules/emailing-domain/utils/count-delivered-recipients.util");
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
let EmailingSendResolver = class EmailingSendResolver {
    async sendEmailViaEmailingDomain(input, currentWorkspace, userWorkspaceId) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        await this.emailBillingService.validateEmailCreditsOrThrow(currentWorkspace.id);
        const { emailingDomainId, ...content } = input;
        const result = await this.emailingDomainSenderService.sendEmail(currentWorkspace.id, emailingDomainId, {
            ...content,
            sendKind: 'TRANSACTIONAL'
        });
        await this.billAcceptedSend({
            workspaceId: currentWorkspace.id,
            userWorkspaceId,
            result
        });
        return {
            messageId: result.messageId
        };
    }
    async sendMessageCampaign(input, currentWorkspace, userWorkspaceId) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        await this.emailBillingService.validateEmailCreditsOrThrow(currentWorkspace.id);
        return this.messageCampaignService.send({
            workspaceId: currentWorkspace.id,
            userWorkspaceId,
            campaignId: input.campaignId
        });
    }
    async cancelMessageCampaign(input, currentWorkspace, userWorkspaceId) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        return this.messageCampaignLifecycleService.cancelCampaignOrThrow({
            workspaceId: currentWorkspace.id,
            userWorkspaceId,
            campaignId: input.campaignId
        });
    }
    async sendMessageCampaignTest(input, currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        await this.emailBillingService.validateEmailCreditsOrThrow(currentWorkspace.id);
        const result = await this.messageCampaignService.sendTest({
            workspaceId: currentWorkspace.id,
            toAddress: input.toAddress,
            unsubscribeTopicId: input.unsubscribeTopicId,
            subject: input.subject,
            html: input.body,
            fromAddress: input.fromAddress
        });
        await this.billAcceptedSend({
            workspaceId: currentWorkspace.id,
            result
        });
        return {
            messageId: result.messageId
        };
    }
    async previewMessageCampaignAudience(input, currentWorkspace, userWorkspaceId) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        return this.messageCampaignAudienceService.previewAudience({
            workspaceId: currentWorkspace.id,
            userWorkspaceId,
            listId: input.listId,
            unsubscribeTopicId: input.unsubscribeTopicId
        });
    }
    // The provider has already accepted the mail, so surfacing a billing failure
    // would invite a retry that sends it a second time.
    async billAcceptedSend({ workspaceId, userWorkspaceId, result }) {
        await this.emailBillingService.billSentEmails({
            workspaceId,
            userWorkspaceId,
            sentEmailCount: (0, _countdeliveredrecipientsutil.countDeliveredRecipients)(result.deliveredRecipients)
        }).catch((error)=>{
            this.logger.error(`Workspace ${workspaceId} sent email ${result.messageId} but failed to bill it, so this send is unbilled: ${error instanceof Error ? error.message : String(error)}`);
        });
    }
    constructor(emailingDomainSenderService, messageCampaignService, messageCampaignAudienceService, messageCampaignLifecycleService, emailGroupAccessService, emailBillingService){
        this.emailingDomainSenderService = emailingDomainSenderService;
        this.messageCampaignService = messageCampaignService;
        this.messageCampaignAudienceService = messageCampaignAudienceService;
        this.messageCampaignLifecycleService = messageCampaignLifecycleService;
        this.emailGroupAccessService = emailGroupAccessService;
        this.emailBillingService = emailBillingService;
        this.logger = new _common.Logger(EmailingSendResolver.name);
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_sendemailviadomainoutputdto.SendEmailViaDomainOutputDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)({
        allowUndefined: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _sendemailviadomaininput.SendEmailViaDomainInput === "undefined" ? Object : _sendemailviadomaininput.SendEmailViaDomainInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], EmailingSendResolver.prototype, "sendEmailViaEmailingDomain", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_sendmessagecampaignoutputdto.SendMessageCampaignOutputDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _sendmessagecampaigninput.SendMessageCampaignInput === "undefined" ? Object : _sendmessagecampaigninput.SendMessageCampaignInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], EmailingSendResolver.prototype, "sendMessageCampaign", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_cancelmessagecampaignoutputdto.CancelMessageCampaignOutputDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cancelmessagecampaigninput.CancelMessageCampaignInput === "undefined" ? Object : _cancelmessagecampaigninput.CancelMessageCampaignInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], EmailingSendResolver.prototype, "cancelMessageCampaign", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_sendemailviadomainoutputdto.SendEmailViaDomainOutputDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _sendmessagecampaigntestinput.SendMessageCampaignTestInput === "undefined" ? Object : _sendmessagecampaigntestinput.SendMessageCampaignTestInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], EmailingSendResolver.prototype, "sendMessageCampaignTest", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_campaignaudiencepreviewdto.CampaignAudiencePreviewDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _previewmessagecampaignaudienceinput.PreviewMessageCampaignAudienceInput === "undefined" ? Object : _previewmessagecampaignaudienceinput.PreviewMessageCampaignAudienceInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], EmailingSendResolver.prototype, "previewMessageCampaignAudience", null);
EmailingSendResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _featureflagguard.FeatureFlagGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.WORKSPACE)),
    (0, _common.UseFilters)(_emailgroupaccessgraphqlapiexceptionfilter.EmailGroupAccessGraphqlApiExceptionFilter, _emailingdomaingraphqlapiexceptionfilter.EmailingDomainGraphqlApiExceptionFilter, _throttlergraphqlapiexceptionfilter.ThrottlerGraphqlApiExceptionFilter),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _emailingdomainsenderservice.EmailingDomainSenderService === "undefined" ? Object : _emailingdomainsenderservice.EmailingDomainSenderService,
        typeof _messagecampaignservice.MessageCampaignService === "undefined" ? Object : _messagecampaignservice.MessageCampaignService,
        typeof _messagecampaignaudienceservice.MessageCampaignAudienceService === "undefined" ? Object : _messagecampaignaudienceservice.MessageCampaignAudienceService,
        typeof _messagecampaignlifecycleservice.MessageCampaignLifecycleService === "undefined" ? Object : _messagecampaignlifecycleservice.MessageCampaignLifecycleService,
        typeof _emailgroupaccessservice.EmailGroupAccessService === "undefined" ? Object : _emailgroupaccessservice.EmailGroupAccessService,
        typeof _emailbillingservice.EmailBillingService === "undefined" ? Object : _emailbillingservice.EmailBillingService
    ])
], EmailingSendResolver);

//# sourceMappingURL=emailing-send.resolver.js.map