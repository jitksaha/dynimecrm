"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatViewFieldMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatViewFieldMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromviewfieldentitytoflatviewfieldutil = require("../utils/from-view-field-entity-to-flat-view-field.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_VIEW_FIELD_ROWS_REQUIREMENT = {
    viewField: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    fieldMetadata: [
        'id',
        'universalIdentifier'
    ],
    view: [
        'id',
        'universalIdentifier'
    ],
    viewFieldGroup: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatViewFieldMapCacheService = class WorkspaceFlatViewFieldMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { viewField: viewFields, application: applications, fieldMetadata: fieldMetadatas, view: views, viewFieldGroup: viewFieldGroups } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const fieldMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(fieldMetadatas);
        const viewIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(views);
        const viewFieldGroupIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(viewFieldGroups);
        const flatViewFieldMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const viewFieldEntity of viewFields){
            const flatViewField = (0, _fromviewfieldentitytoflatviewfieldutil.fromViewFieldEntityToFlatViewField)({
                entity: viewFieldEntity,
                applicationIdToUniversalIdentifierMap,
                fieldMetadataIdToUniversalIdentifierMap,
                viewIdToUniversalIdentifierMap,
                viewFieldGroupIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatViewField,
                flatEntityMapsToMutate: flatViewFieldMaps
            });
        }
        return flatViewFieldMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_VIEW_FIELD_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatViewFieldMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatViewFieldMaps', {
        packingPonderation: 32
    })
], WorkspaceFlatViewFieldMapCacheService);

//# sourceMappingURL=workspace-flat-view-field-map-cache.service.js.map