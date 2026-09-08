"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildcompanydomainnameupdatequeryutil = require("../build-company-domain-name-update-query.util");
describe('buildCompanyDomainNameUpdateQuery', ()=>{
    it('should send one statement carrying every row', ()=>{
        const { sql, parameters } = (0, _buildcompanydomainnameupdatequeryutil.buildCompanyDomainNameUpdateQuery)({
            schemaName: 'workspace_test',
            updates: [
                {
                    id: 'acme-id',
                    domainName: {
                        primaryLinkUrl: 'acme.com',
                        secondaryLinks: [
                            {
                                url: 'beta.com',
                                label: ''
                            }
                        ]
                    }
                },
                {
                    id: 'crm-id',
                    domainName: {
                        primaryLinkUrl: 'crm.dev',
                        secondaryLinks: null
                    }
                }
            ]
        });
        expect(sql).toContain('"workspace_test"."company"');
        expect(sql).toContain('unnest($1::uuid[], $2::text[], $3::jsonb[])');
        expect(parameters).toEqual([
            [
                'acme-id',
                'crm-id'
            ],
            [
                'acme.com',
                'crm.dev'
            ],
            [
                '[{"url":"beta.com","label":""}]',
                null
            ]
        ]);
    });
    it('should pass a null rather than a json null when a company has no secondary link', ()=>{
        const { parameters } = (0, _buildcompanydomainnameupdatequeryutil.buildCompanyDomainNameUpdateQuery)({
            schemaName: 'workspace_test',
            updates: [
                {
                    id: 'crm-id',
                    domainName: {
                        primaryLinkUrl: 'crm.dev',
                        secondaryLinks: null
                    }
                }
            ]
        });
        expect(parameters[2]).toEqual([
            null
        ]);
    });
});

//# sourceMappingURL=build-company-domain-name-update-query.util.spec.js.map