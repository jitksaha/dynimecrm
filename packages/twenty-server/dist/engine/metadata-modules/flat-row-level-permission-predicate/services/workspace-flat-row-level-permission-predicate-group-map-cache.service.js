/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatRowLevelPermissionPredicateGroupMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatRowLevelPermissionPredicateGroupMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromrowlevelpermissionpredicategroupentitytoflatrowlevelpermissionpredicategrouputil = require("../utils/from-row-level-permission-predicate-group-entity-to-flat-row-level-permission-predicate-group.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_ROW_LEVEL_PERMISSION_PREDICATE_GROUP_ROWS_REQUIREMENT = {
    rowLevelPermissionPredicateGroup: {
        columns: true,
        groupBy: [
            'parentRowLevelPermissionPredicateGroupId'
        ]
    },
    application: [
        'id',
        'universalIdentifier'
    ],
    objectMetadata: [
        'id',
        'universalIdentifier'
    ],
    role: [
        'id',
        'universalIdentifier'
    ],
    rowLevelPermissionPredicate: {
        columns: [
            'id',
            'universalIdentifier'
        ],
        groupBy: [
            'rowLevelPermissionPredicateGroupId'
        ]
    }
};
let WorkspaceFlatRowLevelPermissionPredicateGroupMapCacheService = class WorkspaceFlatRowLevelPermissionPredicateGroupMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { rowLevelPermissionPredicateGroup: rowLevelPermissionPredicateGroups, application: applications, objectMetadata: objectMetadatas, role: roles, rowLevelPermissionPredicate: rowLevelPermissionPredicates } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const objectMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(objectMetadatas);
        const roleIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(roles);
        const rowLevelPermissionPredicateGroupIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(rowLevelPermissionPredicateGroups.rows);
        const flatRowLevelPermissionPredicateGroupMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const rowLevelPermissionPredicateGroupEntity of rowLevelPermissionPredicateGroups.rows){
            const flatRowLevelPermissionPredicateGroup = (0, _fromrowlevelpermissionpredicategroupentitytoflatrowlevelpermissionpredicategrouputil.fromRowLevelPermissionPredicateGroupEntityToFlatRowLevelPermissionPredicateGroup)({
                entity: {
                    ...rowLevelPermissionPredicateGroupEntity,
                    childRowLevelPermissionPredicateGroups: rowLevelPermissionPredicateGroups.byParentRowLevelPermissionPredicateGroupId.get(rowLevelPermissionPredicateGroupEntity.id) || [],
                    rowLevelPermissionPredicates: rowLevelPermissionPredicates.byRowLevelPermissionPredicateGroupId.get(rowLevelPermissionPredicateGroupEntity.id) || []
                },
                applicationIdToUniversalIdentifierMap,
                objectMetadataIdToUniversalIdentifierMap,
                roleIdToUniversalIdentifierMap,
                rowLevelPermissionPredicateGroupIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatRowLevelPermissionPredicateGroup,
                flatEntityMapsToMutate: flatRowLevelPermissionPredicateGroupMaps
            });
        }
        return flatRowLevelPermissionPredicateGroupMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_ROW_LEVEL_PERMISSION_PREDICATE_GROUP_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatRowLevelPermissionPredicateGroupMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatRowLevelPermissionPredicateGroupMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatRowLevelPermissionPredicateGroupMapCacheService);

//# sourceMappingURL=workspace-flat-row-level-permission-predicate-group-map-cache.service.js.map