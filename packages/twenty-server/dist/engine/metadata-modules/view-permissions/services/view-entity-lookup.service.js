"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewEntityLookupService", {
    enumerable: true,
    get: function() {
        return ViewEntityLookupService;
    }
});
const _common = require("@nestjs/common");
const _workspacemanyorallflatentitymapscacheservice = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ViewEntityLookupService = class ViewEntityLookupService {
    async findViewIdByEntityIdAndKind(kind, entityId, workspaceId) {
        switch(kind){
            case 'viewField':
                {
                    const { flatViewFieldMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                        workspaceId,
                        flatMapsKeys: [
                            'flatViewFieldMaps'
                        ]
                    });
                    return (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                        flatEntityId: entityId,
                        flatEntityMaps: flatViewFieldMaps
                    })?.viewId ?? null;
                }
            case 'viewFilter':
                {
                    const { flatViewFilterMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                        workspaceId,
                        flatMapsKeys: [
                            'flatViewFilterMaps'
                        ]
                    });
                    return (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                        flatEntityId: entityId,
                        flatEntityMaps: flatViewFilterMaps
                    })?.viewId ?? null;
                }
            case 'viewFilterGroup':
                {
                    const { flatViewFilterGroupMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                        workspaceId,
                        flatMapsKeys: [
                            'flatViewFilterGroupMaps'
                        ]
                    });
                    return (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                        flatEntityId: entityId,
                        flatEntityMaps: flatViewFilterGroupMaps
                    })?.viewId ?? null;
                }
            case 'viewGroup':
                {
                    const { flatViewGroupMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                        workspaceId,
                        flatMapsKeys: [
                            'flatViewGroupMaps'
                        ]
                    });
                    return (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                        flatEntityId: entityId,
                        flatEntityMaps: flatViewGroupMaps
                    })?.viewId ?? null;
                }
            case 'viewSort':
                {
                    const { flatViewSortMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                        workspaceId,
                        flatMapsKeys: [
                            'flatViewSortMaps'
                        ]
                    });
                    return (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                        flatEntityId: entityId,
                        flatEntityMaps: flatViewSortMaps
                    })?.viewId ?? null;
                }
            default:
                return null;
        }
    }
    constructor(flatEntityMapsCacheService){
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
    }
};
ViewEntityLookupService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], ViewEntityLookupService);

//# sourceMappingURL=view-entity-lookup.service.js.map