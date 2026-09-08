"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatSearchFieldMetadataMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatSearchFieldMetadataMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromsearchfieldmetadataentitytoflatsearchfieldmetadatautil = require("../utils/from-search-field-metadata-entity-to-flat-search-field-metadata.util");
const _searchvectorfieldconstants = require("../../search-field-metadata/constants/search-vector-field.constants");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_SEARCH_FIELD_METADATA_ROWS_REQUIREMENT = {
    searchFieldMetadata: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    objectMetadata: [
        'id',
        'universalIdentifier'
    ],
    fieldMetadata: [
        'id',
        'universalIdentifier',
        'name',
        'type',
        'objectMetadataId'
    ]
};
let WorkspaceFlatSearchFieldMetadataMapCacheService = class WorkspaceFlatSearchFieldMetadataMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { searchFieldMetadata: existingSearchFieldMetadatas, application: applications, objectMetadata: objectMetadatas, fieldMetadata: fieldMetadatas } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const objectMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(objectMetadatas);
        const fieldMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(fieldMetadatas);
        // Each object's single system TS_VECTOR field, used to backfill the FK for
        // legacy searchFieldMetadata rows still NULL before the 2.18 slow command runs.
        // TODO: remove this fallback (and the searchVector map) once the minimum
        // cross-upgrade supported version is past 2.18 — at which point no instance can
        // still have NULL tsVectorFieldMetadataId rows.
        const searchVectorFieldIdByObjectMetadataId = new Map();
        for (const fieldMetadata of fieldMetadatas){
            if (fieldMetadata.type === _types.FieldMetadataType.TS_VECTOR && fieldMetadata.name === _searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name) {
                searchVectorFieldIdByObjectMetadataId.set(fieldMetadata.objectMetadataId, fieldMetadata.id);
            }
        }
        const flatSearchFieldMetadataMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const searchFieldMetadata of existingSearchFieldMetadatas){
            const resolvedTsVectorFieldMetadataId = searchFieldMetadata.tsVectorFieldMetadataId ?? searchVectorFieldIdByObjectMetadataId.get(searchFieldMetadata.objectMetadataId);
            const flatSearchFieldMetadata = (0, _fromsearchfieldmetadataentitytoflatsearchfieldmetadatautil.fromSearchFieldMetadataEntityToFlatSearchFieldMetadata)({
                entity: (0, _utils.isDefined)(resolvedTsVectorFieldMetadataId) ? {
                    ...searchFieldMetadata,
                    tsVectorFieldMetadataId: resolvedTsVectorFieldMetadataId
                } : searchFieldMetadata,
                applicationIdToUniversalIdentifierMap,
                objectMetadataIdToUniversalIdentifierMap,
                fieldMetadataIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatSearchFieldMetadata,
                flatEntityMapsToMutate: flatSearchFieldMetadataMaps
            });
        }
        return flatSearchFieldMetadataMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_SEARCH_FIELD_METADATA_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatSearchFieldMetadataMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatSearchFieldMetadataMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatSearchFieldMetadataMapCacheService);

//# sourceMappingURL=workspace-flat-search-field-metadata-map-cache.service.js.map