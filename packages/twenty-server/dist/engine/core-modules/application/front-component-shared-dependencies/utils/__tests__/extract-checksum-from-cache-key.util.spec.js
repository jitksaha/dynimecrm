"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _extractchecksumfromcachekeyutil = require("../extract-checksum-from-cache-key.util");
const VALID_CHECKSUM = 'a'.repeat(64);
describe('extractChecksumFromCacheKey', ()=>{
    it('extracts the checksum from a fingerprinted cache key', ()=>{
        expect((0, _extractchecksumfromcachekeyutil.extractChecksumFromCacheKey)(`${VALID_CHECKSUM}.js`)).toBe(VALID_CHECKSUM);
    });
    it.each([
        [
            'no cache key',
            undefined
        ],
        [
            'a non-checksum segment',
            `${'z'.repeat(64)}.js`
        ],
        [
            'a path traversal',
            `../${VALID_CHECKSUM}.js`
        ]
    ])('fails closed on %s', (_label, cacheKey)=>{
        expect((0, _extractchecksumfromcachekeyutil.extractChecksumFromCacheKey)(cacheKey)).toBeUndefined();
    });
});

//# sourceMappingURL=extract-checksum-from-cache-key.util.spec.js.map