/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromRowLevelPermissionPredicateGroupEntityToFlatRowLevelPermissionPredicateGroup", {
    enumerable: true,
    get: function() {
        return fromRowLevelPermissionPredicateGroupEntityToFlatRowLevelPermissionPredicateGroup;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromRowLevelPermissionPredicateGroupEntityToFlatRowLevelPermissionPredicateGroup = (args)=>{
    const { entity: rowLevelPermissionPredicateGroupEntity } = args;
    const rowLevelPermissionPredicateGroupScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'rowLevelPermissionPredicateGroup',
        entity: rowLevelPermissionPredicateGroupEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'rowLevelPermissionPredicateGroup',
        ...args
    });
    return {
        ...rowLevelPermissionPredicateGroupScalarEntity,
        ...relationUniversalIdentifiers,
        childRowLevelPermissionPredicateGroupIds: (rowLevelPermissionPredicateGroupEntity.childRowLevelPermissionPredicateGroups ?? []).map(({ id })=>id),
        rowLevelPermissionPredicateIds: (rowLevelPermissionPredicateGroupEntity.rowLevelPermissionPredicates ?? []).map(({ id })=>id),
        childRowLevelPermissionPredicateGroupUniversalIdentifiers: (rowLevelPermissionPredicateGroupEntity.childRowLevelPermissionPredicateGroups ?? []).map(({ universalIdentifier })=>universalIdentifier),
        rowLevelPermissionPredicateUniversalIdentifiers: (rowLevelPermissionPredicateGroupEntity.rowLevelPermissionPredicates ?? []).map(({ universalIdentifier })=>universalIdentifier)
    };
};

//# sourceMappingURL=from-row-level-permission-predicate-group-entity-to-flat-row-level-permission-predicate-group.util.js.map