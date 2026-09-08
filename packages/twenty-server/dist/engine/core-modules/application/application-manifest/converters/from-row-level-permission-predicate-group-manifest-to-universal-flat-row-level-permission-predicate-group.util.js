"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromRowLevelPermissionPredicateGroupManifestToUniversalFlatRowLevelPermissionPredicateGroup", {
    enumerable: true,
    get: function() {
        return fromRowLevelPermissionPredicateGroupManifestToUniversalFlatRowLevelPermissionPredicateGroup;
    }
});
const fromRowLevelPermissionPredicateGroupManifestToUniversalFlatRowLevelPermissionPredicateGroup = ({ rowLevelPermissionPredicateGroupManifest, roleUniversalIdentifier, applicationUniversalIdentifier, now })=>{
    return {
        universalIdentifier: rowLevelPermissionPredicateGroupManifest.universalIdentifier,
        applicationUniversalIdentifier,
        roleUniversalIdentifier,
        objectMetadataUniversalIdentifier: rowLevelPermissionPredicateGroupManifest.objectUniversalIdentifier,
        logicalOperator: rowLevelPermissionPredicateGroupManifest.logicalOperator,
        parentRowLevelPermissionPredicateGroupUniversalIdentifier: rowLevelPermissionPredicateGroupManifest.parentPredicateGroupUniversalIdentifier ?? null,
        positionInRowLevelPermissionPredicateGroup: rowLevelPermissionPredicateGroupManifest.position ?? null,
        childRowLevelPermissionPredicateGroupUniversalIdentifiers: [],
        rowLevelPermissionPredicateUniversalIdentifiers: [],
        createdAt: now,
        updatedAt: now,
        deletedAt: null
    };
};

//# sourceMappingURL=from-row-level-permission-predicate-group-manifest-to-universal-flat-row-level-permission-predicate-group.util.js.map