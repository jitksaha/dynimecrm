"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _computecompanydomainnamerewritesutil = require("../compute-company-domain-name-rewrites.util");
const _partitioncompanydomainnamerewritesutil = require("../partition-company-domain-name-rewrites.util");
const candidate = (id, primaryLinkUrl, secondaryLinks = null)=>({
        id,
        domainName: {
            primaryLinkUrl,
            secondaryLinks
        }
    });
const partition = (candidates, claimedPrimaryLinkUrls = [])=>(0, _partitioncompanydomainnamerewritesutil.partitionCompanyDomainNameRewrites)({
        rewrites: (0, _computecompanydomainnamerewritesutil.computeCompanyDomainNameRewrites)(candidates),
        claimedPrimaryLinkUrls: new Set(claimedPrimaryLinkUrls)
    });
describe('partitionCompanyDomainNameRewrites', ()=>{
    it('should rewrite a company whose only stale link is a secondary one', ()=>{
        const { updates, skippedCompanyIds } = partition([
            candidate('acme', 'acme.com', [
                {
                    url: 'https://www.beta.com',
                    label: 'Merged away'
                }
            ])
        ]);
        expect(skippedCompanyIds).toEqual([]);
        expect(updates).toEqual([
            {
                id: 'acme',
                domainName: {
                    primaryLinkUrl: 'acme.com',
                    secondaryLinks: [
                        {
                            url: 'beta.com',
                            label: 'Merged away'
                        }
                    ]
                }
            }
        ]);
    });
    it('should skip a company whose normalized domain another company already holds', ()=>{
        const { updates, skippedCompanyIds } = partition([
            candidate('prefixed', 'https://www.acme.com')
        ], [
            'acme.com'
        ]);
        expect(updates).toEqual([]);
        expect(skippedCompanyIds).toEqual([
            'prefixed'
        ]);
    });
    it('should skip the second of two candidates that collapse onto the same domain', ()=>{
        const { updates, skippedCompanyIds } = partition([
            candidate('first', 'https://acme.com'),
            candidate('second', 'https://www.acme.com/careers')
        ]);
        expect(updates.map(({ id })=>id)).toEqual([
            'first'
        ]);
        expect(skippedCompanyIds).toEqual([
            'second'
        ]);
    });
    it('should leave companies that are already canonical alone', ()=>{
        expect(partition([
            candidate('acme', 'acme.com', [
                {
                    url: 'beta.com',
                    label: ''
                }
            ])
        ])).toEqual({
            updates: [],
            skippedCompanyIds: []
        });
    });
});

//# sourceMappingURL=partition-company-domain-name-rewrites.util.spec.js.map