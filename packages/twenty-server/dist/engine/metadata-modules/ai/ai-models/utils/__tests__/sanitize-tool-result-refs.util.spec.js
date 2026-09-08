"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _sanitizetoolresultrefsutil = require("../sanitize-tool-result-refs.util");
const SCHEMA_WITH_REFS = {
    tools: [
        {
            name: 'find_many_companies',
            inputSchema: {
                type: 'object',
                properties: {
                    filter: {
                        $ref: '#/$defs/__schema0'
                    }
                },
                $defs: {
                    __schema0: {
                        type: 'object'
                    }
                }
            }
        }
    ]
};
const getFirstToolResultPart = (prompt)=>{
    const toolMessage = prompt.find((message)=>message.role === 'tool');
    if (toolMessage?.role !== 'tool') {
        throw new Error('Expected a tool message in the prompt');
    }
    const toolResultPart = toolMessage.content.find((part)=>part.type === 'tool-result');
    if (toolResultPart?.type !== 'tool-result') {
        throw new Error('Expected a tool-result part in the tool message');
    }
    return toolResultPart;
};
describe('sanitizeToolResultRefs', ()=>{
    it('should serialize tool-result json output containing $ref/$defs to text', ()=>{
        const prompt = [
            {
                role: 'tool',
                content: [
                    {
                        type: 'tool-result',
                        toolCallId: 'call-1',
                        toolName: 'learn_tools',
                        output: {
                            type: 'json',
                            value: SCHEMA_WITH_REFS
                        }
                    }
                ]
            }
        ];
        const part = getFirstToolResultPart((0, _sanitizetoolresultrefsutil.sanitizeToolResultRefs)(prompt));
        if (part.output.type !== 'text') {
            throw new Error('Expected the output to be serialized to text');
        }
        expect(JSON.parse(part.output.value)).toEqual(SCHEMA_WITH_REFS);
    });
    it('should preserve output-level providerOptions when serializing to text', ()=>{
        const providerOptions = {
            google: {
                cacheControl: {
                    type: 'ephemeral'
                }
            }
        };
        const prompt = [
            {
                role: 'tool',
                content: [
                    {
                        type: 'tool-result',
                        toolCallId: 'call-1',
                        toolName: 'learn_tools',
                        output: {
                            type: 'json',
                            value: SCHEMA_WITH_REFS,
                            providerOptions
                        }
                    }
                ]
            }
        ];
        const part = getFirstToolResultPart((0, _sanitizetoolresultrefsutil.sanitizeToolResultRefs)(prompt));
        if (part.output.type !== 'text') {
            throw new Error('Expected the output to be serialized to text');
        }
        expect(part.output.providerOptions).toEqual(providerOptions);
    });
    it('should convert error-json output containing refs to error-text', ()=>{
        const prompt = [
            {
                role: 'tool',
                content: [
                    {
                        type: 'tool-result',
                        toolCallId: 'call-1',
                        toolName: 'learn_tools',
                        output: {
                            type: 'error-json',
                            value: SCHEMA_WITH_REFS
                        }
                    }
                ]
            }
        ];
        const part = getFirstToolResultPart((0, _sanitizetoolresultrefsutil.sanitizeToolResultRefs)(prompt));
        if (part.output.type !== 'error-text') {
            throw new Error('Expected the output to be serialized to error-text');
        }
        expect(JSON.parse(part.output.value)).toEqual(SCHEMA_WITH_REFS);
    });
    it('should leave tool results without refs untouched', ()=>{
        const value = {
            success: true,
            result: {
                id: '1',
                name: 'Acme'
            }
        };
        const prompt = [
            {
                role: 'tool',
                content: [
                    {
                        type: 'tool-result',
                        toolCallId: 'call-1',
                        toolName: 'find_one_company',
                        output: {
                            type: 'json',
                            value
                        }
                    }
                ]
            }
        ];
        const part = getFirstToolResultPart((0, _sanitizetoolresultrefsutil.sanitizeToolResultRefs)(prompt));
        expect(part.output.type).toBe('json');
        expect(part.output).toEqual({
            type: 'json',
            value
        });
    });
    it('should not touch non-tool messages', ()=>{
        const prompt = [
            {
                role: 'system',
                content: 'You are helpful.'
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'hello'
                    }
                ]
            }
        ];
        expect((0, _sanitizetoolresultrefsutil.sanitizeToolResultRefs)(prompt)).toEqual(prompt);
    });
});

//# sourceMappingURL=sanitize-tool-result-refs.util.spec.js.map