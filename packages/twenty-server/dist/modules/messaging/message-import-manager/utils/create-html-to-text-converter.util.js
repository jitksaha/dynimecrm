"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createHtmlToTextConverter", {
    enumerable: true,
    get: function() {
        return createHtmlToTextConverter;
    }
});
const _dompurify = /*#__PURE__*/ _interop_require_default(require("dompurify"));
const _htmltotext = require("html-to-text");
const _jsdom = require("jsdom");
const _planer = /*#__PURE__*/ _interop_require_wildcard(require("planer"));
const _guards = require("@sniptt/guards");
const _normalizemessagetextutil = require("./normalize-message-text.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const CONVERT_OPTIONS = {
    wordwrap: false,
    preserveNewlines: true
};
const createHtmlToTextConverter = ()=>{
    const jsdom = new _jsdom.JSDOM('');
    const purify = (0, _dompurify.default)(jsdom.window);
    return (html)=>{
        const sanitizedHtml = purify.sanitize(html);
        const cleanedHtml = _planer.extractFromHtml(sanitizedHtml, jsdom.window.document);
        const text = (0, _normalizemessagetextutil.normalizeMessageText)((0, _htmltotext.convert)(cleanedHtml, CONVERT_OPTIONS));
        // planer can strip an entirely-quoted (e.g. forwarded) body to nothing;
        // fall back to the un-stripped sanitized html so the body is not lost.
        return (0, _guards.isNonEmptyString)(text) ? text : (0, _normalizemessagetextutil.normalizeMessageText)((0, _htmltotext.convert)(sanitizedHtml, CONVERT_OPTIONS));
    };
};

//# sourceMappingURL=create-html-to-text-converter.util.js.map