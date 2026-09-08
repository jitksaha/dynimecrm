"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IndexMetadataConnectionLoaderFactory", {
    enumerable: true,
    get: function() {
        return IndexMetadataConnectionLoaderFactory;
    }
});
const _common = require("@nestjs/common");
const _dataloader = /*#__PURE__*/ _interop_require_default(require("dataloader"));
const _workspacemanyorallflatentitymapscacheservice = require("../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _findmanyflatentitybyidinflatentitymapsorthrowutil = require("../../metadata-modules/flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _indexfilterinput = require("../../metadata-modules/index-metadata/dtos/index-filter.input");
const _applymetadatafiltertoitemsutil = require("../../metadata-modules/pagination/utils/apply-metadata-filter-to-items.util");
const _findmanyitemswithcursorpaginationutil = require("../../metadata-modules/pagination/utils/find-many-items-with-cursor-pagination.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let IndexMetadataConnectionLoaderFactory = class IndexMetadataConnectionLoaderFactory {
    create() {
        return new _dataloader.default(async (dataLoaderParams)=>{
            const workspaceId = dataLoaderParams[0].workspaceId;
            const { flatIndexMaps, flatObjectMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                workspaceId,
                flatMapsKeys: [
                    'flatIndexMaps',
                    'flatObjectMetadataMaps'
                ]
            });
            return dataLoaderParams.map(({ objectMetadata, paging, filter })=>{
                const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
                    flatEntityId: objectMetadata.id,
                    flatEntityMaps: flatObjectMetadataMaps
                });
                const flatIndexMetadatas = (0, _findmanyflatentitybyidinflatentitymapsorthrowutil.findManyFlatEntityByIdInFlatEntityMapsOrThrow)({
                    flatEntityIds: flatObjectMetadata.indexMetadataIds,
                    flatEntityMaps: flatIndexMaps
                });
                const filteredFlatIndexMetadatas = (0, _applymetadatafiltertoitemsutil.applyMetadataFilterToItems)({
                    items: flatIndexMetadatas,
                    filter,
                    columnByFilterField: _indexfilterinput.INDEX_FILTER_COLUMN_BY_FILTER_FIELD
                });
                const connection = (0, _findmanyitemswithcursorpaginationutil.findManyItemsWithCursorPagination)({
                    items: filteredFlatIndexMetadatas,
                    paging
                });
                return {
                    ...connection,
                    edges: connection.edges.map((edge)=>({
                            ...edge,
                            node: {
                                ...edge.node,
                                indexFieldMetadatas: edge.node.flatIndexFieldMetadatas,
                                createdAt: new Date(edge.node.createdAt),
                                updatedAt: new Date(edge.node.updatedAt),
                                indexWhereClause: edge.node.indexWhereClause ?? undefined,
                                objectMetadataId: objectMetadata.id,
                                workspaceId
                            }
                        }))
                };
            });
        });
    }
    constructor(flatEntityMapsCacheService){
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
    }
};
IndexMetadataConnectionLoaderFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], IndexMetadataConnectionLoaderFactory);

//# sourceMappingURL=index-metadata-connection-loader.factory.js.map