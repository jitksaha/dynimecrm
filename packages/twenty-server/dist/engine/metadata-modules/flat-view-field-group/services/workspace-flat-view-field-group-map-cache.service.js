"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatViewFieldGroupMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatViewFieldGroupMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromviewfieldgroupentitytoflatviewfieldgrouputil = require("../utils/from-view-field-group-entity-to-flat-view-field-group.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_VIEW_FIELD_GROUP_ROWS_REQUIREMENT = {
    viewFieldGroup: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    view: [
        'id',
        'universalIdentifier'
    ],
    viewField: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'viewFieldGroupId'
        ]
    }
};
let WorkspaceFlatViewFieldGroupMapCacheService = class WorkspaceFlatViewFieldGroupMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { viewFieldGroup: viewFieldGroups, application: applications, view: views, viewField: viewFields } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const viewIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(views);
        const flatViewFieldGroupMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const viewFieldGroupEntity of viewFieldGroups){
            const flatViewFieldGroup = (0, _fromviewfieldgroupentitytoflatviewfieldgrouputil.fromViewFieldGroupEntityToFlatViewFieldGroup)({
                entity: {
                    ...viewFieldGroupEntity,
                    viewFields: viewFields.byViewFieldGroupId.get(viewFieldGroupEntity.id) || []
                },
                applicationIdToUniversalIdentifierMap,
                viewIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatViewFieldGroup,
                flatEntityMapsToMutate: flatViewFieldGroupMaps
            });
        }
        return flatViewFieldGroupMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_VIEW_FIELD_GROUP_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatViewFieldGroupMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatViewFieldGroupMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatViewFieldGroupMapCacheService);

//# sourceMappingURL=workspace-flat-view-field-group-map-cache.service.js.map