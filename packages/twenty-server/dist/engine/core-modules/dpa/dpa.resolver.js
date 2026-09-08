"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DpaResolver", {
    enumerable: true,
    get: function() {
        return DpaResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _coreresolverdecorator = require("../../api/graphql/graphql-config/decorators/core-resolver.decorator");
const _authgraphqlapiexceptionfilter = require("../auth/filters/auth-graphql-api-exception.filter");
const _dpadocumentdto = require("./dtos/dpa-document.dto");
const _generatesigneddpainput = require("./dtos/generate-signed-dpa.input");
const _generatesigneddparesult = require("./dtos/generate-signed-dpa.result");
const _dpaagreemententity = require("./entities/dpa-agreement.entity");
const _dpaservice = require("./services/dpa.service");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _userentity = require("../user/user.entity");
const _workspaceentity = require("../workspace/workspace.entity");
const _authuserdecorator = require("../../decorators/auth/auth-user.decorator");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _permissionsgraphqlapiexceptionfilter = require("../../metadata-modules/permissions/utils/permissions-graphql-api-exception.filter");
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
let DpaResolver = class DpaResolver {
    // Region/entity/law/SCC state are resolved server-side from the workspace
    // deployment; the customer cannot pick them.
    dpaPreview(workspace) {
        return this.dpaService.getPreviewForWorkspace(workspace);
    }
    async dpaAgreements(workspace) {
        return this.dpaService.listAgreements(workspace.id);
    }
    async generateSignedDpa(workspace, user, input) {
        return this.dpaService.generateSignedDpa({
            workspace,
            userId: user.id,
            userEmail: user.email,
            input
        });
    }
    // Null for click-through records, which have no signed PDF.
    async downloadUrl(agreement, workspace) {
        return this.dpaService.getDownloadUrl(agreement, workspace.id);
    }
    constructor(dpaService){
        this.dpaService = dpaService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>_dpadocumentdto.DpaDocumentDTO),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", typeof _dpadocumentdto.DpaDocumentDTO === "undefined" ? Object : _dpadocumentdto.DpaDocumentDTO)
], DpaResolver.prototype, "dpaPreview", null);
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _dpaagreemententity.DpaAgreementEntity
        ]),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], DpaResolver.prototype, "dpaAgreements", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_generatesigneddparesult.GenerateSignedDpaResult),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _authuserdecorator.AuthUser)()),
    _ts_param(2, (0, _graphql.Args)('input')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof _userentity.UserEntity === "undefined" ? Object : _userentity.UserEntity,
        typeof _generatesigneddpainput.GenerateSignedDpaInput === "undefined" ? Object : _generatesigneddpainput.GenerateSignedDpaInput
    ]),
    _ts_metadata("design:returntype", Promise)
], DpaResolver.prototype, "generateSignedDpa", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>String, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dpaagreemententity.DpaAgreementEntity === "undefined" ? Object : _dpaagreemententity.DpaAgreementEntity,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], DpaResolver.prototype, "downloadUrl", null);
DpaResolver = _ts_decorate([
    (0, _coreresolverdecorator.CoreResolver)(()=>_dpaagreemententity.DpaAgreementEntity),
    (0, _common.UseFilters)(_authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter, _permissionsgraphqlapiexceptionfilter.PermissionsGraphqlApiExceptionFilter),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.WORKSPACE)),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dpaservice.DpaService === "undefined" ? Object : _dpaservice.DpaService
    ])
], DpaResolver);

//# sourceMappingURL=dpa.resolver.js.map