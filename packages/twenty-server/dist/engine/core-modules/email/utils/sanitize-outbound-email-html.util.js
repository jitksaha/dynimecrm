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
    get sanitizeOutboundEmailHtml () {
        return sanitizeOutboundEmailHtml;
    },
    get sanitizeOutboundEmailSubject () {
        return sanitizeOutboundEmailSubject;
    }
});
const _dompurify = /*#__PURE__*/ _interop_require_default(require("dompurify"));
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
let purifierPromise;
const MAX_DOCTYPE_LENGTH = 512;
const SUBJECT_CONTROL_CHARACTERS_PATTERN = /[\u0000-\u001f\u007f\u0080-\u009f]+/g;
const isWhitespace = (character)=>character !== undefined && /\s/u.test(character);
const findDoctypeEnd = (html, start)=>{
    const searchEnd = Math.min(html.length, start + MAX_DOCTYPE_LENGTH);
    let quote;
    for(let cursor = start + '<!doctype'.length; cursor < searchEnd; cursor++){
        const character = html[cursor];
        if (quote !== undefined) {
            if (character === quote) {
                quote = undefined;
            }
            continue;
        }
        if (character === '"' || character === "'") {
            quote = character;
        } else if (character === '>') {
            return cursor;
        }
    }
    return undefined;
};
const isHtmlDoctype = (doctype)=>{
    let cursor = '<!doctype'.length;
    if (!isWhitespace(doctype[cursor])) {
        return false;
    }
    while(isWhitespace(doctype[cursor])){
        cursor += 1;
    }
    return doctype.slice(cursor, cursor + 'html'.length).toLowerCase() === 'html' && (doctype[cursor + 'html'.length] === '>' || isWhitespace(doctype[cursor + 'html'.length]));
};
const inspectHtmlDocumentPreamble = (html)=>{
    let cursor = 0;
    while(cursor < html.length){
        while(isWhitespace(html[cursor])){
            cursor += 1;
        }
        if (!html.startsWith('<!--', cursor)) {
            break;
        }
        const commentEnd = html.indexOf('-->', cursor + 4);
        if (commentEnd === -1) {
            return {
                isWholeDocument: false
            };
        }
        cursor = commentEnd + 3;
    }
    const normalizedStart = html.slice(cursor, cursor + 10).toLowerCase();
    const startsWithDoctype = normalizedStart.startsWith('<!doctype') && (html[cursor + 9] === '>' || isWhitespace(html[cursor + 9]));
    if (startsWithDoctype) {
        const doctypeEnd = findDoctypeEnd(html, cursor);
        const doctype = doctypeEnd !== undefined ? html.slice(cursor, doctypeEnd + 1) : undefined;
        return {
            isWholeDocument: true,
            ...doctype !== undefined && isHtmlDoctype(doctype) && {
                doctype
            }
        };
    }
    return {
        isWholeDocument: normalizedStart.startsWith('<html') && (html[cursor + 5] === '>' || isWhitespace(html[cursor + 5]))
    };
};
const getPurifier = ()=>{
    purifierPromise ??= Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("jsdom"))).then(({ JSDOM })=>{
        const purifier = (0, _dompurify.default)(new JSDOM('').window);
        purifier.addHook('uponSanitizeAttribute', (node, attribute)=>{
            if (node.nodeName === 'META' && attribute.attrName === 'http-equiv' && attribute.attrValue.trim().toLowerCase() !== 'content-type') {
                attribute.keepAttr = false;
            }
        });
        return purifier;
    });
    return purifierPromise;
};
const sanitizeOutboundEmailHtml = async (html)=>{
    const preamble = inspectHtmlDocumentPreamble(html);
    const sanitizedHtml = (await getPurifier()).sanitize(html, {
        WHOLE_DOCUMENT: preamble.isWholeDocument,
        ...preamble.isWholeDocument && {
            ADD_TAGS: [
                'meta'
            ],
            ADD_ATTR: [
                'charset',
                'content',
                'http-equiv',
                'name'
            ]
        }
    });
    // DOMPurify intentionally removes document types and comments. Restore the
    // inert doctype so email clients stay in standards mode; conditional comments
    // remain stripped because preserving arbitrary commented markup would create
    // a sanitizer bypass for raw HTML blocks and legacy bodies.
    return preamble.doctype === undefined ? sanitizedHtml : `${preamble.doctype}${sanitizedHtml}`;
};
const sanitizeOutboundEmailSubject = async (subject)=>{
    const sanitizedSubject = (await getPurifier()).sanitize(subject, {
        ALLOWED_ATTR: [],
        ALLOWED_TAGS: [],
        RETURN_DOM_FRAGMENT: true
    });
    return (sanitizedSubject.textContent ?? '').replace(SUBJECT_CONTROL_CHARACTERS_PATTERN, ' ');
};

//# sourceMappingURL=sanitize-outbound-email-html.util.js.map