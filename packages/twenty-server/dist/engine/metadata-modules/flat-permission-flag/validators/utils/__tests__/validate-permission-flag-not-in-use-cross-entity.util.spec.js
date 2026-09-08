"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _createemptyflatentitymapsconstant = require("../../../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _validatepermissionflagnotinusecrossentityutil = require("../validate-permission-flag-not-in-use-cross-entity.util");
const _permissionflagexception = require("../../../../permission-flag/permission-flag.exception");
const FLAG_UNIVERSAL_IDENTIFIER = '00000000-0000-0000-0000-000000000001';
const buildRolePermissionFlag = (overrides = {})=>({
        id: '00000000-0000-0000-0000-000000000101',
        universalIdentifier: '00000000-0000-0000-0000-000000000101',
        permissionFlagId: FLAG_UNIVERSAL_IDENTIFIER,
        permissionFlagUniversalIdentifier: FLAG_UNIVERSAL_IDENTIFIER,
        roleUniversalIdentifier: '00000000-0000-0000-0000-000000000201',
        workspaceId: 'workspace-id',
        applicationId: '00000000-0000-0000-0000-000000000aaa',
        applicationUniversalIdentifier: '00000000-0000-0000-0000-000000000aaa',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...overrides
    });
const buildRolePermissionFlagMaps = (rolePermissionFlags = [])=>{
    const maps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
    for (const rolePermissionFlag of rolePermissionFlags){
        maps.byUniversalIdentifier[rolePermissionFlag.universalIdentifier] = rolePermissionFlag;
    }
    return maps;
};
const buildArgs = (args)=>({
        optimisticUniversalFlatMaps: {
            flatRolePermissionFlagMaps: buildRolePermissionFlagMaps(args.rolePermissionFlags)
        },
        deletedPermissionFlagActions: args.deletedFlagUniversalIdentifiers.map((universalIdentifier)=>({
                type: 'delete',
                metadataName: 'permissionFlag',
                universalIdentifier,
                flatEntity: {
                    universalIdentifier,
                    key: 'MANAGE_INVOICES'
                }
            }))
    });
describe('validatePermissionFlagNotInUseCrossEntity', ()=>{
    it('returns no error when no permission flag is being deleted', ()=>{
        const result = (0, _validatepermissionflagnotinusecrossentityutil.validatePermissionFlagNotInUseCrossEntity)(buildArgs({
            rolePermissionFlags: [
                buildRolePermissionFlag()
            ],
            deletedFlagUniversalIdentifiers: []
        }));
        expect(result.permissionFlag).toHaveLength(0);
    });
    it('rejects deleting a flag still referenced by a role in the target state', ()=>{
        const result = (0, _validatepermissionflagnotinusecrossentityutil.validatePermissionFlagNotInUseCrossEntity)(buildArgs({
            rolePermissionFlags: [
                buildRolePermissionFlag()
            ],
            deletedFlagUniversalIdentifiers: [
                FLAG_UNIVERSAL_IDENTIFIER
            ]
        }));
        expect(result.permissionFlag.flatMap((failure)=>failure.errors.map((error)=>error.code))).toEqual([
            _permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_IN_USE
        ]);
    });
    it('allows deleting a flag whose assignments are deleted in the same migration', ()=>{
        const result = (0, _validatepermissionflagnotinusecrossentityutil.validatePermissionFlagNotInUseCrossEntity)(buildArgs({
            rolePermissionFlags: [],
            deletedFlagUniversalIdentifiers: [
                FLAG_UNIVERSAL_IDENTIFIER
            ]
        }));
        expect(result.permissionFlag).toHaveLength(0);
    });
});

//# sourceMappingURL=validate-permission-flag-not-in-use-cross-entity.util.spec.js.map