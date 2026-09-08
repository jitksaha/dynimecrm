"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromRowLevelPermissionPredicateManifestToUniversalFlatRowLevelPermissionPredicate", {
    enumerable: true,
    get: function() {
        return fromRowLevelPermissionPredicateManifestToUniversalFlatRowLevelPermissionPredicate;
    }
});
const fromRowLevelPermissionPredicateManifestToUniversalFlatRowLevelPermissionPredicate = ({ rowLevelPermissionPredicateManifest, roleUniversalIdentifier, applicationUniversalIdentifier, now })=>{
    return {
        universalIdentifier: rowLevelPermissionPredicateManifest.universalIdentifier,
        applicationUniversalIdentifier,
        roleUniversalIdentifier,
        objectMetadataUniversalIdentifier: rowLevelPermissionPredicateManifest.objectUniversalIdentifier,
        fieldMetadataUniversalIdentifier: rowLevelPermissionPredicateManifest.fieldUniversalIdentifier,
        operand: rowLevelPermissionPredicateManifest.operand,
        value: rowLevelPermissionPredicateManifest.value ?? null,
        subFieldName: rowLevelPermissionPredicateManifest.subFieldName ?? null,
        workspaceMemberFieldMetadataUniversalIdentifier: rowLevelPermissionPredicateManifest.workspaceMemberFieldUniversalIdentifier ?? null,
        workspaceMemberSubFieldName: rowLevelPermissionPredicateManifest.workspaceMemberSubFieldName ?? null,
        rowLevelPermissionPredicateGroupUniversalIdentifier: rowLevelPermissionPredicateManifest.predicateGroupUniversalIdentifier ?? null,
        positionInRowLevelPermissionPredicateGroup: rowLevelPermissionPredicateManifest.position ?? null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null
    };
};

//# sourceMappingURL=from-row-level-permission-predicate-manifest-to-universal-flat-row-level-permission-predicate.util.js.map