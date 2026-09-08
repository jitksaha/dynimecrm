"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isbillingexemptapplicationutil = require("../is-billing-exempt-application.util");
describe('isBillingExemptApplication', ()=>{
    it.each([
        '8da4b8b5-5edf-4880-b51f-ab6e679ec617',
        '66a504cc-0a75-410e-a43f-cdeae1db1522'
    ])('should return true for billing-exempt app %s', (universalIdentifier)=>{
        expect((0, _isbillingexemptapplicationutil.isBillingExemptApplication)(universalIdentifier)).toBe(true);
    });
    it('should return false for a non-exempt app', ()=>{
        expect((0, _isbillingexemptapplicationutil.isBillingExemptApplication)('97141c95-2870-5662-8992-44fb6536be9a')).toBe(false);
    });
});

//# sourceMappingURL=is-billing-exempt-application.util.spec.js.map