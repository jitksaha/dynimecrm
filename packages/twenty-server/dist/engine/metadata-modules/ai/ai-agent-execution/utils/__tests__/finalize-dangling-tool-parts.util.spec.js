"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _finalizedanglingtoolpartsutil = require("../finalize-dangling-tool-parts.util");
const buildToolPart = (state, overrides = {})=>({
        type: 'tool-execute_tool',
        toolCallId: 'call_1',
        input: {
            foo: 'bar'
        },
        state,
        ...overrides
    });
describe('finalizeDanglingToolParts', ()=>{
    it('returns an empty array unchanged', ()=>{
        expect((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([])).toEqual([]);
    });
    it('rewrites an input-available tool part to an interrupted output-error', ()=>{
        const result = (0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            buildToolPart('input-available')
        ]);
        expect(result[0]).toEqual({
            type: 'tool-execute_tool',
            toolCallId: 'call_1',
            input: {
                foo: 'bar'
            },
            state: 'output-error',
            errorText: 'Tool execution was interrupted.'
        });
    });
    it('leaves a completed tool part untouched', ()=>{
        const part = buildToolPart('output-available', {
            output: {
                ok: true
            }
        });
        expect((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            part
        ])).toEqual([
            part
        ]);
    });
    it('leaves an errored tool part with an input untouched', ()=>{
        const part = buildToolPart('output-error', {
            errorText: 'boom'
        });
        expect((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            part
        ])).toEqual([
            part
        ]);
    });
    it('backfills an empty input for an output-error part missing its input', ()=>{
        const part = buildToolPart('output-error', {
            input: undefined,
            errorText: 'Invalid input for tool execute_tool: Type validation failed'
        });
        expect((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            part
        ])).toEqual([
            {
                type: 'tool-execute_tool',
                toolCallId: 'call_1',
                input: {},
                state: 'output-error',
                errorText: 'Invalid input for tool execute_tool: Type validation failed'
            }
        ]);
    });
    it('preserves the existing error message when backfilling input', ()=>{
        const part = buildToolPart('output-error', {
            input: null,
            errorText: 'original validation error'
        });
        expect((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            part
        ])).toEqual([
            {
                type: 'tool-execute_tool',
                toolCallId: 'call_1',
                input: {},
                state: 'output-error',
                errorText: 'original validation error'
            }
        ]);
    });
    it('drops an input-streaming tool part with incomplete arguments', ()=>{
        const part = buildToolPart('input-streaming');
        expect((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            part
        ])).toEqual([]);
    });
    it('keeps surrounding parts when dropping an input-streaming part', ()=>{
        const text = {
            type: 'text',
            text: 'hello'
        };
        const streaming = buildToolPart('input-streaming');
        expect((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            text,
            streaming
        ])).toEqual([
            text
        ]);
    });
    it('leaves non-tool parts untouched', ()=>{
        const parts = [
            {
                type: 'text',
                text: 'hello'
            },
            {
                type: 'reasoning',
                text: 'thinking'
            }
        ];
        expect((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)(parts)).toEqual(parts);
    });
    it('drops a duplicate dynamic-tool part sharing a tool call id with a typed part', ()=>{
        const typed = buildToolPart('output-error', {
            type: 'tool-search_output',
            toolCallId: 'call_dup',
            errorText: 'boom'
        });
        const dynamicDuplicate = buildToolPart('output-error', {
            type: 'dynamic-tool',
            toolName: 'search_output',
            toolCallId: 'call_dup',
            errorText: 'boom'
        });
        expect((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            typed,
            dynamicDuplicate
        ])).toEqual([
            typed
        ]);
    });
    it('keeps the first part when a tool call id is duplicated across states', ()=>{
        const first = buildToolPart('output-error', {
            type: 'tool-execute_tool',
            toolCallId: 'call_dup',
            errorText: 'boom'
        });
        const duplicate = buildToolPart('output-error', {
            type: 'dynamic-tool',
            toolName: 'execute_tool',
            toolCallId: 'call_dup',
            errorText: 'boom'
        });
        expect((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            first,
            duplicate
        ])).toEqual([
            first
        ]);
    });
    it('finalizes only the dangling parts in a mixed batch', ()=>{
        const completed = buildToolPart('output-available', {
            toolCallId: 'call_done',
            output: {
                ok: true
            }
        });
        const dangling = buildToolPart('input-available', {
            toolCallId: 'call_pending'
        });
        const result = (0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            completed,
            dangling
        ]);
        expect(result[0]).toEqual(completed);
        expect(result[1]).toMatchObject({
            toolCallId: 'call_pending',
            state: 'output-error',
            errorText: 'Tool execution was interrupted.'
        });
    });
});

//# sourceMappingURL=finalize-dangling-tool-parts.util.spec.js.map