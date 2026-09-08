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
    get TRUNCATION_SENTINEL () {
        return TRUNCATION_SENTINEL;
    },
    get truncateStringToUtf8ByteBudget () {
        return truncateStringToUtf8ByteBudget;
    },
    get utf8ByteLengthOf () {
        return utf8ByteLengthOf;
    }
});
const TRUNCATION_SENTINEL = '…[truncated]';
const utf8ByteLengthOf = (value)=>Buffer.byteLength(value, 'utf8');
const truncateStringToUtf8ByteBudget = (value, maxBytes)=>{
    const originalBytes = utf8ByteLengthOf(value);
    if (originalBytes <= maxBytes) {
        return {
            value,
            originalBytes,
            truncated: false
        };
    }
    const truncated = Buffer.from(value, 'utf8').subarray(0, maxBytes).toString('utf8');
    return {
        value: `${truncated}${TRUNCATION_SENTINEL}`,
        originalBytes,
        truncated: true
    };
};

//# sourceMappingURL=truncate-string-to-utf8-byte-budget.util.js.map