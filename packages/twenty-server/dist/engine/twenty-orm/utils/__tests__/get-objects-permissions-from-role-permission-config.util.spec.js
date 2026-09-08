"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getobjectspermissionsfromrolepermissionconfigutil = require("../get-objects-permissions-from-role-permission-config.util");
const OBJECT_ID = 'object-1';
const agentRolePermissions = {
    [OBJECT_ID]: {
        canReadObjectRecords: true,
        canUpdateObjectRecords: false,
        canSoftDeleteObjectRecords: false,
        canDestroyObjectRecords: false,
        restrictedFields: {},
        rowLevelPermissionPredicates: [],
        rowLevelPermissionPredicateGroups: []
    }
};
const defaultRolePermissions = {
    [OBJECT_ID]: {
        canReadObjectRecords: false,
        canUpdateObjectRecords: false,
        canSoftDeleteObjectRecords: false,
        canDestroyObjectRecords: false,
        restrictedFields: {},
        rowLevelPermissionPredicates: [],
        rowLevelPermissionPredicateGroups: []
    }
};
const rolesPermissions = {
    'agent-role-id': agentRolePermissions,
    'default-role-id': defaultRolePermissions
};
describe('getObjectsPermissionsFromRolePermissionConfig', ()=>{
    it('should resolve a single union role', ()=>{
        expect((0, _getobjectspermissionsfromrolepermissionconfigutil.getObjectsPermissionsFromRolePermissionConfig)({
            rolesPermissions,
            rolePermissionConfig: {
                unionOf: [
                    'agent-role-id'
                ]
            }
        })).toEqual(agentRolePermissions);
    });
    it('should resolve a single intersection role', ()=>{
        expect((0, _getobjectspermissionsfromrolepermissionconfigutil.getObjectsPermissionsFromRolePermissionConfig)({
            rolesPermissions,
            rolePermissionConfig: {
                intersectionOf: [
                    'default-role-id'
                ]
            }
        })).toEqual(defaultRolePermissions);
    });
    it('should intersect every role when several are provided', ()=>{
        expect((0, _getobjectspermissionsfromrolepermissionconfigutil.getObjectsPermissionsFromRolePermissionConfig)({
            rolesPermissions,
            rolePermissionConfig: {
                intersectionOf: [
                    'agent-role-id',
                    'default-role-id'
                ]
            }
        })).toEqual(defaultRolePermissions);
    });
    it('should not grant a permission that only one of the roles allows', ()=>{
        expect((0, _getobjectspermissionsfromrolepermissionconfigutil.getObjectsPermissionsFromRolePermissionConfig)({
            rolesPermissions,
            rolePermissionConfig: {
                intersectionOf: [
                    'default-role-id',
                    'agent-role-id'
                ]
            }
        })[OBJECT_ID].canReadObjectRecords).toBe(false);
    });
    it('should deny when one of the intersected roles is missing from the cache', ()=>{
        expect((0, _getobjectspermissionsfromrolepermissionconfigutil.getObjectsPermissionsFromRolePermissionConfig)({
            rolesPermissions,
            rolePermissionConfig: {
                intersectionOf: [
                    'agent-role-id',
                    'missing-role-id'
                ]
            }
        })).toEqual({});
    });
    it('should return empty permissions when bypassing checks', ()=>{
        expect((0, _getobjectspermissionsfromrolepermissionconfigutil.getObjectsPermissionsFromRolePermissionConfig)({
            rolesPermissions,
            rolePermissionConfig: {
                shouldBypassPermissionChecks: true
            }
        })).toEqual({});
    });
    it('should return empty permissions when the role is missing from the cache', ()=>{
        expect((0, _getobjectspermissionsfromrolepermissionconfigutil.getObjectsPermissionsFromRolePermissionConfig)({
            rolesPermissions,
            rolePermissionConfig: {
                unionOf: [
                    'missing-role-id'
                ]
            }
        })).toEqual({});
    });
});

//# sourceMappingURL=get-objects-permissions-from-role-permission-config.util.spec.js.map