"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "renderDpaToHtml", {
    enumerable: true,
    get: function() {
        return renderDpaToHtml;
    }
});
const _escapehtmlutil = require("../../emailing-domain/utils/escape-html.util");
const renderMultiline = (value)=>(0, _escapehtmlutil.escapeHtml)(value).split('\n').filter((line)=>line.trim() !== '').map((line)=>`<span class="dpa-line">${line}</span>`).join('<br />');
const renderDpaToHtml = (resolved)=>{
    const parts = [];
    if (resolved.notice !== undefined) {
        parts.push(`<div class="dpa-notice" role="alert"><strong>${(0, _escapehtmlutil.escapeHtml)(resolved.notice)}</strong></div>`);
    }
    parts.push(`<h1 class="dpa-title">${(0, _escapehtmlutil.escapeHtml)(resolved.title)}</h1>`);
    parts.push(`<p class="dpa-last-updated">Last Updated: ${(0, _escapehtmlutil.escapeHtml)(resolved.lastUpdatedLabel)}</p>`);
    for (const block of resolved.blocks){
        if (block.kind === 'heading') {
            parts.push(`<h2>${(0, _escapehtmlutil.escapeHtml)(block.text)}</h2>`);
        } else if (block.kind === 'signatureField') {
            parts.push(`<div class="dpa-signature-field"><strong>${(0, _escapehtmlutil.escapeHtml)(block.label ?? '')}</strong><div>${renderMultiline(block.value ?? '')}</div></div>`);
        } else {
            parts.push(`<p>${(0, _escapehtmlutil.escapeHtml)(block.text)}</p>`);
        }
    }
    return `<article class="dpa-document">${parts.join('\n')}</article>`;
};

//# sourceMappingURL=render-dpa-to-html.util.js.map