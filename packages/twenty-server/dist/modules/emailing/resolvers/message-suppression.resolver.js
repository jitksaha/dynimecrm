"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageSuppressionResolver", {
    enumerable: true,
    get: function() {
        return MessageSuppressionResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _metadataresolverdecorator = require("../../../engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _scalars = require("../../../engine/api/graphql/workspace-schema-builder/graphql-types/scalars");
const _createmessagesuppressioninput = require("../../../engine/core-modules/emailing-domain/dtos/create-message-suppression.input");
const _findmessagesuppressionsinput = require("../../../engine/core-modules/emailing-domain/dtos/find-message-suppressions.input");
const _messagesuppressiondto = require("../../../engine/core-modules/emailing-domain/dtos/message-suppression.dto");
const _emailgroupaccessgraphqlapiexceptionfilter = require("../../../engine/core-modules/emailing-domain/filters/email-group-access-graphql-api-exception.filter");
const _emailingdomaingraphqlapiexceptionfilter = require("../../../engine/core-modules/emailing-domain/filters/emailing-domain-graphql-api-exception.filter");
const _emailgroupaccessservice = require("../../../engine/core-modules/emailing-domain/services/email-group-access.service");
const _resolvervalidationpipe = require("../../../engine/core-modules/graphql/pipes/resolver-validation.pipe");
const _workspaceentity = require("../../../engine/core-modules/workspace/workspace.entity");
const _authworkspacedecorator = require("../../../engine/decorators/auth/auth-workspace.decorator");
const _featureflagguard = require("../../../engine/guards/feature-flag.guard");
const _settingspermissionguard = require("../../../engine/guards/settings-permission.guard");
const _workspaceauthguard = require("../../../engine/guards/workspace-auth.guard");
const _messagesuppressionservice = require("../services/message-suppression.service");
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
let MessageSuppressionResolver = class MessageSuppressionResolver {
    async messageSuppressions(input, currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        return this.messageSuppressionService.findSuppressions({
            workspaceId: currentWorkspace.id,
            reason: input.reason,
            searchTerm: input.searchTerm,
            unsubscribeTopicId: input.unsubscribeTopicId,
            limit: input.limit,
            offset: input.offset
        });
    }
    async createMessageSuppression(input, currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        return this.messageSuppressionService.suppressManually({
            workspaceId: currentWorkspace.id,
            emailAddress: input.emailAddress,
            unsubscribeTopicId: input.unsubscribeTopicId
        });
    }
    async deleteMessageSuppression(suppressionId, currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        await this.messageSuppressionService.removeSuppression({
            workspaceId: currentWorkspace.id,
            suppressionId
        });
        return true;
    }
    constructor(messageSuppressionService, emailGroupAccessService){
        this.messageSuppressionService = messageSuppressionService;
        this.emailGroupAccessService = emailGroupAccessService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>_messagesuppressiondto.MessageSuppressionListDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _findmessagesuppressionsinput.FindMessageSuppressionsInput === "undefined" ? Object : _findmessagesuppressionsinput.FindMessageSuppressionsInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], MessageSuppressionResolver.prototype, "messageSuppressions", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_messagesuppressiondto.MessageSuppressionDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createmessagesuppressioninput.CreateMessageSuppressionInput === "undefined" ? Object : _createmessagesuppressioninput.CreateMessageSuppressionInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], MessageSuppressionResolver.prototype, "createMessageSuppression", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('id', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], MessageSuppressionResolver.prototype, "deleteMessageSuppression", null);
MessageSuppressionResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _featureflagguard.FeatureFlagGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.WORKSPACE)),
    (0, _common.UseFilters)(_emailgroupaccessgraphqlapiexceptionfilter.EmailGroupAccessGraphqlApiExceptionFilter, _emailingdomaingraphqlapiexceptionfilter.EmailingDomainGraphqlApiExceptionFilter),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_messagesuppressiondto.MessageSuppressionListDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagesuppressionservice.MessageSuppressionService === "undefined" ? Object : _messagesuppressionservice.MessageSuppressionService,
        typeof _emailgroupaccessservice.EmailGroupAccessService === "undefined" ? Object : _emailgroupaccessservice.EmailGroupAccessService
    ])
], MessageSuppressionResolver);

//# sourceMappingURL=message-suppression.resolver.js.map