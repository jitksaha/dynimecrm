/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _rowlevelpermissionpredicateexception = require("../../exceptions/row-level-permission-predicate.exception");
const _validaterowlevelpermissionruleownershiputil = require("../validate-row-level-permission-rule-ownership.util");
const roleId = 'role-id';
const objectMetadataId = 'object-metadata-id';
const workspaceMemberObjectMetadataId = 'workspace-member-object-id';
const ownerFieldMetadataId = 'owner-field-metadata-id';
const workspaceMemberIdFieldMetadataId = 'workspace-member-id-field-metadata-id';
const createFlatEntityMapsKeyedById = (entities)=>({
        byUniversalIdentifier: Object.fromEntries(entities.map((entity)=>[
                entity.id,
                entity
            ])),
        universalIdentifierById: Object.fromEntries(entities.map((entity)=>[
                entity.id,
                entity.id
            ]))
    });
const defaultFields = [
    {
        id: ownerFieldMetadataId,
        name: 'owner',
        objectMetadataId
    },
    {
        id: workspaceMemberIdFieldMetadataId,
        name: 'id',
        objectMetadataId: workspaceMemberObjectMetadataId
    }
];
const ownerMatchesCurrentUserPredicate = {
    fieldMetadataId: ownerFieldMetadataId,
    operand: _types.RowLevelPermissionPredicateOperand.IS,
    workspaceMemberFieldMetadataId: workspaceMemberIdFieldMetadataId
};
const validate = ({ predicates = [], predicateGroups = [], existingPredicates = [], existingGroups = [], fields = defaultFields })=>(0, _validaterowlevelpermissionruleownershiputil.validateRowLevelPermissionRuleOwnershipOrThrow)({
        roleId,
        objectMetadataId,
        predicates: predicates,
        predicateGroups: predicateGroups,
        flatRowLevelPermissionPredicateMaps: createFlatEntityMapsKeyedById(existingPredicates.map((predicate)=>({
                deletedAt: null,
                ...predicate
            }))),
        flatRowLevelPermissionPredicateGroupMaps: createFlatEntityMapsKeyedById(existingGroups.map((group)=>({
                deletedAt: null,
                ...group
            }))),
        flatFieldMetadataMaps: createFlatEntityMapsKeyedById(fields),
        workspaceMemberObjectMetadataId
    });
describe('validateRowLevelPermissionRuleOwnershipOrThrow', ()=>{
    it('rejects a predicate id owned by another role', ()=>{
        expect(()=>validate({
                predicates: [
                    {
                        ...ownerMatchesCurrentUserPredicate,
                        id: 'foreign-predicate-id'
                    }
                ],
                existingPredicates: [
                    {
                        id: 'foreign-predicate-id',
                        roleId: 'another-role-id',
                        objectMetadataId
                    }
                ]
            })).toThrow(_rowlevelpermissionpredicateexception.RowLevelPermissionPredicateException);
    });
    it('rejects a predicate group id owned by another object', ()=>{
        expect(()=>validate({
                predicateGroups: [
                    {
                        id: 'foreign-group-id',
                        logicalOperator: 'AND'
                    }
                ],
                existingGroups: [
                    {
                        id: 'foreign-group-id',
                        roleId,
                        objectMetadataId: 'another-object-metadata-id'
                    }
                ]
            })).toThrow(_rowlevelpermissionpredicateexception.RowLevelPermissionPredicateException);
    });
    it('rejects a predicate referencing a group of another role', ()=>{
        expect(()=>validate({
                predicates: [
                    {
                        ...ownerMatchesCurrentUserPredicate,
                        rowLevelPermissionPredicateGroupId: 'foreign-group-id'
                    }
                ],
                existingGroups: [
                    {
                        id: 'foreign-group-id',
                        roleId: 'another-role-id',
                        objectMetadataId
                    }
                ]
            })).toThrow(_rowlevelpermissionpredicateexception.RowLevelPermissionPredicateException);
    });
    it('rejects a field belonging to another object', ()=>{
        expect(()=>validate({
                predicates: [
                    {
                        fieldMetadataId: 'other-object-field-id',
                        operand: _types.RowLevelPermissionPredicateOperand.IS
                    }
                ],
                fields: [
                    ...defaultFields,
                    {
                        id: 'other-object-field-id',
                        name: 'unrelatedField',
                        objectMetadataId: 'another-object-metadata-id'
                    }
                ]
            })).toThrow(_rowlevelpermissionpredicateexception.RowLevelPermissionPredicateException);
    });
    it('rejects a workspaceMemberFieldMetadataId that is not a workspaceMember field', ()=>{
        expect(()=>validate({
                predicates: [
                    {
                        fieldMetadataId: ownerFieldMetadataId,
                        operand: _types.RowLevelPermissionPredicateOperand.IS,
                        workspaceMemberFieldMetadataId: ownerFieldMetadataId
                    }
                ]
            })).toThrow(_rowlevelpermissionpredicateexception.RowLevelPermissionPredicateException);
    });
    it('allows reusing an existing predicate id owned by the same role and object', ()=>{
        expect(()=>validate({
                predicates: [
                    {
                        ...ownerMatchesCurrentUserPredicate,
                        id: 'own-predicate-id'
                    }
                ],
                existingPredicates: [
                    {
                        id: 'own-predicate-id',
                        roleId,
                        objectMetadataId
                    }
                ]
            })).not.toThrow();
    });
    it('allows a predicate referencing a group declared in the same payload', ()=>{
        expect(()=>validate({
                predicates: [
                    {
                        ...ownerMatchesCurrentUserPredicate,
                        rowLevelPermissionPredicateGroupId: 'new-group-id'
                    }
                ],
                predicateGroups: [
                    {
                        id: 'new-group-id',
                        logicalOperator: 'AND'
                    }
                ]
            })).not.toThrow();
    });
});

//# sourceMappingURL=validate-row-level-permission-rule-ownership.util.spec.js.map