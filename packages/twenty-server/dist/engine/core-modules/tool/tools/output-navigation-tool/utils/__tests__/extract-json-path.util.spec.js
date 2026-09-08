"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _extractjsonpathutil = require("../extract-json-path.util");
describe('parseJsonPath', ()=>{
    it('returns no accessors for root', ()=>{
        expect((0, _extractjsonpathutil.parseJsonPath)('$')).toEqual([]);
        expect((0, _extractjsonpathutil.parseJsonPath)('')).toEqual([]);
    });
    it('parses dot notation', ()=>{
        expect((0, _extractjsonpathutil.parseJsonPath)('$.steps.error')).toEqual([
            {
                type: 'key',
                key: 'steps'
            },
            {
                type: 'key',
                key: 'error'
            }
        ]);
    });
    it('parses bracket keys with dashes', ()=>{
        expect((0, _extractjsonpathutil.parseJsonPath)('$.failedStepLogs["abc-123"]')).toEqual([
            {
                type: 'key',
                key: 'failedStepLogs'
            },
            {
                type: 'key',
                key: 'abc-123'
            }
        ]);
    });
    it('parses index and slice', ()=>{
        expect((0, _extractjsonpathutil.parseJsonPath)('$.entries[2]')).toEqual([
            {
                type: 'key',
                key: 'entries'
            },
            {
                type: 'index',
                index: 2
            }
        ]);
        expect((0, _extractjsonpathutil.parseJsonPath)('$.entries[0:5]')).toEqual([
            {
                type: 'key',
                key: 'entries'
            },
            {
                type: 'slice',
                start: 0,
                end: 5
            }
        ]);
        expect((0, _extractjsonpathutil.parseJsonPath)('$.entries[-5:]')).toEqual([
            {
                type: 'key',
                key: 'entries'
            },
            {
                type: 'slice',
                start: -5,
                end: undefined
            }
        ]);
    });
    it('parses wildcard', ()=>{
        expect((0, _extractjsonpathutil.parseJsonPath)('$.failedStepLogs[*].details')).toEqual([
            {
                type: 'key',
                key: 'failedStepLogs'
            },
            {
                type: 'wildcard'
            },
            {
                type: 'key',
                key: 'details'
            }
        ]);
    });
    it('throws when path does not start with $', ()=>{
        expect(()=>(0, _extractjsonpathutil.parseJsonPath)('steps.error')).toThrow(_extractjsonpathutil.JsonPathError);
    });
    it('throws on unexpected token', ()=>{
        expect(()=>(0, _extractjsonpathutil.parseJsonPath)('$.steps#error')).toThrow(_extractjsonpathutil.JsonPathError);
    });
});
describe('extractJsonPath', ()=>{
    const data = {
        id: 'run-1',
        status: 'FAILED',
        steps: [
            {
                id: 's1',
                status: 'SUCCESS'
            },
            {
                id: 's2',
                status: 'FAILED'
            }
        ],
        failedStepLogs: {
            s2: {
                entries: [
                    1,
                    2,
                    3,
                    4,
                    5
                ],
                details: {
                    code: 'BOOM'
                }
            }
        }
    };
    it('extracts a nested key', ()=>{
        expect((0, _extractjsonpathutil.extractJsonPath)({
            data,
            path: '$.status',
            maxItems: 20,
            maxDepth: 5
        })).toBe('FAILED');
    });
    it('extracts via bracket key and array index', ()=>{
        expect((0, _extractjsonpathutil.extractJsonPath)({
            data,
            path: '$.steps[1].id',
            maxItems: 20,
            maxDepth: 5
        })).toBe('s2');
    });
    it('extracts an array slice', ()=>{
        expect((0, _extractjsonpathutil.extractJsonPath)({
            data,
            path: '$.failedStepLogs["s2"].entries[0:2]',
            maxItems: 20,
            maxDepth: 5
        })).toEqual([
            1,
            2
        ]);
    });
    it('extracts via wildcard over object values', ()=>{
        expect((0, _extractjsonpathutil.extractJsonPath)({
            data,
            path: '$.failedStepLogs[*].details',
            maxItems: 20,
            maxDepth: 5
        })).toEqual([
            {
                code: 'BOOM'
            }
        ]);
    });
    it('throws on missing key', ()=>{
        expect(()=>(0, _extractjsonpathutil.extractJsonPath)({
                data,
                path: '$.nope',
                maxItems: 20,
                maxDepth: 5
            })).toThrow(_extractjsonpathutil.JsonPathError);
    });
    it('throws on out-of-range index', ()=>{
        expect(()=>(0, _extractjsonpathutil.extractJsonPath)({
                data,
                path: '$.steps[9]',
                maxItems: 20,
                maxDepth: 5
            })).toThrow(_extractjsonpathutil.JsonPathError);
    });
});
describe('boundValue', ()=>{
    it('truncates arrays beyond maxItems with a marker', ()=>{
        const result = (0, _extractjsonpathutil.boundValue)([
            1,
            2,
            3,
            4,
            5
        ], 2, 5);
        expect(result).toEqual([
            1,
            2,
            '... (3 more items)'
        ]);
    });
    it('replaces structures deeper than maxDepth with type markers', ()=>{
        const result = (0, _extractjsonpathutil.boundValue)({
            a: {
                b: {
                    c: 1
                }
            }
        }, 20, 2);
        expect(result).toEqual({
            a: {
                b: 'object'
            }
        });
    });
    it('marks deep arrays with their length', ()=>{
        const result = (0, _extractjsonpathutil.boundValue)({
            a: {
                b: [
                    1,
                    2,
                    3
                ]
            }
        }, 20, 2);
        expect(result).toEqual({
            a: {
                b: 'array[3]'
            }
        });
    });
    it('truncates long string leaves', ()=>{
        const longString = 'x'.repeat(2000);
        const result = (0, _extractjsonpathutil.boundValue)(longString, 20, 5);
        expect(result).toContain('truncated, 2000 chars total');
        expect(result.length).toBeLessThan(longString.length);
    });
});

//# sourceMappingURL=extract-json-path.util.spec.js.map