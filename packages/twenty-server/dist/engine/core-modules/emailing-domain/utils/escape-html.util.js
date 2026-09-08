"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "escapeHtml", {
    enumerable: true,
    get: function() {
        return escapeHtml;
    }
});
const HTML_ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};
const escapeHtml = (value)=>value.replace(/[&<>"']/g, (character)=>HTML_ESCAPES[character]);

//# sourceMappingURL=escape-html.util.js.map