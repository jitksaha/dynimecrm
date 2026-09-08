"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _createemptyflatentitymapsconstant = require("../../../metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _buildrowlevelpermissionrecordfilterutil = require("../build-row-level-permission-record-filter.util");
const OBJECT_ID = 'object-1';
const FIELD_ID = 'field-1';
const USER_ROLE_ID = 'user-role-1';
const APPLICATION_ROLE_ID = 'application-role-1';
const UNRESTRICTED_ROLE_ID = 'unrestricted-role-1';
const buildMaps = (entities)=>entities.reduce((maps, entity)=>(0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
            flatEntity: entity,
            flatEntityMaps: maps
        }), (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)());
const flatObjectMetadata = {
    id: OBJECT_ID,
    nameSingular: 'thing',
    namePlural: 'things',
    fieldIds: [
        FIELD_ID
    ],
    fieldUniversalIdentifiers: [
        FIELD_ID
    ]
};
const flatFieldMetadataMaps = buildMaps([
    {
        id: FIELD_ID,
        universalIdentifier: FIELD_ID,
        name: 'name',
        type: _types.FieldMetadataType.TEXT,
        objectMetadataId: OBJECT_ID
    }
]);
const buildPredicate = (id, roleId, value)=>({
        id,
        universalIdentifier: id,
        roleId,
        objectMetadataId: OBJECT_ID,
        fieldMetadataId: FIELD_ID,
        operand: 'CONTAINS',
        value,
        subFieldName: null,
        workspaceMemberFieldMetadataId: null,
        workspaceMemberSubFieldName: null,
        rowLevelPermissionPredicateGroupId: null,
        positionInRowLevelPermissionPredicateGroup: null,
        deletedAt: null
    });
const flatRowLevelPermissionPredicateMaps = buildMaps([
    buildPredicate('predicate-user', USER_ROLE_ID, 'visible-to-user'),
    buildPredicate('predicate-application', APPLICATION_ROLE_ID, 'visible-to-application')
]);
const flatRowLevelPermissionPredicateGroupMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
const build = (roleIds)=>(0, _buildrowlevelpermissionrecordfilterutil.buildRowLevelPermissionRecordFilter)({
        flatRowLevelPermissionPredicateMaps,
        flatRowLevelPermissionPredicateGroupMaps,
        flatFieldMetadataMaps,
        objectMetadata: flatObjectMetadata,
        roleIds
    });
describe('buildRowLevelPermissionRecordFilter', ()=>{
    it('should return null when no role is given', ()=>{
        expect(build([])).toBeNull();
    });
    it('should return null when the role has no predicates', ()=>{
        expect(build([
            UNRESTRICTED_ROLE_ID
        ])).toBeNull();
    });
    it('should return the role filter as-is for a single role', ()=>{
        expect(build([
            USER_ROLE_ID
        ])).toEqual({
            name: {
                ilike: '%visible-to-user%'
            }
        });
    });
    it('should keep the restriction when the other role is unrestricted', ()=>{
        expect(build([
            USER_ROLE_ID,
            UNRESTRICTED_ROLE_ID
        ])).toEqual({
            name: {
                ilike: '%visible-to-user%'
            }
        });
    });
    it('should require both roles to be satisfied when both restrict', ()=>{
        expect(build([
            USER_ROLE_ID,
            APPLICATION_ROLE_ID
        ])).toEqual({
            and: [
                {
                    name: {
                        ilike: '%visible-to-user%'
                    }
                },
                {
                    name: {
                        ilike: '%visible-to-application%'
                    }
                }
            ]
        });
    });
});

//# sourceMappingURL=build-row-level-permission-record-filter.util.spec.js.map