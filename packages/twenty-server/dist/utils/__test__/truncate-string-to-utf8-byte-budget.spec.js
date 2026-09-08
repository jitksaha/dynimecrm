"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _truncatestringtoutf8bytebudgetutil = require("../truncate-string-to-utf8-byte-budget.util");
describe('utf8ByteLengthOf', ()=>{
    it('returns the UTF-8 byte length, not the UTF-16 code unit count', ()=>{
        expect((0, _truncatestringtoutf8bytebudgetutil.utf8ByteLengthOf)('a')).toBe(1);
        expect((0, _truncatestringtoutf8bytebudgetutil.utf8ByteLengthOf)('é')).toBe(2);
        expect((0, _truncatestringtoutf8bytebudgetutil.utf8ByteLengthOf)('日')).toBe(3);
        expect((0, _truncatestringtoutf8bytebudgetutil.utf8ByteLengthOf)('😀')).toBe(4);
    });
});
describe('truncateStringToUtf8ByteBudget', ()=>{
    it('returns the input unchanged when under the byte budget', ()=>{
        const result = (0, _truncatestringtoutf8bytebudgetutil.truncateStringToUtf8ByteBudget)('hello', 100);
        expect(result).toEqual({
            value: 'hello',
            originalBytes: 5,
            truncated: false
        });
    });
    it('returns the input unchanged exactly at the byte budget', ()=>{
        const result = (0, _truncatestringtoutf8bytebudgetutil.truncateStringToUtf8ByteBudget)('hello', 5);
        expect(result.truncated).toBe(false);
        expect(result.value).toBe('hello');
    });
    it('truncates ASCII content and appends the sentinel', ()=>{
        const result = (0, _truncatestringtoutf8bytebudgetutil.truncateStringToUtf8ByteBudget)('x'.repeat(100), 10);
        expect(result.truncated).toBe(true);
        expect(result.originalBytes).toBe(100);
        expect(result.value).toBe(`${'x'.repeat(10)}${_truncatestringtoutf8bytebudgetutil.TRUNCATION_SENTINEL}`);
    });
    it('reports originalBytes in UTF-8 bytes for non-ASCII content', ()=>{
        const result = (0, _truncatestringtoutf8bytebudgetutil.truncateStringToUtf8ByteBudget)('日'.repeat(1_000), 30);
        expect(result.originalBytes).toBe(3_000);
        expect(result.truncated).toBe(true);
    });
    it('truncates CJK content within budget rather than 3× over (regression)', ()=>{
        const cjk = '日'.repeat(40_000);
        const cap = 32_000;
        const result = (0, _truncatestringtoutf8bytebudgetutil.truncateStringToUtf8ByteBudget)(cjk, cap);
        const truncatedPayloadBytes = (0, _truncatestringtoutf8bytebudgetutil.utf8ByteLengthOf)(result.value.replace(_truncatestringtoutf8bytebudgetutil.TRUNCATION_SENTINEL, ''));
        expect(truncatedPayloadBytes).toBeLessThanOrEqual(cap + 3);
        expect(truncatedPayloadBytes).toBeGreaterThan(cap - 3);
    });
    it('handles emoji (surrogate pair, 4 UTF-8 bytes) without exceeding the budget', ()=>{
        const emoji = '😀'.repeat(10_000);
        const cap = 4_000;
        const result = (0, _truncatestringtoutf8bytebudgetutil.truncateStringToUtf8ByteBudget)(emoji, cap);
        const truncatedPayloadBytes = (0, _truncatestringtoutf8bytebudgetutil.utf8ByteLengthOf)(result.value.replace(_truncatestringtoutf8bytebudgetutil.TRUNCATION_SENTINEL, ''));
        expect(result.originalBytes).toBe(40_000);
        expect(result.truncated).toBe(true);
        expect(truncatedPayloadBytes).toBeLessThanOrEqual(cap + 3);
    });
    it('returns an empty value when the budget is zero', ()=>{
        const result = (0, _truncatestringtoutf8bytebudgetutil.truncateStringToUtf8ByteBudget)('hello', 0);
        expect(result.truncated).toBe(true);
        expect(result.value).toBe(_truncatestringtoutf8bytebudgetutil.TRUNCATION_SENTINEL);
    });
});

//# sourceMappingURL=truncate-string-to-utf8-byte-budget.spec.js.map