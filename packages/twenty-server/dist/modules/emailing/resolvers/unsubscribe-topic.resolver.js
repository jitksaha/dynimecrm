"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UnsubscribeTopicResolver", {
    enumerable: true,
    get: function() {
        return UnsubscribeTopicResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _metadataresolverdecorator = require("../../../engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _createunsubscribetopicinput = require("../../../engine/core-modules/emailing-domain/dtos/create-unsubscribe-topic.input");
const _unsubscribetopicdto = require("../../../engine/core-modules/emailing-domain/dtos/unsubscribe-topic.dto");
const _updateunsubscribetopicinput = require("../../../engine/core-modules/emailing-domain/dtos/update-unsubscribe-topic.input");
const _emailgroupaccessgraphqlapiexceptionfilter = require("../../../engine/core-modules/emailing-domain/filters/email-group-access-graphql-api-exception.filter");
const _emailgroupaccessservice = require("../../../engine/core-modules/emailing-domain/services/email-group-access.service");
const _resolvervalidationpipe = require("../../../engine/core-modules/graphql/pipes/resolver-validation.pipe");
const _workspaceentity = require("../../../engine/core-modules/workspace/workspace.entity");
const _authworkspacedecorator = require("../../../engine/decorators/auth/auth-workspace.decorator");
const _featureflagguard = require("../../../engine/guards/feature-flag.guard");
const _settingspermissionguard = require("../../../engine/guards/settings-permission.guard");
const _workspaceauthguard = require("../../../engine/guards/workspace-auth.guard");
const _unsubscribetopicservice = require("../services/unsubscribe-topic.service");
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
let UnsubscribeTopicResolver = class UnsubscribeTopicResolver {
    async unsubscribeTopics(currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        return this.unsubscribeTopicService.getUnsubscribeTopics(currentWorkspace.id);
    }
    async createUnsubscribeTopic(input, currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        return this.unsubscribeTopicService.createUnsubscribeTopic(currentWorkspace.id, input);
    }
    async updateUnsubscribeTopic(input, currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        return this.unsubscribeTopicService.updateUnsubscribeTopic(currentWorkspace.id, input);
    }
    async deleteUnsubscribeTopic(id, currentWorkspace) {
        this.emailGroupAccessService.validateEmailGroupAccessOrThrow();
        await this.unsubscribeTopicService.deleteUnsubscribeTopic(currentWorkspace.id, id);
        return true;
    }
    constructor(unsubscribeTopicService, emailGroupAccessService){
        this.unsubscribeTopicService = unsubscribeTopicService;
        this.emailGroupAccessService = emailGroupAccessService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _unsubscribetopicdto.UnsubscribeTopicDTO
        ]),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], UnsubscribeTopicResolver.prototype, "unsubscribeTopics", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_unsubscribetopicdto.UnsubscribeTopicDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createunsubscribetopicinput.CreateUnsubscribeTopicInput === "undefined" ? Object : _createunsubscribetopicinput.CreateUnsubscribeTopicInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], UnsubscribeTopicResolver.prototype, "createUnsubscribeTopic", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_unsubscribetopicdto.UnsubscribeTopicDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updateunsubscribetopicinput.UpdateUnsubscribeTopicInput === "undefined" ? Object : _updateunsubscribetopicinput.UpdateUnsubscribeTopicInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], UnsubscribeTopicResolver.prototype, "updateUnsubscribeTopic", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED),
    _ts_param(0, (0, _graphql.Args)('id')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], UnsubscribeTopicResolver.prototype, "deleteUnsubscribeTopic", null);
UnsubscribeTopicResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _featureflagguard.FeatureFlagGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.WORKSPACE)),
    (0, _common.UseFilters)(_emailgroupaccessgraphqlapiexceptionfilter.EmailGroupAccessGraphqlApiExceptionFilter),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_unsubscribetopicdto.UnsubscribeTopicDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _unsubscribetopicservice.UnsubscribeTopicService === "undefined" ? Object : _unsubscribetopicservice.UnsubscribeTopicService,
        typeof _emailgroupaccessservice.EmailGroupAccessService === "undefined" ? Object : _emailgroupaccessservice.EmailGroupAccessService
    ])
], UnsubscribeTopicResolver);

//# sourceMappingURL=unsubscribe-topic.resolver.js.map