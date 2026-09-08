"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _jsonpreviewutil = require("../json-preview.util");
describe('jsonPreview', ()=>{
    it('keeps concrete scalar values', ()=>{
        expect((0, _jsonpreviewutil.jsonPreview)({
            id: 'abc',
            count: 3,
            active: true,
            deleted: null
        })).toEqual({
            id: 'abc',
            count: 3,
            active: true,
            deleted: null
        });
    });
    it('keeps every object key so the schema is visible', ()=>{
        const result = (0, _jsonpreviewutil.jsonPreview)({
            a: 1,
            b: 'two',
            c: true,
            d: null,
            e: 5,
            f: 6,
            g: 7
        });
        expect(Object.keys(result)).toEqual([
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g'
        ]);
    });
    it('limits arrays to the first items and notes the remaining count', ()=>{
        const result = (0, _jsonpreviewutil.jsonPreview)({
            items: Array.from({
                length: 10
            }, (_, index)=>({
                    id: index
                }))
        });
        expect(result.items).toEqual([
            {
                id: 0
            },
            {
                id: 1
            },
            {
                id: 2
            },
            '... (7 more items)'
        ]);
    });
    it('collapses dynamic-key maps whose values share a shape', ()=>{
        const failedStepLogs = {};
        for(let index = 0; index < 8; index++){
            failedStepLogs[`step-${index}`] = {
                reason: 'x'
            };
        }
        const result = (0, _jsonpreviewutil.jsonPreview)({
            failedStepLogs
        });
        const keys = Object.keys(result.failedStepLogs);
        expect(keys).toHaveLength(2);
        expect(keys).toContain('step-0');
        expect(keys).toContain('... (7 more keys)');
    });
    it('does not collapse maps whose values have differing shapes', ()=>{
        const result = (0, _jsonpreviewutil.jsonPreview)({
            a: {
                x: 1
            },
            b: {
                y: 1
            },
            c: {
                z: 1
            },
            d: [
                1
            ],
            e: 'str',
            f: 3
        });
        expect(Object.keys(result)).toHaveLength(6);
    });
    it('truncates long leaf strings', ()=>{
        const result = (0, _jsonpreviewutil.jsonPreview)({
            payload: 'a'.repeat(500)
        });
        expect(result.payload).toContain('truncated');
        expect(result.payload).toContain('total');
    });
    it('keeps the serialized preview under the hard cap', ()=>{
        const deeplyNested = {};
        let cursor = deeplyNested;
        for(let index = 0; index < 20; index++){
            const child = {
                field0: 'value',
                field1: 'value',
                field2: 'value'
            };
            cursor[`level-${index}`] = child;
            cursor = child;
        }
        const result = (0, _jsonpreviewutil.jsonPreview)(deeplyNested);
        expect(Buffer.byteLength(JSON.stringify(result))).toBeLessThanOrEqual(2048);
    });
});

//# sourceMappingURL=json-preview.util.spec.js.map