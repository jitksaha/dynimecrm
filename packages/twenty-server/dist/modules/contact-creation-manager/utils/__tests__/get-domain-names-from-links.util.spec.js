"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getdomainnamesfromlinksutil = require("../get-domain-names-from-links.util");
describe('getDomainNamesFromLinks', ()=>{
    it('should return the primary domain and every secondary domain', ()=>{
        expect((0, _getdomainnamesfromlinksutil.getDomainNamesFromLinks)({
            primaryLinkLabel: '',
            primaryLinkUrl: 'twenty.com',
            secondaryLinks: [
                {
                    url: 'twenty-crm.com',
                    label: ''
                },
                {
                    url: 'crm.dev',
                    label: ''
                }
            ]
        })).toEqual([
            'twenty.com',
            'twenty-crm.com',
            'crm.dev'
        ]);
    });
    it('should ignore links without url', ()=>{
        expect((0, _getdomainnamesfromlinksutil.getDomainNamesFromLinks)({
            primaryLinkLabel: '',
            primaryLinkUrl: '',
            secondaryLinks: [
                {
                    url: '',
                    label: 'Old domain'
                }
            ]
        })).toEqual([]);
    });
    it('should return an empty list when the company has no domain name', ()=>{
        expect((0, _getdomainnamesfromlinksutil.getDomainNamesFromLinks)(null)).toEqual([]);
    });
});

//# sourceMappingURL=get-domain-names-from-links.util.spec.js.map