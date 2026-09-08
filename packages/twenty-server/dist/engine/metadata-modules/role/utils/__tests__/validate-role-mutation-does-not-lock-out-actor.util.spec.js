"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _constants = require("twenty-shared/constants");
const _permissionsexception = require("../../../permissions/permissions.exception");
const _validaterolemutationdoesnotlockoutactorutil = require("../validate-role-mutation-does-not-lock-out-actor.util");
const actingRoleId = 'acting-role-id';
const createFlatRole = (overrides)=>({
        id: actingRoleId,
        label: 'Manager',
        isEditable: true,
        canUpdateAllSettings: true,
        rolePermissionFlagIds: [],
        ...overrides
    });
const emptyFlagMaps = {
    byUniversalIdentifier: {},
    universalIdentifierById: {}
};
describe('validateRoleDeletionDoesNotLockOutActorOrThrow', ()=>{
    it('throws when deleting a role the actor holds', ()=>{
        expect(()=>(0, _validaterolemutationdoesnotlockoutactorutil.validateRoleDeletionDoesNotLockOutActorOrThrow)({
                flatRole: createFlatRole({}),
                actingRoleIds: [
                    actingRoleId
                ]
            })).toThrow(_permissionsexception.PermissionsException);
    });
    it('allows deleting a role the actor does not hold', ()=>{
        expect(()=>(0, _validaterolemutationdoesnotlockoutactorutil.validateRoleDeletionDoesNotLockOutActorOrThrow)({
                flatRole: createFlatRole({
                    id: 'other-role-id'
                }),
                actingRoleIds: [
                    actingRoleId
                ]
            })).not.toThrow();
    });
    it('allows deletion when no acting roles are provided (system caller)', ()=>{
        expect(()=>(0, _validaterolemutationdoesnotlockoutactorutil.validateRoleDeletionDoesNotLockOutActorOrThrow)({
                flatRole: createFlatRole({}),
                actingRoleIds: undefined
            })).not.toThrow();
    });
});
describe('validateRoleUpdateDoesNotLockOutActorOrThrow', ()=>{
    it('throws when revoking settings access from a role the actor holds', ()=>{
        expect(()=>(0, _validaterolemutationdoesnotlockoutactorutil.validateRoleUpdateDoesNotLockOutActorOrThrow)({
                flatRole: createFlatRole({}),
                canUpdateAllSettingsUpdate: false,
                actingRoleIds: [
                    actingRoleId
                ],
                flatRolePermissionFlagMaps: emptyFlagMaps
            })).toThrow(_permissionsexception.PermissionsException);
    });
    it('allows the revocation when the role keeps an explicit ROLES permission flag', ()=>{
        const rolePermissionFlagId = 'role-permission-flag-id';
        const flagMaps = {
            byUniversalIdentifier: {
                [rolePermissionFlagId]: {
                    id: rolePermissionFlagId,
                    permissionFlagUniversalIdentifier: _constants.SystemPermissionFlag.ROLES
                }
            },
            universalIdentifierById: {
                [rolePermissionFlagId]: rolePermissionFlagId
            }
        };
        expect(()=>(0, _validaterolemutationdoesnotlockoutactorutil.validateRoleUpdateDoesNotLockOutActorOrThrow)({
                flatRole: createFlatRole({
                    rolePermissionFlagIds: [
                        rolePermissionFlagId
                    ]
                }),
                canUpdateAllSettingsUpdate: false,
                actingRoleIds: [
                    actingRoleId
                ],
                flatRolePermissionFlagMaps: flagMaps
            })).not.toThrow();
    });
    it('allows revoking settings access on a role the actor does not hold', ()=>{
        expect(()=>(0, _validaterolemutationdoesnotlockoutactorutil.validateRoleUpdateDoesNotLockOutActorOrThrow)({
                flatRole: createFlatRole({
                    id: 'other-role-id'
                }),
                canUpdateAllSettingsUpdate: false,
                actingRoleIds: [
                    actingRoleId
                ],
                flatRolePermissionFlagMaps: emptyFlagMaps
            })).not.toThrow();
    });
    it('allows updates that do not touch settings access', ()=>{
        expect(()=>(0, _validaterolemutationdoesnotlockoutactorutil.validateRoleUpdateDoesNotLockOutActorOrThrow)({
                flatRole: createFlatRole({}),
                canUpdateAllSettingsUpdate: undefined,
                actingRoleIds: [
                    actingRoleId
                ],
                flatRolePermissionFlagMaps: emptyFlagMaps
            })).not.toThrow();
    });
    it('allows the update when no acting roles are provided (system caller)', ()=>{
        expect(()=>(0, _validaterolemutationdoesnotlockoutactorutil.validateRoleUpdateDoesNotLockOutActorOrThrow)({
                flatRole: createFlatRole({}),
                canUpdateAllSettingsUpdate: false,
                actingRoleIds: undefined,
                flatRolePermissionFlagMaps: emptyFlagMaps
            })).not.toThrow();
    });
});

//# sourceMappingURL=validate-role-mutation-does-not-lock-out-actor.util.spec.js.map