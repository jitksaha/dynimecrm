"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PageLayoutController", {
    enumerable: true,
    get: function() {
        return PageLayoutController;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _workspaceentity = require("../../../core-modules/workspace/workspace.entity");
const _parsemetadatarestpaginationutil = require("../../../api/rest/metadata/utils/parse-metadata-rest-pagination.util");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _requestlocaledecorator = require("../../../decorators/locale/request-locale.decorator");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _settingspermissionguard = require("../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _flatentitymapsrestapiexceptionfilter = require("../../flat-entity/filters/flat-entity-maps-rest-api-exception.filter");
const _createpagelayoutinput = require("../dtos/inputs/create-page-layout.input");
const _updatepagelayoutinput = require("../dtos/inputs/update-page-layout.input");
const _pagelayoutrestapiexceptionfilter = require("../filters/page-layout-rest-api-exception.filter");
const _pagelayoutservice = require("../services/page-layout.service");
const _permissionsrestapiexceptionfilter = require("../../permissions/utils/permissions-rest-api-exception.filter");
const _applicationtranslationcatalogservice = require("../../application-translation-catalog/services/application-translation-catalog.service");
const _workspacemigrationrunnerrestapiexceptionfilter = require("../../../workspace-manager/workspace-migration/filters/workspace-migration-runner-rest-api-exception.filter");
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
let PageLayoutController = class PageLayoutController {
    async findMany(request, locale, workspace, objectMetadataId, pageLayoutType) {
        const page = await this.pageLayoutService.findManyPaginated({
            workspaceId: workspace.id,
            objectMetadataId,
            pageLayoutType,
            pagination: (0, _parsemetadatarestpaginationutil.parseMetadataRestPagination)(request)
        });
        return {
            data: await this.applicationTranslationCatalogService.resolveTranslatablePropertiesForEntities({
                metadataName: 'pageLayout',
                entities: page.items,
                locale,
                workspaceId: workspace.id
            }),
            pageInfo: page.pageInfo,
            totalCount: page.totalCount
        };
    }
    async findOne(id, locale, workspace) {
        const pageLayout = await this.pageLayoutService.findByIdOrThrow({
            id,
            workspaceId: workspace.id
        });
        const [resolvedPageLayout] = await this.applicationTranslationCatalogService.resolveTranslatablePropertiesForEntities({
            metadataName: 'pageLayout',
            entities: [
                pageLayout
            ],
            locale,
            workspaceId: workspace.id
        });
        return resolvedPageLayout;
    }
    async create(input, workspace) {
        return this.pageLayoutService.create({
            createPageLayoutInput: input,
            workspaceId: workspace.id
        });
    }
    async update(id, input, workspace) {
        const updatedPageLayout = await this.pageLayoutService.update({
            id,
            workspaceId: workspace.id,
            updateData: input
        });
        return updatedPageLayout;
    }
    async destroy(id, workspace) {
        return this.pageLayoutService.destroy({
            id,
            workspaceId: workspace.id
        });
    }
    constructor(pageLayoutService, applicationTranslationCatalogService){
        this.pageLayoutService = pageLayoutService;
        this.applicationTranslationCatalogService = applicationTranslationCatalogService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _requestlocaledecorator.RequestLocale)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(3, (0, _common.Query)('objectMetadataId')),
    _ts_param(4, (0, _common.Query)('pageLayoutType')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String,
        typeof _types.PageLayoutType === "undefined" ? Object : _types.PageLayoutType
    ]),
    _ts_metadata("design:returntype", Promise)
], PageLayoutController.prototype, "findMany", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _requestlocaledecorator.RequestLocale)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], PageLayoutController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.LAYOUTS)),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createpagelayoutinput.CreatePageLayoutInput === "undefined" ? Object : _createpagelayoutinput.CreatePageLayoutInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], PageLayoutController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.LAYOUTS)),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updatepagelayoutinput.UpdatePageLayoutInput === "undefined" ? Object : _updatepagelayoutinput.UpdatePageLayoutInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], PageLayoutController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.LAYOUTS)),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], PageLayoutController.prototype, "destroy", null);
PageLayoutController = _ts_decorate([
    (0, _common.Controller)(`${_types.ApiPath.Rest}/metadata/pageLayouts`),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _common.UseFilters)(_permissionsrestapiexceptionfilter.PermissionsRestApiExceptionFilter, _pagelayoutrestapiexceptionfilter.PageLayoutRestApiExceptionFilter, _flatentitymapsrestapiexceptionfilter.FlatEntityMapsRestApiExceptionFilter, _workspacemigrationrunnerrestapiexceptionfilter.WorkspaceMigrationRunnerRestApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _pagelayoutservice.PageLayoutService === "undefined" ? Object : _pagelayoutservice.PageLayoutService,
        typeof _applicationtranslationcatalogservice.ApplicationTranslationCatalogService === "undefined" ? Object : _applicationtranslationcatalogservice.ApplicationTranslationCatalogService
    ])
], PageLayoutController);

//# sourceMappingURL=page-layout.controller.js.map