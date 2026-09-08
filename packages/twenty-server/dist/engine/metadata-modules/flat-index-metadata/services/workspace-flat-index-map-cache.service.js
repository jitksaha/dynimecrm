"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatIndexMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatIndexMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromindexmetadataentitytoflatindexmetadatautil = require("../utils/from-index-metadata-entity-to-flat-index-metadata.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_INDEX_ROWS_REQUIREMENT = {
    index: true,
    indexFieldMetadata: {
        columns: true,
        groupBy: [
            'indexMetadataId'
        ]
    },
    application: [
        'id',
        'universalIdentifier',
        'deletedAt'
    ],
    objectMetadata: [
        'id',
        'universalIdentifier'
    ],
    fieldMetadata: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatIndexMapCacheService = class WorkspaceFlatIndexMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { index: indexes, indexFieldMetadata: indexFieldMetadatas, application: applications, objectMetadata: objectMetadatas, fieldMetadata: fieldMetadatas } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications.filter((application)=>!(0, _utils.isDefined)(application.deletedAt)));
        const objectMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(objectMetadatas);
        const fieldMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(fieldMetadatas);
        const flatIndexMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const indexEntity of indexes){
            const flatIndex = (0, _fromindexmetadataentitytoflatindexmetadatautil.fromIndexMetadataEntityToFlatIndexMetadata)({
                entity: {
                    ...indexEntity,
                    indexFieldMetadatas: indexFieldMetadatas.byIndexMetadataId.get(indexEntity.id) ?? []
                },
                applicationIdToUniversalIdentifierMap,
                objectMetadataIdToUniversalIdentifierMap,
                fieldMetadataIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatIndex,
                flatEntityMapsToMutate: flatIndexMaps
            });
        }
        return flatIndexMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_INDEX_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatIndexMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatIndexMaps', {
        packingPonderation: 8
    })
], WorkspaceFlatIndexMapCacheService);

//# sourceMappingURL=workspace-flat-index-map-cache.service.js.map