"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceOrmFlatFieldMetadataMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceOrmFlatFieldMetadataMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _workspacecacheproviderservice = require("../../../workspace-cache/interfaces/workspace-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromfieldmetadataentitytoormflatfieldmetadatautil = require("../utils/from-field-metadata-entity-to-orm-flat-field-metadata.util");
const _computeuniquefieldmetadataidsfromindexesutil = require("../../index-metadata/utils/compute-unique-field-metadata-ids-from-indexes.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const ORM_FLAT_FIELD_METADATA_ROWS_REQUIREMENT = {
    fieldMetadata: true,
    index: {
        columns: [
            'id',
            'isUnique',
            'isSystemSideEffect'
        ],
        where: {
            isUnique: true
        }
    },
    indexFieldMetadata: {
        columns: [
            'id',
            'fieldMetadataId',
            'subFieldName'
        ],
        groupBy: [
            'indexMetadataId'
        ]
    }
};
let WorkspaceOrmFlatFieldMetadataMapCacheService = class WorkspaceOrmFlatFieldMetadataMapCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    computeForCache({ rows }) {
        const { fieldMetadata: fieldMetadatas, index: indexMetadatas, indexFieldMetadata: indexFieldMetadatas } = rows;
        const uniqueFieldMetadataIds = (0, _computeuniquefieldmetadataidsfromindexesutil.computeUniqueFieldMetadataIdsFromIndexes)(indexMetadatas.map((indexMetadata)=>({
                ...indexMetadata,
                indexFieldMetadatas: indexFieldMetadatas.byIndexMetadataId.get(indexMetadata.id) ?? []
            })));
        const ormFlatFieldMetadataMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const fieldMetadataEntity of fieldMetadatas){
            const ormFlatFieldMetadata = (0, _fromfieldmetadataentitytoormflatfieldmetadatautil.fromFieldMetadataEntityToOrmFlatFieldMetadata)({
                entity: fieldMetadataEntity,
                isUnique: uniqueFieldMetadataIds.has(fieldMetadataEntity.id)
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: ormFlatFieldMetadata,
                flatEntityMapsToMutate: ormFlatFieldMetadataMaps
            });
        }
        return ormFlatFieldMetadataMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = ORM_FLAT_FIELD_METADATA_ROWS_REQUIREMENT;
    }
};
WorkspaceOrmFlatFieldMetadataMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatFieldMetadataMapsOrm', {
        packingPonderation: 8
    })
], WorkspaceOrmFlatFieldMetadataMapCacheService);

//# sourceMappingURL=workspace-orm-flat-field-metadata-map-cache.service.js.map