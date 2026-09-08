"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _fromentitytoscalarentityutil = require("../from-entity-to-scalar-entity.util");
const buildArgs = (metadataName, entity)=>({
        metadataName,
        entity: entity
    });
describe('fromEntityToScalarEntity', ()=>{
    it('should return the registered scalar properties along with the base columns', ()=>{
        const result = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)(buildArgs('permissionFlag', {
            id: 'permission-flag-id-1',
            workspaceId: 'workspace-id-1',
            applicationId: 'app-id-1',
            universalIdentifier: 'permission-flag-ui-1',
            key: 'IMPERSONATE',
            label: 'Impersonate',
            description: 'Allows impersonation',
            icon: 'IconUser',
            permissionType: 'WORKSPACE',
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-02T00:00:00.000Z')
        }));
        expect(result).toEqual({
            id: 'permission-flag-id-1',
            workspaceId: 'workspace-id-1',
            applicationId: 'app-id-1',
            universalIdentifier: 'permission-flag-ui-1',
            key: 'IMPERSONATE',
            label: 'Impersonate',
            description: 'Allows impersonation',
            icon: 'IconUser',
            permissionType: 'WORKSPACE',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z'
        });
    });
    it('should drop relation objects, regrouped one-to-many arrays and any unregistered property', ()=>{
        const result = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)(buildArgs('permissionFlag', {
            id: 'permission-flag-id-1',
            workspaceId: 'workspace-id-1',
            applicationId: 'app-id-1',
            universalIdentifier: 'permission-flag-ui-1',
            key: 'IMPERSONATE',
            label: 'Impersonate',
            description: 'Allows impersonation',
            icon: 'IconUser',
            permissionType: 'WORKSPACE',
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-02T00:00:00.000Z'),
            workspace: {
                id: 'workspace-id-1'
            },
            application: {
                id: 'app-id-1'
            },
            rolePermissionFlags: [
                {
                    id: 'role-permission-flag-id-1'
                }
            ],
            someTransientProperty: 'should-not-leak'
        }));
        expect(Object.keys(result).sort()).toEqual([
            'id',
            'workspaceId',
            'applicationId',
            'universalIdentifier',
            'key',
            'label',
            'description',
            'icon',
            'permissionType',
            'createdAt',
            'updatedAt'
        ].sort());
        expect(result).not.toHaveProperty('workspace');
        expect(result).not.toHaveProperty('application');
        expect(result).not.toHaveProperty('rolePermissionFlags');
        expect(result).not.toHaveProperty('someTransientProperty');
    });
    it('should keep many-to-one foreign key columns while dropping their relation objects', ()=>{
        const result = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)(buildArgs('viewSort', {
            id: 'view-sort-id-1',
            workspaceId: 'workspace-id-1',
            applicationId: 'app-id-1',
            universalIdentifier: 'view-sort-ui-1',
            direction: 'ASC',
            subFieldName: null,
            fieldMetadataId: 'field-id-1',
            viewId: 'view-id-1',
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-02T00:00:00.000Z'),
            deletedAt: null,
            fieldMetadata: {
                id: 'field-id-1'
            },
            view: {
                id: 'view-id-1'
            }
        }));
        expect(result.fieldMetadataId).toBe('field-id-1');
        expect(result.viewId).toBe('view-id-1');
        expect(result).not.toHaveProperty('fieldMetadata');
        expect(result).not.toHaveProperty('view');
    });
    it('should serialize Date columns to ISO strings while leaving null dates untouched', ()=>{
        const result = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)(buildArgs('viewSort', {
            id: 'view-sort-id-1',
            workspaceId: 'workspace-id-1',
            applicationId: 'app-id-1',
            universalIdentifier: 'view-sort-ui-1',
            direction: 'ASC',
            subFieldName: null,
            fieldMetadataId: 'field-id-1',
            viewId: 'view-id-1',
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-02T00:00:00.000Z'),
            deletedAt: null
        }));
        expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
        expect(result.updatedAt).toBe('2024-01-02T00:00:00.000Z');
        expect(result.deletedAt).toBeNull();
    });
    it('should normalize absent properties to null instead of undefined', ()=>{
        const result = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)(buildArgs('permissionFlag', {
            id: 'permission-flag-id-1',
            key: 'IMPERSONATE',
            label: 'Impersonate',
            description: 'Allows impersonation',
            icon: 'IconUser',
            permissionType: 'WORKSPACE',
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-02T00:00:00.000Z')
        }));
        expect(result).toHaveProperty('workspaceId', null);
        expect(result).toHaveProperty('applicationId', null);
        expect(result).toHaveProperty('universalIdentifier', null);
        expect(Object.values(result)).not.toContain(undefined);
    });
    it('should keep explicit null values and normalize undefined ones to null', ()=>{
        const result = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)(buildArgs('viewSort', {
            id: 'view-sort-id-1',
            workspaceId: 'workspace-id-1',
            applicationId: null,
            universalIdentifier: 'view-sort-ui-1',
            direction: 'ASC',
            subFieldName: null,
            fieldMetadataId: 'field-id-1',
            viewId: 'view-id-1',
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-02T00:00:00.000Z'),
            deletedAt: undefined
        }));
        expect(result).toHaveProperty('applicationId', null);
        expect(result).toHaveProperty('subFieldName', null);
        expect(result).toHaveProperty('deletedAt', null);
    });
});

//# sourceMappingURL=from-entity-to-scalar-entity.util.spec.js.map