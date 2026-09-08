// Bump BOTH values whenever the rendered legal text changes — i.e. when the
// verbatim template OR the resolved merge-field values (entities, addresses,
// governing law, …) change — so a version always maps to one exact agreement.
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
    get DPA_DOCUMENT_TITLE () {
        return DPA_DOCUMENT_TITLE;
    },
    get DPA_LAST_UPDATED_LABEL () {
        return DPA_LAST_UPDATED_LABEL;
    },
    get DPA_TEMPLATE_VERSION () {
        return DPA_TEMPLATE_VERSION;
    }
});
const DPA_TEMPLATE_VERSION = '2026-08';
const DPA_LAST_UPDATED_LABEL = 'August 2026';
const DPA_DOCUMENT_TITLE = 'Twenty Data Processing Agreement (DPA)';

//# sourceMappingURL=dpa-template-version.constant.js.map