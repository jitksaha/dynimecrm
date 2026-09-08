/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromRowLevelPermissionPredicateEntityToFlatRowLevelPermissionPredicate", {
    enumerable: true,
    get: function() {
        return fromRowLevelPermissionPredicateEntityToFlatRowLevelPermissionPredicate;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromRowLevelPermissionPredicateEntityToFlatRowLevelPermissionPredicate = (args)=>{
    const { entity: rowLevelPermissionPredicateEntity } = args;
    const rowLevelPermissionPredicateScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'rowLevelPermissionPredicate',
        entity: rowLevelPermissionPredicateEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'rowLevelPermissionPredicate',
        ...args
    });
    return {
        ...rowLevelPermissionPredicateScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-row-level-permission-predicate-entity-to-flat-row-level-permission-predicate.util.js.map