"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UniqueFieldMetadataIdsService", {
    enumerable: true,
    get: function() {
        return UniqueFieldMetadataIdsService;
    }
});
const _common = require("@nestjs/common");
const _workspacemanyorallflatentitymapscacheservice = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _computeuniquefieldmetadataidsfromflatindexmapsutil = require("../utils/compute-unique-field-metadata-ids-from-flat-index-maps.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UniqueFieldMetadataIdsService = class UniqueFieldMetadataIdsService {
    async getForWorkspace(workspaceId) {
        const { flatIndexMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatIndexMaps'
            ]
        });
        return (0, _computeuniquefieldmetadataidsfromflatindexmapsutil.computeUniqueFieldMetadataIdsFromFlatIndexMaps)(flatIndexMaps);
    }
    constructor(flatEntityMapsCacheService){
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
    }
};
UniqueFieldMetadataIdsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], UniqueFieldMetadataIdsService);

//# sourceMappingURL=unique-field-metadata-ids.service.js.map