"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "jsonPreview", {
    enumerable: true,
    get: function() {
        return jsonPreview;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _formatbytesutil = require("./format-bytes.util");
const PREVIEW_MAX_DEPTH = 4;
const PREVIEW_MAX_ARRAY_ITEMS = 3;
const PREVIEW_LEAF_STRING_LENGTH = 200;
const KEY_COLLAPSE_THRESHOLD = 5;
const PREVIEW_HARD_CAP_BYTES = 2048;
const boundScalar = (value)=>{
    if ((0, _guards.isString)(value)) {
        const byteLength = Buffer.byteLength(value);
        if (value.length > PREVIEW_LEAF_STRING_LENGTH) {
            return `${value.slice(0, PREVIEW_LEAF_STRING_LENGTH)}… (truncated, ${(0, _formatbytesutil.formatBytes)(byteLength)} total)`;
        }
    }
    return value;
};
const shapeSignature = (value)=>{
    if (Array.isArray(value)) {
        return 'array';
    }
    if ((0, _utils.isDefined)(value) && (0, _guards.isObject)(value)) {
        return `object:${Object.keys(value).sort().join(',')}`;
    }
    if ((0, _guards.isNull)(value)) {
        return 'null';
    }
    return typeof value;
};
const buildPreview = (value, maxDepth, depth)=>{
    if ((0, _guards.isNull)(value) || !(0, _guards.isObject)(value)) {
        return boundScalar(value);
    }
    if (depth >= maxDepth) {
        return Array.isArray(value) ? `array[${value.length}]` : 'object';
    }
    if (Array.isArray(value)) {
        const limited = value.slice(0, PREVIEW_MAX_ARRAY_ITEMS).map((item)=>buildPreview(item, maxDepth, depth + 1));
        if (value.length > PREVIEW_MAX_ARRAY_ITEMS) {
            limited.push(`... (${value.length - PREVIEW_MAX_ARRAY_ITEMS} more items)`);
        }
        return limited;
    }
    const entries = Object.entries(value);
    if (entries.length > KEY_COLLAPSE_THRESHOLD) {
        const signatures = new Set(entries.map(([, val])=>shapeSignature(val)));
        if (signatures.size === 1) {
            const [representativeKey, representativeValue] = entries[0];
            return {
                [representativeKey]: buildPreview(representativeValue, maxDepth, depth + 1),
                [`... (${entries.length - 1} more keys)`]: '...'
            };
        }
    }
    const output = {};
    for (const [key, child] of entries){
        output[key] = buildPreview(child, maxDepth, depth + 1);
    }
    return output;
};
const jsonPreview = (value)=>{
    let maxDepth = PREVIEW_MAX_DEPTH;
    let preview = buildPreview(value, maxDepth, 0);
    while(maxDepth > 1 && Buffer.byteLength(JSON.stringify(preview) ?? '') > PREVIEW_HARD_CAP_BYTES){
        maxDepth -= 1;
        preview = buildPreview(value, maxDepth, 0);
    }
    return preview;
};

//# sourceMappingURL=json-preview.util.js.map