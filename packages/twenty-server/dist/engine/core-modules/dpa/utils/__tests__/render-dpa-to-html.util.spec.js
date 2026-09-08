"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _dparegionenum = require("../../enums/dpa-region.enum");
const _resolvedpautil = require("../resolve-dpa.util");
const _renderdpatohtmlutil = require("../render-dpa-to-html.util");
// Synthetic doc to test the conditional-clause mechanism in isolation: the real template branches no clauses.
const buildResolvedWithConditionalBlock = (sccSectionActive)=>({
        region: sccSectionActive ? _dparegionenum.DpaRegion.US : _dparegionenum.DpaRegion.EU,
        templateVersion: 'test',
        lastUpdatedLabel: 'August 2026',
        title: 'Test DPA',
        sccSectionActive,
        values: {
            PROCESSOR_ENTITY: 'Twenty.com PBC',
            PROCESSOR_LEGAL_FORM: 'x',
            PROCESSOR_ADDRESS: 'x',
            EU_AFFILIATE_ENTITY: 'Twenty.com SAS',
            EU_AFFILIATE_LEGAL_FORM: 'x',
            EU_AFFILIATE_ADDRESS: 'x',
            HOSTING_REGION: 'x',
            GOVERNING_LAW: 'x',
            DPO_NAME_AND_CONTACT: 'x'
        },
        blocks: [
            {
                kind: 'heading',
                text: 'Always Present'
            },
            ...sccSectionActive ? [
                {
                    kind: 'paragraph',
                    text: 'CONDITIONAL_SCC_ONLY_BLOCK'
                }
            ] : []
        ]
    });
describe('renderDpaToHtml', ()=>{
    const baseContext = {
        region: _dparegionenum.DpaRegion.EU,
        mode: 'preview'
    };
    it('renders the title and last-updated line', ()=>{
        const html = (0, _renderdpatohtmlutil.renderDpaToHtml)((0, _resolvedpautil.resolveDpa)(baseContext));
        expect(html).toContain('Twenty Data Processing Agreement (DPA)');
        expect(html).toContain('Last Updated: August 2026');
    });
    it('contains no unresolved {{ }} merge fields in the output', ()=>{
        for (const region of [
            _dparegionenum.DpaRegion.EU,
            _dparegionenum.DpaRegion.US
        ]){
            const html = (0, _renderdpatohtmlutil.renderDpaToHtml)((0, _resolvedpautil.resolveDpa)({
                region,
                mode: 'signed'
            }));
            expect(html).not.toMatch(/\{\{[^}]+\}\}/);
        }
    });
    it('toggles conditional clauses correctly via the includeWhen mechanism', ()=>{
        const dormant = (0, _renderdpatohtmlutil.renderDpaToHtml)(buildResolvedWithConditionalBlock(false));
        const active = (0, _renderdpatohtmlutil.renderDpaToHtml)(buildResolvedWithConditionalBlock(true));
        expect(dormant).not.toContain('CONDITIONAL_SCC_ONLY_BLOCK');
        expect(active).toContain('CONDITIONAL_SCC_ONLY_BLOCK');
        expect(dormant).toContain('Always Present');
        expect(active).toContain('Always Present');
    });
    it('escapes HTML in legal text to prevent injection', ()=>{
        const resolved = {
            ...buildResolvedWithConditionalBlock(false),
            blocks: [
                {
                    kind: 'paragraph',
                    text: '<script>alert(1)</script>'
                }
            ]
        };
        const html = (0, _renderdpatohtmlutil.renderDpaToHtml)(resolved);
        expect(html).not.toContain('<script>');
        expect(html).toContain('&lt;script&gt;');
    });
    it('renders the executed signatory and both Twenty entities in signed mode', ()=>{
        const html = (0, _renderdpatohtmlutil.renderDpaToHtml)((0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'signed',
            customerLegalEntityName: 'Acme GmbH',
            signatory: {
                name: 'Jane Doe',
                title: 'CEO'
            },
            executedAt: '2026-06-26T00:00:00.000Z'
        }));
        expect(html).toContain('Acme GmbH');
        expect(html).toContain('Jane Doe');
        expect(html).toContain('Twenty.com PBC');
        expect(html).toContain('Twenty.com SAS');
    });
    it('renders a clean cloud DPA: no merge tokens, drafting notes, placeholders, or self-hosted banner', ()=>{
        const html = (0, _renderdpatohtmlutil.renderDpaToHtml)((0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'signed',
            customerLegalEntityName: 'Acme GmbH',
            signatory: {
                name: 'Jane Doe',
                title: 'Head of Legal'
            },
            executedAt: '2026-06-27T00:00:00.000Z',
            isSelfHosted: false
        }));
        for (const forbidden of [
            '{{',
            '(default:',
            'for US deployments',
            'the the',
            'NOT A VALID AGREEMENT',
            'LEGAL ENTITY',
            'SIGNATORY NAME'
        ]){
            expect(html).not.toContain(forbidden);
        }
        expect(html).toContain('Stéphanie Joly');
        expect(html.match(/7\.1 Data Hosting and Localization:/g) ?? []).toHaveLength(1);
    });
    it('shows the self-hosted banner for a self-hosted deployment but not for cloud', ()=>{
        const selfHosted = (0, _renderdpatohtmlutil.renderDpaToHtml)((0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'preview',
            isSelfHosted: true
        }));
        const cloud = (0, _renderdpatohtmlutil.renderDpaToHtml)((0, _resolvedpautil.resolveDpa)({
            region: _dparegionenum.DpaRegion.EU,
            mode: 'preview',
            isSelfHosted: false
        }));
        expect(selfHosted).toContain('NOT A VALID AGREEMENT');
        expect(cloud).not.toContain('NOT A VALID AGREEMENT');
    });
});

//# sourceMappingURL=render-dpa-to-html.util.spec.js.map