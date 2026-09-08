"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _deepsizebytesutil = require("../deep-size-bytes.util");
const CAP = 300_000;
describe('deepSizeBytes', ()=>{
    it('sizes primitives', ()=>{
        expect((0, _deepsizebytesutil.deepSizeBytes)(42, CAP)).toBe(8);
        expect((0, _deepsizebytesutil.deepSizeBytes)(true, CAP)).toBe(4);
        expect((0, _deepsizebytesutil.deepSizeBytes)(null, CAP)).toBe(0);
        expect((0, _deepsizebytesutil.deepSizeBytes)('ab', CAP)).toBe(12 + 2 * 2);
    });
    it('walks nested objects, arrays, Maps and Sets', ()=>{
        const withArray = (0, _deepsizebytesutil.deepSizeBytes)({
            items: [
                1,
                2,
                3
            ]
        }, CAP);
        const withoutArray = (0, _deepsizebytesutil.deepSizeBytes)({
            items: []
        }, CAP);
        expect(withArray).toBeGreaterThan(withoutArray);
        expect((0, _deepsizebytesutil.deepSizeBytes)(new Map([
            [
                'k',
                'v'
            ]
        ]), CAP)).toBeGreaterThan(0);
        expect((0, _deepsizebytesutil.deepSizeBytes)(new Set([
            1,
            2,
            3
        ]), CAP)).toBeGreaterThan(0);
    });
    it('is cycle-safe: a self-referential graph terminates and counts each object once', ()=>{
        const a = {};
        const b = {
            a
        };
        a.b = b;
        const cyclic = (0, _deepsizebytesutil.deepSizeBytes)(a, CAP);
        // Same two objects, no cycle — the cyclic walk must not double-count.
        const acyclic = (0, _deepsizebytesutil.deepSizeBytes)({
            b: {
                value: 1
            }
        }, CAP);
        expect(Number.isFinite(cyclic)).toBe(true);
        expect(cyclic).toBeGreaterThan(0);
        expect(cyclic).toBeLessThan(acyclic + 100);
    });
    it('stops at the node cap so a large graph cannot run unbounded', ()=>{
        const big = Array.from({
            length: 10_000
        }, (_, index)=>({
                index
            }));
        const capped = (0, _deepsizebytesutil.deepSizeBytes)(big, 5);
        const full = (0, _deepsizebytesutil.deepSizeBytes)(big, CAP);
        expect(capped).toBeLessThan(full);
    });
    it('counts primitive nodes toward the cap, so a huge flat array is bounded too', ()=>{
        const manyNumbers = Array.from({
            length: 10_000
        }, (_, index)=>index);
        const capped = (0, _deepsizebytesutil.deepSizeBytes)(manyNumbers, 10);
        const full = (0, _deepsizebytesutil.deepSizeBytes)(manyNumbers, CAP);
        expect(capped).toBeLessThan(full);
    });
});

//# sourceMappingURL=deep-size-bytes.util.spec.js.map