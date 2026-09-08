/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateRowLevelPermissionRuleOwnershipOrThrow", {
    enumerable: true,
    get: function() {
        return validateRowLevelPermissionRuleOwnershipOrThrow;
    }
});
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _rowlevelpermissionpredicateexception = require("../exceptions/row-level-permission-predicate.exception");
const validateRowLevelPermissionRuleOwnershipOrThrow = ({ roleId, objectMetadataId, predicates, predicateGroups, flatRowLevelPermissionPredicateMaps, flatRowLevelPermissionPredicateGroupMaps, flatFieldMetadataMaps, workspaceMemberObjectMetadataId })=>{
    for (const predicateGroup of predicateGroups){
        if (!(0, _utils.isDefined)(predicateGroup.id)) {
            continue;
        }
        const existingGroup = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: predicateGroup.id,
            flatEntityMaps: flatRowLevelPermissionPredicateGroupMaps
        });
        if ((0, _utils.isDefined)(existingGroup) && existingGroup.deletedAt === null && (existingGroup.roleId !== roleId || existingGroup.objectMetadataId !== objectMetadataId)) {
            throw new _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateException('Predicate group belongs to a different role or object and cannot be modified here. Omit the id to create a new group.', _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.UNAUTHORIZED_OBJECT_MODIFICATION);
        }
    }
    const groupIdsInPayload = new Set(predicateGroups.map((predicateGroup)=>predicateGroup.id).filter(_utils.isDefined));
    for (const predicate of predicates){
        if ((0, _utils.isDefined)(predicate.id)) {
            const existingPredicate = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: predicate.id,
                flatEntityMaps: flatRowLevelPermissionPredicateMaps
            });
            if ((0, _utils.isDefined)(existingPredicate) && existingPredicate.deletedAt === null && (existingPredicate.roleId !== roleId || existingPredicate.objectMetadataId !== objectMetadataId)) {
                throw new _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateException('Predicate belongs to a different role or object and cannot be modified here. Omit the id to create a new predicate.', _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.UNAUTHORIZED_ROLE_MODIFICATION);
            }
        }
        const groupId = predicate.rowLevelPermissionPredicateGroupId;
        if ((0, _utils.isDefined)(groupId) && !groupIdsInPayload.has(groupId)) {
            const referencedGroup = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: groupId,
                flatEntityMaps: flatRowLevelPermissionPredicateGroupMaps
            });
            if (!(0, _utils.isDefined)(referencedGroup) || referencedGroup.deletedAt !== null || referencedGroup.roleId !== roleId || referencedGroup.objectMetadataId !== objectMetadataId) {
                throw new _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateException('Referenced predicate group is not a group of this role and object. Reference a group declared in predicateGroups or an existing group of this role and object.', _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.INVALID_ROW_LEVEL_PERMISSION_PREDICATE_DATA);
            }
        }
        const fieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: predicate.fieldMetadataId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(fieldMetadata)) {
            throw new _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateException('Field metadata not found', _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.FIELD_METADATA_NOT_FOUND);
        }
        if (fieldMetadata.objectMetadataId !== objectMetadataId) {
            throw new _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateException('Field belongs to another object and cannot be used in a rule on this object. Rules must filter on a field of the object they restrict.', _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.INVALID_ROW_LEVEL_PERMISSION_PREDICATE_DATA);
        }
        const workspaceMemberFieldMetadataId = predicate.workspaceMemberFieldMetadataId;
        if (!(0, _utils.isDefined)(workspaceMemberFieldMetadataId) || !(0, _utils.isDefined)(workspaceMemberObjectMetadataId)) {
            continue;
        }
        const workspaceMemberFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: workspaceMemberFieldMetadataId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(workspaceMemberFieldMetadata) || workspaceMemberFieldMetadata.objectMetadataId !== workspaceMemberObjectMetadataId) {
            throw new _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateException('workspaceMemberFieldMetadataId is not a field of the workspaceMember object. The rule would silently never apply.', _rowlevelpermissionpredicateexception.RowLevelPermissionPredicateExceptionCode.INVALID_ROW_LEVEL_PERMISSION_PREDICATE_DATA);
        }
    }
};

//# sourceMappingURL=validate-row-level-permission-rule-ownership.util.js.map