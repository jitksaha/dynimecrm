"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _truncateheadtailutil = require("../truncate-head-tail.util");
describe('truncateHeadTail', ()=>{
    const guidance = 'Use a narrower query.';
    it('returns the text unchanged when under the byte budget', ()=>{
        const text = 'short output';
        expect((0, _truncateheadtailutil.truncateHeadTail)({
            text,
            maxBytes: 1000,
            guidance
        })).toBe(text);
    });
    it('keeps the head and tail around a marker and respects the byte budget', ()=>{
        const text = `HEAD${'x'.repeat(5000)}TAIL`;
        const truncated = (0, _truncateheadtailutil.truncateHeadTail)({
            text,
            maxBytes: 1000,
            guidance
        });
        expect(Buffer.byteLength(truncated)).toBeLessThanOrEqual(1000);
        expect(truncated.startsWith('HEAD')).toBe(true);
        expect(truncated.endsWith('TAIL')).toBe(true);
        expect(truncated).toContain('TRUNCATED');
        expect(truncated).toContain(`${Buffer.byteLength(text)} bytes`);
        expect(truncated).toContain(guidance);
    });
    it('does not split multibyte characters at the cut points', ()=>{
        const text = '€'.repeat(4000);
        const truncated = (0, _truncateheadtailutil.truncateHeadTail)({
            text,
            maxBytes: 1000,
            guidance
        });
        expect(Buffer.byteLength(truncated)).toBeLessThanOrEqual(1000);
        expect(truncated).not.toContain('�');
    });
    it('does not split surrogate pairs at the cut points', ()=>{
        const text = '😀'.repeat(4000);
        const truncated = (0, _truncateheadtailutil.truncateHeadTail)({
            text,
            maxBytes: 1000,
            guidance
        });
        expect(Buffer.byteLength(truncated)).toBeLessThanOrEqual(1000);
        expect(truncated).not.toContain('�');
    });
});

//# sourceMappingURL=truncate-head-tail.util.spec.js.map