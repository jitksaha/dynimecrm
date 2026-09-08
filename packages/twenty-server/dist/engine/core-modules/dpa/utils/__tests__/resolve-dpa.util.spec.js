"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _dparegionconfigconstant = require("../../config/dpa-region-config.constant");
const _dpatemplateversionconstant = require("../../constants/dpa-template-version.constant");
const _subprocessorsjson = /*#__PURE__*/ _interop_require_default(require("../../constants/subprocessors.json"));
const _dparegionenum = require("../../enums/dpa-region.enum");
const _resolvedpautil = require("../resolve-dpa.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('resolveDpa', ()=>{
    it('defaults to EU hosting without changing the Processor entity or governing law', ()=>{
        const resolved = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionconfigconstant.DEFAULT_DPA_REGION,
            mode: 'preview'
        });
        expect(resolved.region).toBe('EU');
        expect(resolved.values.PROCESSOR_ENTITY).toBe('Twenty.com PBC');
        expect(resolved.values.PROCESSOR_LEGAL_FORM).toContain('Delaware');
        expect(resolved.values.EU_AFFILIATE_ENTITY).toBe('Twenty.com SAS');
        expect(resolved.values.EU_AFFILIATE_LEGAL_FORM).toContain('France');
        expect(resolved.values.HOSTING_REGION).toContain('Frankfurt');
        expect(resolved.values.GOVERNING_LAW).toBe('the State of Delaware, USA');
        expect(resolved.sccSectionActive).toBe(true);
        expect(resolved.templateVersion).toBe(_dpatemplateversionconstant.DPA_TEMPLATE_VERSION);
    });
    it('resolves US hosting with the same Processor and EU Affiliate', ()=>{
        const resolved = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.US,
            mode: 'preview'
        });
        expect(resolved.region).toBe('US');
        expect(resolved.values.PROCESSOR_ENTITY).toBe('Twenty.com PBC');
        expect(resolved.values.PROCESSOR_LEGAL_FORM).toContain('Delaware');
        expect(resolved.values.EU_AFFILIATE_ENTITY).toBe('Twenty.com SAS');
        expect(resolved.values.HOSTING_REGION).toBe('United States');
        expect(resolved.sccSectionActive).toBe(true);
    });
    it('keeps both Twenty entities and their roles independent of hosting region', ()=>{
        const eu = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'preview'
        });
        const us = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.US,
            mode: 'preview'
        });
        for (const resolved of [
            eu,
            us
        ]){
            expect(resolved.blocks[0].text).toContain('between Twenty.com PBC (');
            expect(resolved.blocks[0].text).toContain('Twenty.com SAS (“Twenty SAS” or “EU Affiliate”) joins this DPA');
            expect(resolved.blocks[0].text).toContain('Twenty SAS does not replace Twenty PBC as the Processor');
        }
    });
    it('keeps the SCC/transfer sections (7.2–7.5) in the document for BOTH regions (document is not branched)', ()=>{
        const eu = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'preview'
        });
        const us = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.US,
            mode: 'preview'
        });
        const headings = (blocks)=>blocks.filter((block)=>block.kind === 'heading').map((b)=>b.text);
        for (const resolved of [
            eu,
            us
        ]){
            const text = resolved.blocks.map((b)=>b.text).join('\n');
            expect(headings(resolved.blocks)).toContain('7. International Data Transfers');
            expect(text).toContain('7.2 European Data Transfers');
            expect(text).toContain('7.3 Transfers from Brazil');
            expect(text).toContain('7.4 Other Transfer Mechanisms');
            expect(text).toContain('7.5 Disclosure of SCCs');
        }
    });
    it('leaves no unresolved {{ }} merge fields for any region', ()=>{
        for (const region of Object.keys(_dparegionconfigconstant.DPA_REGION_CONFIGS)){
            const resolved = (0, _resolvedpautil.resolveDpa)({
                region,
                mode: 'signed'
            });
            expect((0, _resolvedpautil.findUnresolvedMergeFields)(resolved)).toEqual([]);
        }
    });
    it('only appends the execution / signature block in signed mode', ()=>{
        const preview = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'preview'
        });
        const signed = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'signed',
            customerLegalEntityName: 'Acme GmbH',
            signatory: {
                name: 'Jane Doe',
                title: 'CEO'
            },
            executedAt: '2026-06-26T00:00:00.000Z'
        });
        expect(preview.blocks.some((b)=>b.kind === 'signatureField')).toBe(false);
        const customerField = signed.blocks.find((b)=>b.kind === 'signatureField' && b.label === 'Customer (Controller)');
        expect(customerField?.value).toContain('Acme GmbH');
        expect(customerField?.value).toContain('Jane Doe');
        expect(customerField?.value).toContain('CEO');
        expect(signed.blocks.some((b)=>b.kind === 'signatureField' && b.label === 'Execution Date')).toBe(true);
        const processorField = signed.blocks.find((b)=>b.kind === 'signatureField' && b.label === 'Processor — Twenty.com PBC');
        const euAffiliateField = signed.blocks.find((b)=>b.kind === 'signatureField' && b.label === 'EU Affiliate — Twenty.com SAS');
        expect(processorField?.value).toContain('Signed on behalf of Twenty.com PBC');
        expect(euAffiliateField?.value).toContain('Signed on behalf of Twenty.com SAS');
    });
    it('marks self-hosted deployments as not a valid agreement', ()=>{
        const cloud = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'preview'
        });
        const selfHosted = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'preview',
            isSelfHosted: true
        });
        expect(cloud.notice).toBeUndefined();
        expect(selfHosted.notice).toContain('NOT A VALID AGREEMENT');
    });
    it('records the template version so we can prove what was agreed', ()=>{
        const signed = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.US,
            mode: 'signed'
        });
        const versionField = signed.blocks.find((b)=>b.kind === 'signatureField' && b.label === 'DPA template version');
        expect(versionField?.value).toContain(_dpatemplateversionconstant.DPA_TEMPLATE_VERSION);
    });
    const resolvedText = (region, mode)=>(0, _resolvedpautil.resolveDpa)({
            region,
            mode,
            customerLegalEntityName: 'Acme GmbH',
            signatory: {
                name: 'Jane Doe',
                title: 'Head of Legal'
            },
            executedAt: '2026-06-27T00:00:00.000Z'
        }).blocks.map((b)=>`${b.text}\n${b.label ?? ''}\n${b.value ?? ''}`).join('\n');
    it('resolves clean, article-free hosting region values per region', ()=>{
        expect((0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'preview'
        }).values.HOSTING_REGION).toBe('EU (Frankfurt, Germany)');
        expect((0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.US,
            mode: 'preview'
        }).values.HOSTING_REGION).toBe('United States');
        // Template phrasing "in the {{HOSTING_REGION}}" must not double the article.
        expect(resolvedText(_dparegionenum.DpaRegion.EU, 'signed')).toContain('in the EU (Frankfurt, Germany)');
        expect(resolvedText(_dparegionenum.DpaRegion.EU, 'signed')).not.toMatch(/\bthe the\b/);
    });
    it('has exactly one "7.1 Data Hosting and Localization:" heading', ()=>{
        const matches = resolvedText(_dparegionenum.DpaRegion.EU, 'signed').match(/7\.1 Data Hosting and Localization:/g) ?? [];
        expect(matches).toHaveLength(1);
    });
    it('leaks no internal drafting notes or placeholder tokens for either region', ()=>{
        for (const region of [
            _dparegionenum.DpaRegion.EU,
            _dparegionenum.DpaRegion.US
        ]){
            const text = resolvedText(region, 'signed');
            expect(text).not.toContain('(default:');
            expect(text).not.toContain('for US deployments');
            expect(text).not.toContain('LEGAL ENTITY');
            expect(text).not.toContain('SIGNATORY NAME');
        }
    });
    it('renders the DPO name and contact', ()=>{
        const text = resolvedText(_dparegionenum.DpaRegion.EU, 'signed');
        expect(text).toContain('Stéphanie Joly');
        expect(text).toContain('privacy@twenty.com');
    });
    it('states the §7.1 hosting location per region without contradicting the deployment', ()=>{
        const eu = resolvedText(_dparegionenum.DpaRegion.EU, 'signed');
        const us = resolvedText(_dparegionenum.DpaRegion.US, 'signed');
        for (const text of [
            eu,
            us
        ]){
            expect(text).not.toContain('primarily stored in data centers located in the European Union');
        }
        expect(eu).toContain('hosted in data centers in the EU (Frankfurt, Germany) via Amazon Web Services (AWS)');
        expect(us).toContain('hosted in data centers in the United States via Amazon Web Services (AWS)');
        expect(us).not.toContain('stored in data centers located in the European Union (Frankfurt, Germany)');
    });
    it('identifies PBC as Processor and data importer and SAS as EU Affiliate in Annex A', ()=>{
        for (const region of [
            _dparegionenum.DpaRegion.EU,
            _dparegionenum.DpaRegion.US
        ]){
            const text = resolvedText(region, 'signed');
            expect(text).toContain('Data Importer (Processor): Twenty.com PBC');
            expect(text).toContain('EU Affiliate: Twenty.com SAS');
            expect(text).toContain('without replacing Twenty.com PBC as Processor or data importer');
        }
    });
    it('includes a government / law enforcement request clause for both regions', ()=>{
        for (const region of [
            _dparegionenum.DpaRegion.EU,
            _dparegionenum.DpaRegion.US
        ]){
            const text = resolvedText(region, 'signed');
            expect(text).toContain('Government and Law Enforcement Requests');
            expect(text).toContain('will not voluntarily disclose');
            expect(text).toContain('back doors');
        }
    });
    it('states the SOC 2 Type II certification and does not claim ISO 27001', ()=>{
        const text = resolvedText(_dparegionenum.DpaRegion.EU, 'signed');
        expect(text).toContain('SOC 2 Type II');
        expect(text).not.toContain('ISO 27001');
    });
    it('renders Annex C with one entry per synced sub-processor and ties it to §6.1', ()=>{
        const text = resolvedText(_dparegionenum.DpaRegion.EU, 'signed');
        const { subprocessors } = _subprocessorsjson.default;
        expect(text).toContain('ANNEX C – List of Sub-Processors');
        expect(text).toContain('set out in Annex C');
        // Derive the expected entries from the synced data rather than hardcoding
        // vendor locations, which the trust-center sync action overwrites.
        for (const subprocessor of subprocessors){
            const vendorSuffix = subprocessor.vendorUrl ? ` (${subprocessor.vendorUrl})` : '';
            expect(text).toContain(`${subprocessor.name}${vendorSuffix} — Processing location(s):`);
        }
    });
    it('expands the sub-processor sentinel into exactly the synced entries', ()=>{
        const resolved = (0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'preview'
        });
        expect(resolved.blocks.some((b)=>b.kind === 'paragraph' && b.text === '')).toBe(false);
        const entries = resolved.blocks.filter((b)=>b.kind === 'paragraph' && / — Processing location\(s\): /.test(b.text));
        const expectedCount = _subprocessorsjson.default.subprocessors.length;
        expect(entries).toHaveLength(expectedCount);
    });
    it('never shows the self-hosted banner on an executed (signed) document', ()=>{
        expect((0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'preview',
            isSelfHosted: true
        }).notice).toContain('NOT A VALID AGREEMENT');
        expect((0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'signed',
            customerLegalEntityName: 'Acme GmbH',
            signatory: {
                name: 'Jane Doe',
                title: 'Head of Legal'
            },
            executedAt: '2026-06-27T00:00:00.000Z',
            isSelfHosted: true
        }).notice).toBeUndefined();
        expect((0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'preview',
            isSelfHosted: false
        }).notice).toBeUndefined();
    });
});

//# sourceMappingURL=resolve-dpa.util.spec.js.map