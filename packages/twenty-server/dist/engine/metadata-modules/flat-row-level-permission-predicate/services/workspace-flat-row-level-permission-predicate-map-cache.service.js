/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFlatRowLevelPermissionPredicateMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFlatRowLevelPermissionPredicateMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _metadataflatentitymapscacheproviderservice = require("../../../workspace-cache/interfaces/metadata-flat-entity-maps-cache-provider.service");
const _createemptyflatentitymapsconstant = require("../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _fromrowlevelpermissionpredicateentitytoflatrowlevelpermissionpredicateutil = require("../utils/from-row-level-permission-predicate-entity-to-flat-row-level-permission-predicate.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
const _createidtouniversalidentifiermaputil = require("../../../workspace-cache/utils/create-id-to-universal-identifier-map.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-manager/workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FLAT_ROW_LEVEL_PERMISSION_PREDICATE_ROWS_REQUIREMENT = {
    rowLevelPermissionPredicate: true,
    application: [
        'id',
        'universalIdentifier'
    ],
    fieldMetadata: [
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
    rowLevelPermissionPredicateGroup: [
        'id',
        'universalIdentifier'
    ]
};
let WorkspaceFlatRowLevelPermissionPredicateMapCacheService = class WorkspaceFlatRowLevelPermissionPredicateMapCacheService extends _metadataflatentitymapscacheproviderservice.MetadataFlatEntityMapsCacheProvider {
    computeForCache({ rows }) {
        const { rowLevelPermissionPredicate: rowLevelPermissionPredicates, application: applications, fieldMetadata: fieldMetadatas, objectMetadata: objectMetadatas, role: roles, rowLevelPermissionPredicateGroup: rowLevelPermissionPredicateGroups } = rows;
        const applicationIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(applications);
        const fieldMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(fieldMetadatas);
        const objectMetadataIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(objectMetadatas);
        const roleIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(roles);
        const rowLevelPermissionPredicateGroupIdToUniversalIdentifierMap = (0, _createidtouniversalidentifiermaputil.createIdToUniversalIdentifierMap)(rowLevelPermissionPredicateGroups);
        const flatRowLevelPermissionPredicateMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const rowLevelPermissionPredicateEntity of rowLevelPermissionPredicates){
            const flatRowLevelPermissionPredicate = (0, _fromrowlevelpermissionpredicateentitytoflatrowlevelpermissionpredicateutil.fromRowLevelPermissionPredicateEntityToFlatRowLevelPermissionPredicate)({
                entity: rowLevelPermissionPredicateEntity,
                applicationIdToUniversalIdentifierMap,
                fieldMetadataIdToUniversalIdentifierMap,
                objectMetadataIdToUniversalIdentifierMap,
                roleIdToUniversalIdentifierMap,
                rowLevelPermissionPredicateGroupIdToUniversalIdentifierMap
            });
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: flatRowLevelPermissionPredicate,
                flatEntityMapsToMutate: flatRowLevelPermissionPredicateMaps
            });
        }
        return flatRowLevelPermissionPredicateMaps;
    }
    constructor(...args){
        super(...args), this.rowsRequirement = FLAT_ROW_LEVEL_PERMISSION_PREDICATE_ROWS_REQUIREMENT;
    }
};
WorkspaceFlatRowLevelPermissionPredicateMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('flatRowLevelPermissionPredicateMaps', {
        packingPonderation: 1
    })
], WorkspaceFlatRowLevelPermissionPredicateMapCacheService);

//# sourceMappingURL=workspace-flat-row-level-permission-predicate-map-cache.service.js.map