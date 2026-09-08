"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewSortController", {
    enumerable: true,
    get: function() {
        return ViewSortController;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _workspaceentity = require("../../../core-modules/workspace/workspace.entity");
const _paginatemetadatarestitemsutil = require("../../../api/rest/metadata/utils/paginate-metadata-rest-items.util");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _flatentitymapsrestapiexceptionfilter = require("../../flat-entity/filters/flat-entity-maps-rest-api-exception.filter");
const _permissionsrestapiexceptionfilter = require("../../permissions/utils/permissions-rest-api-exception.filter");
const _createviewsortinput = require("../dtos/inputs/create-view-sort.input");
const _viewsortexception = require("../exceptions/view-sort.exception");
const _viewsortrestapiexceptionfilter = require("../filters/view-sort-rest-api-exception.filter");
const _viewsortservice = require("../services/view-sort.service");
const _workspacemigrationrunnerrestapiexceptionfilter = require("../../../workspace-manager/workspace-migration/filters/workspace-migration-runner-rest-api-exception.filter");
const _createviewchildentitypermissionguard = require("../../view-permissions/guards/create-view-child-entity-permission.guard");
const _viewchildentitypermissionguard = require("../../view-permissions/guards/view-child-entity-permission.guard");
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
let ViewSortController = class ViewSortController {
    async findMany(request, workspace, viewId) {
        const items = viewId ? await this.viewSortService.findByViewId(workspace.id, viewId) : await this.viewSortService.findByWorkspaceId(workspace.id);
        return (0, _paginatemetadatarestitemsutil.paginateMetadataRestItems)({
            items,
            request
        });
    }
    async findOne(id, workspace) {
        const viewSort = await this.viewSortService.findById(id, workspace.id);
        if (!(0, _utils.isDefined)(viewSort)) {
            throw new _viewsortexception.ViewSortException((0, _viewsortexception.generateViewSortExceptionMessage)(_viewsortexception.ViewSortExceptionMessageKey.VIEW_SORT_NOT_FOUND, id), _viewsortexception.ViewSortExceptionCode.VIEW_SORT_NOT_FOUND, {
                userFriendlyMessage: (0, _viewsortexception.generateViewSortUserFriendlyExceptionMessage)(_viewsortexception.ViewSortExceptionMessageKey.VIEW_SORT_NOT_FOUND)
            });
        }
        return viewSort;
    }
    async create(input, { id: workspaceId }) {
        return await this.viewSortService.createOne({
            createViewSortInput: input,
            workspaceId
        });
    }
    async update(id, input, { id: workspaceId }) {
        return await this.viewSortService.updateOne({
            updateViewSortInput: {
                id,
                update: input
            },
            workspaceId
        });
    }
    async delete(id, { id: workspaceId }) {
        const deletedViewSort = await this.viewSortService.deleteOne({
            deleteViewSortInput: {
                id
            },
            workspaceId
        });
        return {
            success: (0, _utils.isDefined)(deletedViewSort)
        };
    }
    constructor(viewSortService){
        this.viewSortService = viewSortService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _common.Query)('viewId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ViewSortController.prototype, "findMany", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ViewSortController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_createviewchildentitypermissionguard.CreateViewChildEntityPermissionGuard),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createviewsortinput.CreateViewSortInput === "undefined" ? Object : _createviewsortinput.CreateViewSortInput,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ViewSortController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _common.UseGuards)((0, _viewchildentitypermissionguard.ViewChildEntityPermissionGuard)('viewSort')),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ViewSortController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.UseGuards)((0, _viewchildentitypermissionguard.ViewChildEntityPermissionGuard)('viewSort')),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ViewSortController.prototype, "delete", null);
ViewSortController = _ts_decorate([
    (0, _common.Controller)(`${_types.ApiPath.Rest}/metadata/viewSorts`),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _common.UseFilters)(_permissionsrestapiexceptionfilter.PermissionsRestApiExceptionFilter, _viewsortrestapiexceptionfilter.ViewSortRestApiExceptionFilter, _flatentitymapsrestapiexceptionfilter.FlatEntityMapsRestApiExceptionFilter, _workspacemigrationrunnerrestapiexceptionfilter.WorkspaceMigrationRunnerRestApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _viewsortservice.ViewSortService === "undefined" ? Object : _viewsortservice.ViewSortService
    ])
], ViewSortController);

//# sourceMappingURL=view-sort.controller.js.map