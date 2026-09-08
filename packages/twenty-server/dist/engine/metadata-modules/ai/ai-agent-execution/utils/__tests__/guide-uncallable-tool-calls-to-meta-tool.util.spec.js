"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _guideuncallabletoolcallstometatoolutil = require("../guide-uncallable-tool-calls-to-meta-tool.util");
const DIRECTLY_CALLABLE = new Set([
    'execute_tool',
    'learn_tools'
]);
const buildToolPart = (overrides = {})=>({
        type: 'tool-extract_json_paths',
        toolCallId: 'call_1',
        input: {
            fileId: 'abc'
        },
        state: 'output-error',
        errorText: "Model tried to call unavailable tool 'extract_json_paths'.",
        ...overrides
    });
const errorTextOf = (part)=>part.errorText;
describe('guideUncallableToolCallsToMetaTool', ()=>{
    it('appends learn_tools -> execute_tool guidance for a direct call to an uncallable tool', ()=>{
        const [part] = (0, _guideuncallabletoolcallstometatoolutil.guideUncallableToolCallsToMetaTool)([
            buildToolPart()
        ], DIRECTLY_CALLABLE);
        expect(errorTextOf(part)).toContain('learn_tools({ toolNames: ["extract_json_paths"] })');
        expect(errorTextOf(part)).toContain('execute_tool({ toolName: "extract_json_paths", arguments: { ... } })');
    });
    it('reads the tool name from a dynamic-tool part', ()=>{
        const [part] = (0, _guideuncallabletoolcallstometatoolutil.guideUncallableToolCallsToMetaTool)([
            buildToolPart({
                type: 'dynamic-tool',
                toolName: 'search_output',
                errorText: 'Tool execution was interrupted.'
            })
        ], DIRECTLY_CALLABLE);
        expect(errorTextOf(part)).toContain('execute_tool({ toolName: "search_output", arguments: { ... } })');
    });
    it('leaves failures of directly callable tools untouched', ()=>{
        const part = buildToolPart({
            type: 'tool-execute_tool',
            errorText: 'Tool "foo" not found.'
        });
        expect((0, _guideuncallabletoolcallstometatoolutil.guideUncallableToolCallsToMetaTool)([
            part
        ], DIRECTLY_CALLABLE)).toEqual([
            part
        ]);
    });
    it('leaves successful tool parts untouched', ()=>{
        const part = buildToolPart({
            state: 'output-available',
            output: {
                ok: true
            },
            errorText: undefined
        });
        expect((0, _guideuncallabletoolcallstometatoolutil.guideUncallableToolCallsToMetaTool)([
            part
        ], DIRECTLY_CALLABLE)).toEqual([
            part
        ]);
    });
    it('leaves non-tool parts untouched', ()=>{
        const parts = [
            {
                type: 'text',
                text: 'hello'
            }
        ];
        expect((0, _guideuncallabletoolcallstometatoolutil.guideUncallableToolCallsToMetaTool)(parts, DIRECTLY_CALLABLE)).toEqual(parts);
    });
});

//# sourceMappingURL=guide-uncallable-tool-calls-to-meta-tool.util.spec.js.map