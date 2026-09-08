"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DashboardSyncService", {
    enumerable: true,
    get: function() {
        return DashboardSyncService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _workspacemanyorallflatentitymapscacheservice = require("../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _types = require("twenty-shared/types");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DashboardSyncService = class DashboardSyncService {
    async isPageLayoutOfTypeDashboard({ pageLayoutId, workspaceId }) {
        const { flatPageLayoutMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatPageLayoutMaps'
            ]
        });
        const pageLayout = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: pageLayoutId,
            flatEntityMaps: flatPageLayoutMaps
        });
        return (0, _utils.isDefined)(pageLayout) && pageLayout.type === _types.PageLayoutType.DASHBOARD;
    }
    async updateLinkedDashboardsUpdatedAtByPageLayoutId({ pageLayoutId, workspaceId, updatedAt }) {
        const isDashboard = await this.isPageLayoutOfTypeDashboard({
            pageLayoutId,
            workspaceId
        });
        if (!isDashboard) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        try {
            await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                const dashboardRepository = this.workspaceOrmManager.getRepository('dashboard', {
                    shouldBypassPermissionChecks: true
                });
                await dashboardRepository.update({
                    pageLayoutId
                }, {
                    updatedAt
                });
            }, authContext);
        } catch (error) {
            this.logger.error(`Failed to update dashboard updatedAt for page layout ${pageLayoutId}: ${error}`);
        }
    }
    async updateLinkedDashboardsUpdatedAtByTabId({ tabId, workspaceId, updatedAt }) {
        const { flatPageLayoutTabMaps, flatPageLayoutMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatPageLayoutTabMaps',
                'flatPageLayoutMaps'
            ]
        });
        const tab = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: tabId,
            flatEntityMaps: flatPageLayoutTabMaps
        });
        if (!(0, _utils.isDefined)(tab)) {
            return;
        }
        const pageLayout = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: tab.pageLayoutId,
            flatEntityMaps: flatPageLayoutMaps
        });
        if (!(0, _utils.isDefined)(pageLayout) || pageLayout.type !== _types.PageLayoutType.DASHBOARD) {
            return;
        }
        await this.updateLinkedDashboardsUpdatedAtByPageLayoutId({
            pageLayoutId: tab.pageLayoutId,
            workspaceId,
            updatedAt
        });
    }
    async updateLinkedDashboardsUpdatedAtByWidgetId({ widgetId, workspaceId, updatedAt }) {
        const { flatPageLayoutWidgetMaps, flatPageLayoutTabMaps, flatPageLayoutMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatPageLayoutWidgetMaps',
                'flatPageLayoutTabMaps',
                'flatPageLayoutMaps'
            ]
        });
        const widget = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: widgetId,
            flatEntityMaps: flatPageLayoutWidgetMaps
        });
        if (!(0, _utils.isDefined)(widget)) {
            return;
        }
        const tab = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: widget.pageLayoutTabId,
            flatEntityMaps: flatPageLayoutTabMaps
        });
        if (!(0, _utils.isDefined)(tab)) {
            return;
        }
        const pageLayout = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: tab.pageLayoutId,
            flatEntityMaps: flatPageLayoutMaps
        });
        if (!(0, _utils.isDefined)(pageLayout) || pageLayout.type !== _types.PageLayoutType.DASHBOARD) {
            return;
        }
        await this.updateLinkedDashboardsUpdatedAtByPageLayoutId({
            pageLayoutId: tab.pageLayoutId,
            workspaceId,
            updatedAt
        });
    }
    constructor(workspaceOrmManager, workspaceManyOrAllFlatEntityMapsCacheService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.logger = new _common.Logger(DashboardSyncService.name);
    }
};
DashboardSyncService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], DashboardSyncService);

//# sourceMappingURL=dashboard-sync.service.js.map