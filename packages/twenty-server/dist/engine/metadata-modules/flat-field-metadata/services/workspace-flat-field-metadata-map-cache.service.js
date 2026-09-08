"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatFieldMetadataMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatFieldMetadataMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _compactflatfieldmetadatamapsutil = require("../utils/compact-flat-field-metadata-maps.util");
const _expandflatfieldmetadatamapsutil = require("../utils/expand-flat-field-metadata-maps.util");
const _fromfieldmetadataentitytoflatfieldmetadatautil = require("../utils/from-field-metadata-entity-to-flat-field-metadata.util");
const _computeuniquefieldmetadataidsfromindexesutil = require("../../index-metadata/utils/compute-unique-field-metadata-ids-from-indexes.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_FIELD_METADATA_ROWS_REQUIREMENT = {
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
    },
    objectMetadata: [
        'id',
        'universalIdentifier'
    ],
    application: [
        'id',
        'universalIdentifier'
    ],
    viewField: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'fieldMetadataId'
        ]
    },
    viewFilter: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'fieldMetadataId'
        ]
    },
    viewSort: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'fieldMetadataId'
        ]
    },
    view: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'kanbanAggregateOperationFieldMetadataId',
            'calendarFieldMetadataId',
            'calendarEndFieldMetadataId',
            'mainGroupByFieldMetadataId'
        ]
    },
    searchFieldMetadata: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'fieldMetadataId'
        ]
    },
    fieldPermission: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'fieldMetadataId'
        ]
    }
};
let WorkspaceFlatFieldMetadataMapCacheService = class WorkspaceFlatFieldMetadataMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    compactForStorage(data) {
        return (0, _compactflatfieldmetadatamapsutil.compactFlatFieldMetadataMaps)(data);
    }
    expandFromStorage(compactData) {
        return (0, _expandflatfieldmetadatamapsutil.expandFlatFieldMetadataMaps)(compactData);
    }
    computeForCache({ rows }) {
        const { fieldMetadata: fieldMetadatas, index: indexMetadatas, indexFieldMetadata: indexFieldMetadatas, objectMetadata: objectMetadatas, application: applications, viewField: viewFields, viewFilter: viewFilters, viewSort: viewSorts, view: views, searchFieldMetadata: searchFieldMetadatas, fieldPermission: fieldPermissions } = rows;
        const fieldMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(fieldMetadatas);
        const objectMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(objectMetadatas);
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const uniqueFieldMetadataIds = (0, _computeuniquefieldmetadataidsfromindexesutil.computeUniqueFieldMetadataIdsFromIndexes)(indexMetadatas.map((indexMetadata)=>({
                ...indexMetadata,
                indexFieldMetadatas: indexFieldMetadatas.byIndexMetadataId.get(indexMetadata.id) ?? []
            })));
        const flatFieldMetadataMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const fieldMetadataEntity of fieldMetadatas){
            const flatFieldMetadata = (0, _fromfieldmetadataentitytoflatfieldmetadatautil.fromFieldMetadataEntityToFlatFieldMetadata)({
                entity: {
                    ...fieldMetadataEntity,
                    viewFields: viewFields.byFieldMetadataId.get(fieldMetadataEntity.id) || [],
                    viewFilters: viewFilters.byFieldMetadataId.get(fieldMetadataEntity.id) || [],
                    kanbanAggregateOperationViews: views.byKanbanAggregateOperationFieldMetadataId.get(fieldMetadataEntity.id) || [],
                    calendarViews: views.byCalendarFieldMetadataId.get(fieldMetadataEntity.id) || [],
                    calendarEndViews: views.byCalendarEndFieldMetadataId.get(fieldMetadataEntity.id) || [],
                    mainGroupByFieldMetadataViews: views.byMainGroupByFieldMetadataId.get(fieldMetadataEntity.id) || [],
                    viewSorts: viewSorts.byFieldMetadataId.get(fieldMetadataEntity.id) || [],
                    searchFieldMetadatas: searchFieldMetadatas.byFieldMetadataId.get(fieldMetadataEntity.id) || [],
                    fieldPermissions: fieldPermissions.byFieldMetadataId.get(fieldMetadataEntity.id) || []
                },
                fieldMetadataIdToUniversalIdentifierMap,
                objectMetadataIdToUniversalIdentifierMap,
                applicationIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: {
                    ...flatFieldMetadata,
                    isUnique: uniqueFieldMetadataIds.has(fieldMetadataEntity.id)
                },
                flatEntityMapsToMutate: flatFieldMetadataMaps
            });
        }
        return flatFieldMetadataMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_FIELD_METADATA_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatFieldMetadataMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatFieldMetadataMaps', {
        packingPonderation: 64
    })
], WorkspaceFlatFieldMetadataMapCacheService);

//# sourceMappingURL=workspace-flat-field-metadata-map-cache.service.js.map