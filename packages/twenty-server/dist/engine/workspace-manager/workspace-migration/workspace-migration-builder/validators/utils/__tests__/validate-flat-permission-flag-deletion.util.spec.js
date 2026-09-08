"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _permissionflagexception = require("../../../../../../metadata-modules/permission-flag/permission-flag.exception");
const _validateflatpermissionflagdeletionutil = require("../validate-flat-permission-flag-deletion.util");
const _flatpermissionflagvalidationtestutil = require("./flat-permission-flag-validation.test-util");
describe('validateFlatPermissionFlagDeletion', ()=>{
    it('should return no error when deleting an existing custom flag', ()=>{
        const flag = (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
            universalIdentifier: 'existing-flag',
            key: 'CAN_DO_THING'
        });
        const result = (0, _validateflatpermissionflagdeletionutil.validateFlatPermissionFlagDeletion)((0, _flatpermissionflagvalidationtestutil.buildCreationArgs)({
            flatEntityToValidate: flag,
            existingFlags: [
                flag
            ]
        }));
        expect(result.errors).toEqual([]);
        expect(result.type).toBe('delete');
    });
    it('should report not-found when the flag does not exist', ()=>{
        const result = (0, _validateflatpermissionflagdeletionutil.validateFlatPermissionFlagDeletion)((0, _flatpermissionflagvalidationtestutil.buildCreationArgs)({
            flatEntityToValidate: (0, _flatpermissionflagvalidationtestutil.buildFlatPermissionFlag)({
                universalIdentifier: 'missing-flag',
                key: 'CAN_DO_THING'
            }),
            existingFlags: []
        }));
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].code).toBe(_permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_NOT_FOUND);
    });
    it('should reject a non-standard caller deleting a standard flag', ()=>{
        const standardFlag = (0, _flatpermissionflagvalidationtestutil.buildStandardAppFlatPermissionFlag)({
            universalIdentifier: 'standard-flag',
            key: 'CAN_DO_STANDARD_THING'
        });
        const result = (0, _validateflatpermissionflagdeletionutil.validateFlatPermissionFlagDeletion)((0, _flatpermissionflagvalidationtestutil.buildCreationArgs)({
            flatEntityToValidate: standardFlag,
            existingFlags: [
                standardFlag
            ],
            isCallerStandardApp: false
        }));
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].code).toBe(_permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_IS_STANDARD);
    });
    it('should let the standard app delete its own standard flag', ()=>{
        const standardFlag = (0, _flatpermissionflagvalidationtestutil.buildStandardAppFlatPermissionFlag)({
            universalIdentifier: 'standard-flag',
            key: 'CAN_DO_STANDARD_THING'
        });
        const result = (0, _validateflatpermissionflagdeletionutil.validateFlatPermissionFlagDeletion)((0, _flatpermissionflagvalidationtestutil.buildCreationArgs)({
            flatEntityToValidate: standardFlag,
            existingFlags: [
                standardFlag
            ],
            isCallerStandardApp: true
        }));
        expect(result.errors).toEqual([]);
    });
});

//# sourceMappingURL=validate-flat-permission-flag-deletion.util.spec.js.map