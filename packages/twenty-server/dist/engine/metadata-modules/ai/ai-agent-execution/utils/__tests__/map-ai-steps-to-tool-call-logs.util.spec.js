"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _mapaistepstotoolcalllogsutil = require("../map-ai-steps-to-tool-call-logs.util");
const buildStep = (content)=>({
        content
    });
describe('mapAiStepsToToolCallLogs', ()=>{
    it('returns an empty array when there are no steps', ()=>{
        expect((0, _mapaistepstotoolcalllogsutil.mapAiStepsToToolCallLogs)([])).toEqual([]);
    });
    it('pairs a tool-call with its tool-result into a single success entry', ()=>{
        const steps = [
            buildStep([
                {
                    type: 'tool-call',
                    toolName: 'findRecords',
                    toolCallId: 'call_1',
                    input: {
                        limit: 10
                    }
                },
                {
                    type: 'tool-result',
                    toolName: 'findRecords',
                    toolCallId: 'call_1',
                    input: {
                        limit: 10
                    },
                    output: {
                        totalCount: 2
                    }
                }
            ])
        ];
        const result = (0, _mapaistepstotoolcalllogsutil.mapAiStepsToToolCallLogs)(steps);
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            toolName: 'findRecords',
            toolCallId: 'call_1',
            state: 'success',
            output: {
                totalCount: 2
            }
        });
    });
    it('marks a tool-call followed by tool-error as error and records the message', ()=>{
        const steps = [
            buildStep([
                {
                    type: 'tool-call',
                    toolName: 'createNote',
                    toolCallId: 'call_2',
                    input: {
                        title: 'x'
                    }
                },
                {
                    type: 'tool-error',
                    toolName: 'createNote',
                    toolCallId: 'call_2',
                    input: {
                        title: 'x'
                    },
                    error: new Error('Validation failed')
                }
            ])
        ];
        const result = (0, _mapaistepstotoolcalllogsutil.mapAiStepsToToolCallLogs)(steps);
        expect(result).toHaveLength(1);
        expect(result[0].state).toBe('error');
        expect(result[0].errorMessage).toContain('Validation failed');
    });
    it('truncates oversized tool input and output', ()=>{
        const longString = 'x'.repeat(50_000);
        const steps = [
            buildStep([
                {
                    type: 'tool-call',
                    toolName: 'fetchUrl',
                    toolCallId: 'call_3',
                    input: {
                        html: longString
                    }
                },
                {
                    type: 'tool-result',
                    toolName: 'fetchUrl',
                    toolCallId: 'call_3',
                    input: {
                        html: longString
                    },
                    output: {
                        body: longString
                    }
                }
            ])
        ];
        const result = (0, _mapaistepstotoolcalllogsutil.mapAiStepsToToolCallLogs)(steps, {
            maxToolInputBytes: 100,
            maxToolOutputBytes: 100
        });
        const serializedInput = JSON.stringify(result[0].input);
        const serializedOutput = JSON.stringify(result[0].output);
        expect(serializedInput.length).toBeLessThan(200);
        expect(serializedInput).toContain('truncated');
        expect(serializedOutput.length).toBeLessThan(200);
        expect(serializedOutput).toContain('truncated');
    });
    it('stops collecting tool calls past the per-step cap', ()=>{
        const content = [];
        for(let i = 0; i < 10; i++){
            content.push({
                type: 'tool-call',
                toolName: 'noop',
                toolCallId: `call_${i}`,
                input: {}
            });
        }
        const steps = [
            buildStep(content)
        ];
        const result = (0, _mapaistepstotoolcalllogsutil.mapAiStepsToToolCallLogs)(steps, {
            maxToolCallsPerStep: 3
        });
        expect(result).toHaveLength(3);
    });
    it('preserves all web_search sources in tool output', ()=>{
        const manySources = Array.from({
            length: 25
        }, (_, index)=>({
                url: `https://example.com/${index}`,
                type: 'url'
            }));
        const steps = [
            buildStep([
                {
                    type: 'tool-call',
                    toolName: 'web_search',
                    toolCallId: 'call_search',
                    input: {}
                },
                {
                    type: 'tool-result',
                    toolName: 'web_search',
                    toolCallId: 'call_search',
                    input: {},
                    output: {
                        action: {
                            type: 'search',
                            query: 'twenty crm'
                        },
                        sources: manySources
                    }
                }
            ])
        ];
        const result = (0, _mapaistepstotoolcalllogsutil.mapAiStepsToToolCallLogs)(steps);
        const output = result[0].output;
        expect(output.sources).toHaveLength(25);
        expect(output.sourcesDroppedCount).toBeUndefined();
    });
    it('strips searchVector from nested record outputs', ()=>{
        const steps = [
            buildStep([
                {
                    type: 'tool-call',
                    toolName: 'find_companies',
                    toolCallId: 'call_find',
                    input: {}
                },
                {
                    type: 'tool-result',
                    toolName: 'find_companies',
                    toolCallId: 'call_find',
                    input: {},
                    output: {
                        result: {
                            count: '1',
                            records: [
                                {
                                    id: 'abc',
                                    name: 'Apple',
                                    searchVector: "'apple':1 'inc':2"
                                }
                            ]
                        }
                    }
                }
            ])
        ];
        const result = (0, _mapaistepstotoolcalllogsutil.mapAiStepsToToolCallLogs)(steps);
        const output = result[0].output;
        expect(output.result.records[0]).not.toHaveProperty('searchVector');
        expect(output.result.records[0].name).toBe('Apple');
    });
    it('ignores text / reasoning / source parts', ()=>{
        const steps = [
            buildStep([
                {
                    type: 'text',
                    text: 'hello'
                },
                {
                    type: 'reasoning',
                    text: 'thinking…',
                    state: 'done'
                },
                {
                    type: 'tool-call',
                    toolName: 'foo',
                    toolCallId: 'call_only',
                    input: {}
                }
            ])
        ];
        const result = (0, _mapaistepstotoolcalllogsutil.mapAiStepsToToolCallLogs)(steps);
        expect(result).toHaveLength(1);
        expect(result[0].toolName).toBe('foo');
    });
});

//# sourceMappingURL=map-ai-steps-to-tool-call-logs.util.spec.js.map