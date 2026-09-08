"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "renderDpaToPdfBuffer", {
    enumerable: true,
    get: function() {
        return renderDpaToPdfBuffer;
    }
});
const _renderer = require("@react-pdf/renderer");
const _dpapdfdocument = require("./dpa-pdf-document");
const renderDpaToPdfBuffer = (resolved)=>(0, _renderer.renderToBuffer)((0, _dpapdfdocument.buildDpaPdfDocumentElement)(resolved));

//# sourceMappingURL=render-dpa-to-pdf.util.js.map