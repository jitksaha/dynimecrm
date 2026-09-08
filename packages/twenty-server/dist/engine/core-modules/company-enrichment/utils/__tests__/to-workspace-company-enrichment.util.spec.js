"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workspacecompanyenrichmentfieldmaxlengthconstant = require("../../constants/workspace-company-enrichment-field-max-length.constant");
const _workspacecompanyenrichmentmaxtagsconstant = require("../../constants/workspace-company-enrichment-max-tags.constant");
const _workspacecompanyenrichmentsummarymaxlengthconstant = require("../../constants/workspace-company-enrichment-summary-max-length.constant");
const _toworkspacecompanyenrichmentutil = require("../to-workspace-company-enrichment.util");
describe('toWorkspaceCompanyEnrichment', ()=>{
    const domain = 'acme.com';
    const enrichedAt = new Date('2026-07-21T10:00:00.000Z');
    it('should cap the summary at the maximum length', ()=>{
        const result = (0, _toworkspacecompanyenrichmentutil.toWorkspaceCompanyEnrichment)({
            domain,
            enrichedAt,
            data: {
                summary: 'a'.repeat(_workspacecompanyenrichmentsummarymaxlengthconstant.WORKSPACE_COMPANY_ENRICHMENT_SUMMARY_MAX_LENGTH + 1)
            }
        });
        expect(result?.summary).toHaveLength(_workspacecompanyenrichmentsummarymaxlengthconstant.WORKSPACE_COMPANY_ENRICHMENT_SUMMARY_MAX_LENGTH);
    });
    it('should cap the tags at the maximum count', ()=>{
        const result = (0, _toworkspacecompanyenrichmentutil.toWorkspaceCompanyEnrichment)({
            domain,
            enrichedAt,
            data: {
                tags: Array.from({
                    length: 12
                }, (_, index)=>`tag-${index}`)
            }
        });
        expect(result?.tags).toHaveLength(_workspacecompanyenrichmentmaxtagsconstant.WORKSPACE_COMPANY_ENRICHMENT_MAX_TAGS);
    });
    it('should prefer display_name over name', ()=>{
        const result = (0, _toworkspacecompanyenrichmentutil.toWorkspaceCompanyEnrichment)({
            domain,
            enrichedAt,
            data: {
                name: 'acme inc',
                display_name: 'Acme Inc'
            }
        });
        expect(result?.name).toBe('Acme Inc');
    });
    it('should fall back to name when display_name is empty', ()=>{
        const result = (0, _toworkspacecompanyenrichmentutil.toWorkspaceCompanyEnrichment)({
            domain,
            enrichedAt,
            data: {
                name: 'acme inc',
                display_name: ''
            }
        });
        expect(result?.name).toBe('acme inc');
    });
    it('should flatten the location', ()=>{
        const result = (0, _toworkspacecompanyenrichmentutil.toWorkspaceCompanyEnrichment)({
            domain,
            enrichedAt,
            data: {
                location: {
                    locality: 'San Francisco',
                    region: 'California',
                    country: 'United States'
                }
            }
        });
        expect(result).toMatchObject({
            locality: 'San Francisco',
            region: 'California',
            country: 'United States'
        });
    });
    it('should sanitize provider data through the shared sanitizer', ()=>{
        const result = (0, _toworkspacecompanyenrichmentutil.toWorkspaceCompanyEnrichment)({
            domain,
            enrichedAt,
            data: {
                name: `Acme${String.fromCharCode(0)}Inc`,
                headline: 'a'.repeat(_workspacecompanyenrichmentfieldmaxlengthconstant.WORKSPACE_COMPANY_ENRICHMENT_FIELD_MAX_LENGTH + 100)
            }
        });
        expect(result?.name).toBe('Acme Inc');
        expect(result?.headline).toHaveLength(_workspacecompanyenrichmentfieldmaxlengthconstant.WORKSPACE_COMPANY_ENRICHMENT_FIELD_MAX_LENGTH);
    });
    it('should null every absent field and keep tags an empty array', ()=>{
        const result = (0, _toworkspacecompanyenrichmentutil.toWorkspaceCompanyEnrichment)({
            domain,
            enrichedAt,
            data: {}
        });
        expect(result).toEqual({
            domain,
            enrichedAt: enrichedAt.toISOString(),
            name: null,
            website: null,
            industry: null,
            employeeCount: null,
            size: null,
            founded: null,
            headline: null,
            summary: null,
            tags: [],
            locality: null,
            region: null,
            country: null
        });
    });
});

//# sourceMappingURL=to-workspace-company-enrichment.util.spec.js.map