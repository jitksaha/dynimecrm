"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _permissionflagexception = require("../../../../../../metadata-modules/permission-flag/permission-flag.exception");
const _validateflatpermissionflagcreationutil = require("../validate-flat-permission-flag-creation.util");
const _flatpermissionflagvalidationtestutil = require("./flat-permission-flag-validation.test-util");
describe('validateFlatPermissionFlagCreation', ()=>{
    it('should return no error for a valid permission flag', ()=>{
        const result = (0, _validateflatpermissionflagcreationutil.validateFlatPermissionFlagCreation)((0, _flatpermissionflagvalidationtestutil.buildCreationArgs)({
            flatEntityToValidate: (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
                universalIdentifier: 'new-flag',
                key: 'CAN_DO_THING'
            })
        }));
        expect(result.errors).toEqual([]);
        expect(result.type).toBe('create');
        expect(result.metadataName).toBe('permissionFlag');
    });
    it('should report an error when the universal identifier already exists', ()=>{
        const existing = (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
            universalIdentifier: 'existing-flag',
            key: 'CAN_DO_THING'
        });
        const result = (0, _validateflatpermissionflagcreationutil.validateFlatPermissionFlagCreation)((0, _flatpermissionflagvalidationtestutil.buildCreationArgs)({
            flatEntityToValidate: (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
                universalIdentifier: 'existing-flag',
                key: 'CAN_DO_OTHER_THING'
            }),
            existingFlags: [
                existing
            ]
        }));
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].code).toBe(_permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_ALREADY_EXISTS);
    });
    it('should report an error when the key is empty', ()=>{
        const result = (0, _validateflatpermissionflagcreationutil.validateFlatPermissionFlagCreation)((0, _flatpermissionflagvalidationtestutil.buildCreationArgs)({
            flatEntityToValidate: (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
                universalIdentifier: 'new-flag',
                key: ''
            })
        }));
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].code).toBe(_permissionflagexception.PermissionFlagExceptionCode.INVALID_PERMISSION_FLAG_KEY);
    });
    it('should report an error when another flag already registered the same key', ()=>{
        const result = (0, _validateflatpermissionflagcreationutil.validateFlatPermissionFlagCreation)((0, _flatpermissionflagvalidationtestutil.buildCreationArgs)({
            flatEntityToValidate: (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
                universalIdentifier: 'new-flag',
                key: 'CAN_DO_THING'
            }),
            existingFlags: [
                (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
                    universalIdentifier: 'other-app-flag',
                    key: 'CAN_DO_THING'
                })
            ]
        }));
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].code).toBe(_permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_ALREADY_EXISTS);
        expect(result.errors[0].message).toContain('CAN_DO_THING');
    });
    it('should report an error for an unsupported permission type', ()=>{
        const result = (0, _validateflatpermissionflagcreationutil.validateFlatPermissionFlagCreation)((0, _flatpermissionflagvalidationtestutil.buildCreationArgs)({
            flatEntityToValidate: (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
                universalIdentifier: 'new-flag',
                key: 'CAN_DO_THING',
                permissionType: 'not-a-permission-type'
            })
        }));
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].code).toBe(_permissionflagexception.PermissionFlagExceptionCode.INVALID_PERMISSION_FLAG_PERMISSION_TYPE);
    });
    it('should accumulate every violation rather than stopping at the first', ()=>{
        const result = (0, _validateflatpermissionflagcreationutil.validateFlatPermissionFlagCreation)((0, _flatpermissionflagvalidationtestutil.buildCreationArgs)({
            flatEntityToValidate: (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
                universalIdentifier: 'existing-flag',
                key: '',
                permissionType: 'not-a-permission-type'
            }),
            existingFlags: [
                (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
                    universalIdentifier: 'existing-flag',
                    key: 'CAN_DO_THING'
                })
            ]
        }));
        expect(result.errors.map((error)=>error.code)).toEqual([
            _permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_ALREADY_EXISTS,
            _permissionflagexception.PermissionFlagExceptionCode.INVALID_PERMISSION_FLAG_KEY,
            _permissionflagexception.PermissionFlagExceptionCode.INVALID_PERMISSION_FLAG_PERMISSION_TYPE
        ]);
    });
    it('should not flag a key collision against itself', ()=>{
        const flag = (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
            universalIdentifier: 'same-flag',
            key: 'CAN_DO_THING'
        });
        const result = (0, _validateflatpermissionflagcreationutil.validateFlatPermissionFlagCreation)((0, _flatpermissionflagvalidationtestutil.buildCreationArgs)({
            flatEntityToValidate: flag,
            existingFlags: [
                flag
            ]
        }));
        expect(result.errors.map((error)=>error.code)).toEqual([
            _permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_ALREADY_EXISTS
        ]);
        expect(result.errors[0].message).toContain('universal identifier');
    });
});

//# sourceMappingURL=validate-flat-permission-flag-creation.util.spec.js.map