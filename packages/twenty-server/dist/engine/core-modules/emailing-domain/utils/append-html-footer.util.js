"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "appendHtmlFooter", {
    enumerable: true,
    get: function() {
        return appendHtmlFooter;
    }
});
const appendHtmlFooter = (html, footer)=>{
    const closingBodyIndex = html.search(/<\/body>(?![\s\S]*<\/body>)/i);
    if (closingBodyIndex !== -1) {
        return html.slice(0, closingBodyIndex) + footer + html.slice(closingBodyIndex);
    }
    const closingHtmlIndex = html.search(/<\/html>(?![\s\S]*<\/html>)/i);
    if (closingHtmlIndex !== -1) {
        return html.slice(0, closingHtmlIndex) + footer + html.slice(closingHtmlIndex);
    }
    return `${html}${footer}`;
};

//# sourceMappingURL=append-html-footer.util.js.map