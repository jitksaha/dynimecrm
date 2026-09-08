"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _ai = require("ai");
const _finalizedanglingtoolpartsutil = require("../finalize-dangling-tool-parts.util");
const _mapDBPartToUIMessagePart = require("../mapDBPartToUIMessagePart");
const _mapUIMessagePartsToDBParts = require("../mapUIMessagePartsToDBParts");
const toolPart = (state, overrides)=>({
        type: 'tool-execute_tool',
        input: {
            name: 'nav item'
        },
        state,
        ...overrides
    });
const persistAndReload = (parts)=>(0, _mapUIMessagePartsToDBParts.mapUIMessagePartsToDBParts)(parts, 'message-1', 'workspace-1').map((dbPart)=>(0, _mapDBPartToUIMessagePart.mapDBPartToUIMessagePart)(dbPart)).filter((part)=>part !== null);
const buildThread = (assistantParts)=>[
        {
            id: 'u1',
            role: 'user',
            parts: [
                {
                    type: 'text',
                    text: 'create 3 items'
                }
            ]
        },
        {
            id: 'a1',
            role: 'assistant',
            parts: assistantParts
        },
        {
            id: 'u2',
            role: 'user',
            parts: [
                {
                    type: 'text',
                    text: 'now revert them'
                }
            ]
        }
    ];
const unresolvedToolCallIds = async (messages)=>{
    const modelMessages = await (0, _ai.convertToModelMessages)(messages);
    const pending = new Set();
    for (const message of modelMessages){
        if (!Array.isArray(message.content)) {
            continue;
        }
        for (const content of message.content){
            if (typeof content !== 'object') {
                continue;
            }
            if (content.type === 'tool-call' && content.providerExecuted !== true) {
                pending.add(content.toolCallId);
            }
            if (content.type === 'tool-result') {
                pending.delete(content.toolCallId);
            }
        }
    }
    return [
        ...pending
    ];
};
// convertToModelMessages drops the `input` field when a tool part's input is
// nullish, so every reconstructed tool-call must carry a defined input.
const toolCallInputs = async (messages)=>{
    const modelMessages = await (0, _ai.convertToModelMessages)(messages);
    const inputs = [];
    for (const message of modelMessages){
        if (!Array.isArray(message.content)) {
            continue;
        }
        for (const content of message.content){
            if (typeof content === 'object' && content.type === 'tool-call') {
                inputs.push(content.input);
            }
        }
    }
    return inputs;
};
describe('finalizeDanglingToolParts round-trip', ()=>{
    const interruptedBatch = [
        {
            type: 'text',
            text: 'Creating items…'
        },
        toolPart('output-available', {
            toolCallId: 'done_1',
            output: {
                success: true
            }
        }),
        toolPart('input-available', {
            toolCallId: 'pending_1'
        }),
        toolPart('input-available', {
            toolCallId: 'pending_2'
        }),
        toolPart('input-streaming', {
            toolCallId: 'streaming_1'
        })
    ];
    it('reproduces the bug: input-available calls are left unresolved (input-streaming is not)', async ()=>{
        expect(await unresolvedToolCallIds(buildThread(interruptedBatch))).toEqual([
            'pending_1',
            'pending_2'
        ]);
    });
    it('resolves every tool call after finalize + persistence round-trip', async ()=>{
        const reloaded = persistAndReload((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)(interruptedBatch));
        expect(await unresolvedToolCallIds(buildThread(reloaded))).toEqual([]);
    });
    it('drops the input-streaming part through the round-trip', async ()=>{
        const reloaded = persistAndReload((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)(interruptedBatch));
        expect(reloaded.some((part)=>part.toolCallId === 'streaming_1')).toBe(false);
    });
    it('preserves the completed tool result through the round-trip', async ()=>{
        const reloaded = persistAndReload((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)(interruptedBatch));
        const toolResults = (await (0, _ai.convertToModelMessages)(buildThread(reloaded))).filter((message)=>message.role === 'tool').flatMap((message)=>Array.isArray(message.content) ? message.content : []);
        expect(toolResults).toEqual(expect.arrayContaining([
            expect.objectContaining({
                toolCallId: 'done_1',
                output: expect.objectContaining({
                    value: {
                        success: true
                    }
                })
            })
        ]));
    });
    // A tool call that failed input validation: persisted as output-error with
    // a null input (issue #21695).
    const validationErroredPart = {
        type: 'tool-execute_tool',
        toolCallId: 'validation_failed_1',
        state: 'output-error',
        errorText: 'Invalid input for tool execute_tool: Type validation failed'
    };
    it('replays a validation-errored tool part with a defined input', async ()=>{
        const reloaded = persistAndReload((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            validationErroredPart
        ]));
        const inputs = await toolCallInputs(buildThread(reloaded));
        expect(inputs).toHaveLength(1);
        expect(inputs[0]).toBeDefined();
        expect(inputs[0]).toEqual({});
    });
    it('keeps a validation-errored tool call resolved after the round-trip', async ()=>{
        const reloaded = persistAndReload((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            validationErroredPart
        ]));
        expect(await unresolvedToolCallIds(buildThread(reloaded))).toEqual([]);
    });
    it('persists an empty object rather than null for a missing tool input', ()=>{
        const [dbPart] = (0, _mapUIMessagePartsToDBParts.mapUIMessagePartsToDBParts)((0, _finalizedanglingtoolpartsutil.finalizeDanglingToolParts)([
            validationErroredPart
        ]), 'message-1', 'workspace-1');
        expect(dbPart.toolInput).toEqual({});
    });
});

//# sourceMappingURL=finalize-dangling-tool-parts.roundtrip.spec.js.map