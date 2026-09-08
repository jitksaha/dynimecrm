"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatObjectMetadataMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatObjectMetadataMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromobjectmetadataentitytoflatobjectmetadatautil = require("../utils/from-object-metadata-entity-to-flat-object-metadata.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_OBJECT_METADATA_ROWS_REQUIREMENT = {
    objectMetadata: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    fieldMetadata: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'objectMetadataId'
        ]
    },
    index: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'objectMetadataId'
        ]
    },
    view: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'objectMetadataId'
        ]
    },
    objectPermission: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'objectMetadataId'
        ]
    },
    fieldPermission: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'objectMetadataId'
        ]
    },
    searchFieldMetadata: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'objectMetadataId'
        ]
    },
    pageLayout: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'objectMetadataId'
        ]
    },
    commandMenuItem: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'navigationTargetObjectMetadataId'
        ]
    }
};
let WorkspaceFlatObjectMetadataMapCacheService = class WorkspaceFlatObjectMetadataMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { objectMetadata: objectMetadatas, application: applications, fieldMetadata: fieldMetadatas, index: indexMetadatas, view: views, objectPermission: objectPermissions, fieldPermission: fieldPermissions, searchFieldMetadata: searchFieldMetadatas, pageLayout: pageLayouts, commandMenuItem: commandMenuItems } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const fieldMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(fieldMetadatas.rows);
        const flatObjectMetadataMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const objectMetadataEntity of objectMetadatas){
            const flatObjectMetadata = (0, _fromobjectmetadataentitytoflatobjectmetadatautil.fromObjectMetadataEntityToFlatObjectMetadata)({
                entity: {
                    ...objectMetadataEntity,
                    fields: fieldMetadatas.byObjectMetadataId.get(objectMetadataEntity.id) || [],
                    indexMetadatas: indexMetadatas.byObjectMetadataId.get(objectMetadataEntity.id) || [],
                    views: views.byObjectMetadataId.get(objectMetadataEntity.id) || [],
                    objectPermissions: objectPermissions.byObjectMetadataId.get(objectMetadataEntity.id) || [],
                    fieldPermissions: fieldPermissions.byObjectMetadataId.get(objectMetadataEntity.id) || [],
                    searchFieldMetadatas: searchFieldMetadatas.byObjectMetadataId.get(objectMetadataEntity.id) || [],
                    pageLayouts: pageLayouts.byObjectMetadataId.get(objectMetadataEntity.id) || [],
                    commandMenuItems: commandMenuItems.byNavigationTargetObjectMetadataId.get(objectMetadataEntity.id) || []
                },
                applicationIdToUniversalIdentifierMap,
                fieldMetadataIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatObjectMetadata,
                flatEntityMapsToMutate: flatObjectMetadataMaps
            });
        }
        return flatObjectMetadataMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_OBJECT_METADATA_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatObjectMetadataMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatObjectMetadataMaps', {
        packingPonderation: 6
    })
], WorkspaceFlatObjectMetadataMapCacheService);

//# sourceMappingURL=workspace-flat-object-metadata-map-cache.service.js.map