"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _utils = require("twenty-shared/utils");
const _prefillcompaniesutil = require("../prefill-companies.util");
describe('prefillCompanies', ()=>{
    it('should seed domain names in the shape a domain-typed links field stores', ()=>{
        const notCanonical = _prefillcompaniesutil.PREFILL_COMPANY_ROWS.map(({ domainNamePrimaryLinkUrl })=>domainNamePrimaryLinkUrl).filter((domainName)=>(0, _utils.normalizeDomain)(domainName) !== domainName);
        expect(notCanonical).toEqual([]);
    });
});

//# sourceMappingURL=prefill-companies.util.spec.js.map