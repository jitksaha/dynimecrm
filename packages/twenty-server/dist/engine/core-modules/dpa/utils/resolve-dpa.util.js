"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get findUnresolvedMergeFields () {
        return findUnresolvedMergeFields;
    },
    get resolveDpa () {
        return resolveDpa;
    }
});
const _dparegionconfigconstant = require("../config/dpa-region-config.constant");
const _dpatemplateconstant = require("../constants/dpa-template.constant");
const _dpatemplateversionconstant = require("../constants/dpa-template-version.constant");
const _subprocessorsjson = /*#__PURE__*/ _interop_require_default(require("../constants/subprocessors.json"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const MERGE_FIELD_PATTERN = /\{\{([A-Z_]+)\}\}/g;
const COUNTRY_NAMES = {
    US: 'United States',
    DE: 'Germany',
    FR: 'France'
};
const formatLocations = (codes)=>codes.map((code)=>COUNTRY_NAMES[code] ?? code).join(', ');
const SUBPROCESSOR_BLOCKS = _subprocessorsjson.default.subprocessors.map((subprocessor)=>({
        kind: 'paragraph',
        text: `${subprocessor.name}${subprocessor.vendorUrl ? ` (${subprocessor.vendorUrl})` : ''} — Processing location(s): ${formatLocations(subprocessor.processingLocations)}. ${subprocessor.services.join(' ')}`
    }));
const SELF_HOSTED_NOTICE = 'NOT A VALID AGREEMENT — SELF-HOSTED DEPLOYMENT. This Twenty instance is self-hosted. For self-hosted deployments Twenty does not host or process Customer Personal Data and is not the Processor, so this Data Processing Agreement does not apply. This copy is generated for reference only and does not constitute an executed agreement with Twenty.';
// Unknown fields are left untouched so they surface in the unresolved-merge-field test instead of vanishing silently.
const fillMergeFields = (text, values)=>text.replace(MERGE_FIELD_PATTERN, (match, fieldName)=>fieldName in values ? values[fieldName] : match);
const buildExecutionBlocks = (context, values)=>{
    const blocks = [
        {
            kind: 'heading',
            text: 'Execution'
        },
        {
            kind: 'paragraph',
            text: `This Data Processing Agreement is executed by the parties as set out below. Acceptance constitutes execution of this DPA (and, where applicable, the Standard Contractual Clauses incorporated by reference) as of the Execution Date, in accordance with Section 13.6.`
        },
        {
            kind: 'signatureField',
            text: '',
            label: `Processor — ${values.PROCESSOR_ENTITY}`,
            value: `Signed on behalf of ${values.PROCESSOR_ENTITY} (pre-signed by Twenty)\nName: ${_dparegionconfigconstant.TWENTY_PRESIGNED_SIGNATORY.name}\nTitle: ${_dparegionconfigconstant.TWENTY_PRESIGNED_SIGNATORY.title}`
        },
        {
            kind: 'signatureField',
            text: '',
            label: `EU Affiliate — ${values.EU_AFFILIATE_ENTITY}`,
            value: `Signed on behalf of ${values.EU_AFFILIATE_ENTITY} (pre-signed by Twenty)\nName: ${_dparegionconfigconstant.TWENTY_PRESIGNED_SIGNATORY.name}\nTitle: ${_dparegionconfigconstant.TWENTY_PRESIGNED_SIGNATORY.title}`
        },
        {
            kind: 'signatureField',
            text: '',
            label: 'Customer (Controller)',
            value: `Legal entity: ${context.customerLegalEntityName ?? ''}\nName: ${context.signatory?.name ?? ''}\nTitle: ${context.signatory?.title ?? ''}`
        },
        {
            kind: 'signatureField',
            text: '',
            label: 'Execution Date',
            value: context.executedAt ?? ''
        },
        {
            kind: 'signatureField',
            text: '',
            label: 'DPA template version',
            value: `${_dpatemplateversionconstant.DPA_TEMPLATE_VERSION} (Last Updated: ${_dpatemplateversionconstant.DPA_LAST_UPDATED_LABEL})`
        }
    ];
    return blocks;
};
const resolveDpa = (context)=>{
    const config = (0, _dparegionconfigconstant.getDpaRegionConfig)(context.region);
    const bodyBlocks = _dpatemplateconstant.DPA_TEMPLATE_BLOCKS.filter((block)=>block.includeWhen === undefined || block.includeWhen === 'sccSectionActive' && config.sccSectionActive).flatMap((block)=>block.expand === 'subprocessorList' ? SUBPROCESSOR_BLOCKS : [
            {
                kind: block.kind,
                text: fillMergeFields(block.text, config.values)
            }
        ]);
    const executionBlocks = context.mode === 'signed' ? buildExecutionBlocks(context, config.values) : [];
    return {
        region: config.region,
        templateVersion: _dpatemplateversionconstant.DPA_TEMPLATE_VERSION,
        lastUpdatedLabel: _dpatemplateversionconstant.DPA_LAST_UPDATED_LABEL,
        title: _dpatemplateversionconstant.DPA_DOCUMENT_TITLE,
        sccSectionActive: config.sccSectionActive,
        values: {
            ...config.values
        },
        blocks: [
            ...bodyBlocks,
            ...executionBlocks
        ],
        // Banner only in preview: an executed/signed copy must never also say the DPA does not apply.
        notice: context.isSelfHosted === true && context.mode !== 'signed' ? SELF_HOSTED_NOTICE : undefined
    };
};
const findUnresolvedMergeFields = (resolved)=>{
    const unresolved = new Set();
    for (const block of resolved.blocks){
        const haystack = `${block.text}\n${block.value ?? ''}`;
        const matches = haystack.match(/\{\{[^}]+\}\}/g);
        if (matches) {
            for (const match of matches){
                unresolved.add(match);
            }
        }
    }
    return [
        ...unresolved
    ];
};

//# sourceMappingURL=resolve-dpa.util.js.map