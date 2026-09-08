"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataTranslationResolver", {
    enumerable: true,
    get: function() {
        return MetadataTranslationResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _workspaceentity = require("../../core-modules/workspace/workspace.entity");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _metadatatranslationdto = require("./dtos/metadata-translation.dto");
const _metadatatranslationsinput = require("./dtos/metadata-translations.input");
const _metadatatranslationservice = require("./services/metadata-translation.service");
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
let MetadataTranslationResolver = class MetadataTranslationResolver {
    async metadataTranslations(input, { id: workspaceId }) {
        return this.metadataTranslationService.findMetadataTranslations({
            input,
            workspaceId
        });
    }
    constructor(metadataTranslationService){
        this.metadataTranslationService = metadataTranslationService;
    }
};
_ts_decorate([
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _graphql.Query)(()=>[
            _metadatatranslationdto.MetadataTranslationDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('input')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _metadatatranslationsinput.MetadataTranslationsInput === "undefined" ? Object : _metadatatranslationsinput.MetadataTranslationsInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], MetadataTranslationResolver.prototype, "metadataTranslations", null);
MetadataTranslationResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_metadatatranslationdto.MetadataTranslationDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _metadatatranslationservice.MetadataTranslationService === "undefined" ? Object : _metadatatranslationservice.MetadataTranslationService
    ])
], MetadataTranslationResolver);

//# sourceMappingURL=metadata-translation.resolver.js.map