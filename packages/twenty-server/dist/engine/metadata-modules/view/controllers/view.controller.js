"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewController", {
    enumerable: true,
    get: function() {
        return ViewController;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _i18n = require("twenty-shared/i18n");
const _utils = require("twenty-shared/utils");
const _parsemetadatarestpaginationutil = require("../../../api/rest/metadata/utils/parse-metadata-rest-pagination.util");
const _workspaceentity = require("../../../core-modules/workspace/workspace.entity");
const _authuserworkspaceiddecorator = require("../../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _requestlocaledecorator = require("../../../decorators/locale/request-locale.decorator");
const _custompermissionguard = require("../../../guards/custom-permission.guard");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _workspacemanyorallflatentitymapscacheservice = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _applicationtranslationcatalogservice = require("../../application-translation-catalog/services/application-translation-catalog.service");
const _buildviewnameobjectlabelsutil = require("../utils/build-view-name-object-labels.util");
const _resolveviewnameutil = require("../utils/resolve-view-name.util");
const _belongstotwentystandardapputil = require("../../utils/belongs-to-twenty-standard-app.util");
const _createviewinput = require("../dtos/inputs/create-view.input");
const _updateviewinput = require("../dtos/inputs/update-view.input");
const _viewexception = require("../exceptions/view.exception");
const _viewrestapiexceptionfilter = require("../filters/view-rest-api-exception.filter");
const _viewservice = require("../services/view.service");
const _flatentitymapsrestapiexceptionfilter = require("../../flat-entity/filters/flat-entity-maps-rest-api-exception.filter");
const _permissionsrestapiexceptionfilter = require("../../permissions/utils/permissions-rest-api-exception.filter");
const _workspacemigrationrunnerrestapiexceptionfilter = require("../../../workspace-manager/workspace-migration/filters/workspace-migration-runner-rest-api-exception.filter");
const _viewpermissionguard = require("../../view-permissions/guards/view-permission.guard");
const _createviewpermissionguard = require("../../view-permissions/guards/create-view-permission.guard");
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
let ViewController = class ViewController {
    async findMany(request, locale, workspace, userWorkspaceId, objectMetadataId) {
        const page = await this.viewService.findManyWithRelationsPaginated({
            workspaceId: workspace.id,
            objectMetadataId,
            userWorkspaceId,
            pagination: (0, _parsemetadatarestpaginationutil.parseMetadataRestPagination)(request)
        });
        return {
            pageInfo: page.pageInfo,
            totalCount: page.totalCount,
            data: await this.processViewsWithTemplates(page.items, workspace.id, locale)
        };
    }
    async findOne(id, locale, workspace) {
        const view = await this.viewService.findByIdWithRelations(id, workspace.id);
        if (!(0, _utils.isDefined)(view)) {
            throw new _viewexception.ViewException((0, _viewexception.generateViewExceptionMessage)(_viewexception.ViewExceptionMessageKey.VIEW_NOT_FOUND, id), _viewexception.ViewExceptionCode.VIEW_NOT_FOUND, {
                userFriendlyMessage: (0, _viewexception.generateViewUserFriendlyExceptionMessage)(_viewexception.ViewExceptionMessageKey.VIEW_NOT_FOUND)
            });
        }
        const processedViews = await this.processViewsWithTemplates([
            view
        ], workspace.id, locale);
        return processedViews[0];
    }
    async create(input, workspace, locale) {
        const view = await this.viewService.createOne({
            createViewInput: input,
            workspaceId: workspace.id
        });
        const processedViews = await this.processViewsWithTemplates([
            view
        ], workspace.id, locale);
        return processedViews[0];
    }
    async update(id, input, locale, workspace, userWorkspaceId) {
        const updatedView = await this.viewService.updateOne({
            updateViewInput: {
                ...input,
                id
            },
            workspaceId: workspace.id,
            userWorkspaceId
        });
        const processedViews = await this.processViewsWithTemplates([
            updatedView
        ], workspace.id, locale);
        return processedViews[0];
    }
    async delete(id, workspace) {
        const deletedView = await this.viewService.deleteOne({
            deleteViewInput: {
                id
            },
            workspaceId: workspace.id
        });
        return {
            success: (0, _utils.isDefined)(deletedView)
        };
    }
    async processViewsWithTemplates(views, workspaceId, locale) {
        const hasTemplates = views.some((view)=>(0, _i18n.hasObjectMetadataLabelPlaceholder)(view.name));
        if (!hasTemplates && views.every((view)=>view.isCustom)) {
            return views;
        }
        const { flatObjectMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps'
            ]
        });
        const getI18nContext = await this.applicationTranslationCatalogService.getI18nContextByApplicationId({
            applicationIds: views.map((view)=>view.applicationId),
            locale,
            workspaceId
        });
        return views.map((view)=>{
            const objectMetadata = (0, _i18n.hasObjectMetadataLabelPlaceholder)(view.name) ? (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: view.objectMetadataId,
                flatEntityMaps: flatObjectMetadataMaps
            }) : undefined;
            const objectLabelPlaceholderValues = (0, _utils.isDefined)(objectMetadata) ? (0, _buildviewnameobjectlabelsutil.buildViewNameObjectLabels)({
                viewName: view.name,
                objectMetadata,
                i18nContext: {
                    ...getI18nContext(objectMetadata.applicationId ?? undefined),
                    isStandardApp: (0, _belongstotwentystandardapputil.belongsToTwentyStandardApp)(objectMetadata)
                }
            }) : undefined;
            return {
                ...view,
                name: (0, _resolveviewnameutil.resolveViewName)({
                    view,
                    objectLabelPlaceholderValues,
                    i18nContext: getI18nContext(view.applicationId)
                })
            };
        });
    }
    constructor(viewService, flatEntityMapsCacheService, applicationTranslationCatalogService){
        this.viewService = viewService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.applicationTranslationCatalogService = applicationTranslationCatalogService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _common.UseGuards)(_custompermissionguard.CustomPermissionGuard),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _requestlocaledecorator.RequestLocale)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(3, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)({
        allowUndefined: true
    })),
    _ts_param(4, (0, _common.Query)('objectMetadataId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ViewController.prototype, "findMany", null);
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
], ViewController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_createviewpermissionguard.CreateViewPermissionGuard),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _requestlocaledecorator.RequestLocale)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createviewinput.CreateViewInput === "undefined" ? Object : _createviewinput.CreateViewInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ViewController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _common.UseGuards)(_viewpermissionguard.ViewPermissionGuard),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _requestlocaledecorator.RequestLocale)()),
    _ts_param(3, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(4, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)({
        allowUndefined: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updateviewinput.UpdateViewInput === "undefined" ? Object : _updateviewinput.UpdateViewInput,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ViewController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)(_viewpermissionguard.ViewPermissionGuard),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ViewController.prototype, "delete", null);
ViewController = _ts_decorate([
    (0, _common.Controller)(`${_types.ApiPath.Rest}/metadata/views`),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _common.UseFilters)(_permissionsrestapiexceptionfilter.PermissionsRestApiExceptionFilter, _viewrestapiexceptionfilter.ViewRestApiExceptionFilter, _flatentitymapsrestapiexceptionfilter.FlatEntityMapsRestApiExceptionFilter, _workspacemigrationrunnerrestapiexceptionfilter.WorkspaceMigrationRunnerRestApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _viewservice.ViewService === "undefined" ? Object : _viewservice.ViewService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _applicationtranslationcatalogservice.ApplicationTranslationCatalogService === "undefined" ? Object : _applicationtranslationcatalogservice.ApplicationTranslationCatalogService
    ])
], ViewController);

//# sourceMappingURL=view.controller.js.map