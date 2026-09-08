"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resolveregistrationidbyapplicationidutil = require("../resolve-registration-id-by-application-id.util");
const STANDARD_APPLICATION_ID = '20202020-0000-0000-0000-000000000001';
const INSTALLED_APPLICATION_ID = '20202020-0000-0000-0000-000000000002';
const UNREGISTERED_APPLICATION_ID = '20202020-0000-0000-0000-000000000003';
const INSTALLED_REGISTRATION_ID = '30303030-0000-0000-0000-000000000002';
const flatApplicationMaps = {
    byId: {
        [STANDARD_APPLICATION_ID]: {
            applicationRegistrationId: null
        },
        [INSTALLED_APPLICATION_ID]: {
            applicationRegistrationId: INSTALLED_REGISTRATION_ID
        },
        [UNREGISTERED_APPLICATION_ID]: {
            applicationRegistrationId: null
        }
    }
};
const resolve = (applicationIds)=>(0, _resolveregistrationidbyapplicationidutil.resolveRegistrationIdByApplicationId)({
        applicationIds,
        flatApplicationMaps,
        standardApplicationId: STANDARD_APPLICATION_ID
    });
describe('resolveRegistrationIdByApplicationId', ()=>{
    it('should map an installed application to its registration', ()=>{
        expect([
            ...resolve([
                INSTALLED_APPLICATION_ID
            ])
        ]).toEqual([
            [
                INSTALLED_APPLICATION_ID,
                INSTALLED_REGISTRATION_ID
            ]
        ]);
    });
    it('should skip the standard application', ()=>{
        expect(resolve([
            STANDARD_APPLICATION_ID
        ]).size).toBe(0);
    });
    it('should skip an application with no registration', ()=>{
        expect(resolve([
            UNREGISTERED_APPLICATION_ID
        ]).size).toBe(0);
    });
    it('should skip an unknown application', ()=>{
        expect(resolve([
            'unknown-application-id'
        ]).size).toBe(0);
    });
    it('should skip entities with no application', ()=>{
        expect(resolve([
            undefined
        ]).size).toBe(0);
    });
    it('should dedupe repeated application ids', ()=>{
        expect(resolve([
            INSTALLED_APPLICATION_ID,
            INSTALLED_APPLICATION_ID,
            STANDARD_APPLICATION_ID
        ]).size).toBe(1);
    });
});

//# sourceMappingURL=resolve-registration-id-by-application-id.util.spec.js.map