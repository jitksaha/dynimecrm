"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatViewMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatViewMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromviewentitytoflatviewutil = require("../utils/from-view-entity-to-flat-view.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_VIEW_ROWS_REQUIREMENT = {
    view: true,
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
        'universalIdentifier'
    ],
    viewField: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'viewId'
        ]
    },
    viewFilter: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'viewId'
        ]
    },
    viewGroup: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'viewId'
        ]
    },
    viewFilterGroup: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'viewId'
        ]
    },
    viewSort: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'viewId'
        ]
    },
    viewFieldGroup: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'viewId'
        ]
    }
};
let WorkspaceFlatViewMapCacheService = class WorkspaceFlatViewMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { view: views, application: applications, objectMetadata: objectMetadatas, fieldMetadata: fieldMetadatas, viewField: viewFields, viewFilter: viewFilters, viewGroup: viewGroups, viewFilterGroup: viewFilterGroups, viewSort: viewSorts, viewFieldGroup: viewFieldGroups } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const objectMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(objectMetadatas);
        const fieldMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(fieldMetadatas);
        const flatViewMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const viewEntity of views){
            const flatView = (0, _fromviewentitytoflatviewutil.fromViewEntityToFlatView)({
                entity: {
                    ...viewEntity,
                    viewFields: viewFields.byViewId.get(viewEntity.id) || [],
                    viewFilters: viewFilters.byViewId.get(viewEntity.id) || [],
                    viewGroups: viewGroups.byViewId.get(viewEntity.id) || [],
                    viewFilterGroups: viewFilterGroups.byViewId.get(viewEntity.id) || [],
                    viewSorts: viewSorts.byViewId.get(viewEntity.id) || [],
                    viewFieldGroups: viewFieldGroups.byViewId.get(viewEntity.id) || []
                },
                applicationIdToUniversalIdentifierMap,
                objectMetadataIdToUniversalIdentifierMap,
                fieldMetadataIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatView,
                flatEntityMapsToMutate: flatViewMaps
            });
        }
        return flatViewMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_VIEW_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatViewMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatViewMaps', {
        packingPonderation: 8
    })
], WorkspaceFlatViewMapCacheService);

//# sourceMappingURL=workspace-flat-view-map-cache.service.js.map